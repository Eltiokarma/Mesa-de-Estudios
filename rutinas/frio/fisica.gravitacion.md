# Lector en frío: fisica.gravitacion

Ronda 1 (26 nov), con el método de `docs/metodo/unidad/lector-delegado.md`; capturas `--entera --lector` (primer estado
de cada momento) en el scratchpad `cierre-grav/lector`. Dos lectores nuevos, sin código: A para los momentos de las ideas
1 a 3 y las tarjetas 01 a 09; B para los momentos de las ideas 4 a 6 y las tarjetas 10 a 18 (n.º 3, 8 y 14 de cada idea).

## Veredicto de la sesión

Las cuentas pasan: los dos lectores resolvieron cada Predice, «Ahora tú» y su ejercicio propio. La falla es de
presentación: el texto de todos los dibujos sale roto (letras separadas, «GM» como «CM»); los deslizadores de los juegos
1 y 2 no cuadran con el dibujo; r₁ y r₂ dibujados iguales; subíndices crudos o anidados; jerga en reglas y Datos;
resueltos de nivel 3 que se saltan el despeje; en Kepler, «a» con dos significados y una regla que no trae lo que
piden los ejercicios.

## Lector en frío A: Gravitación universal (ideas 1 a 3 y tarjetas 01 a 09)

Soy alumno de 5.º de Juliaca y miré solo las capturas. De Lee y de «Así se resuelve» solo veo la primera tarjeta o el primer paso, y de Mira solo el paso 1. Lo digo una vez aquí y no lo cuento como falla.

**Lo que se repite en todas las pantallas:**
- Los rótulos del dibujo salen con las letras separadas: «Ref er encia», «Planet a y sonda», «La f uer za est á por medir», «Cer o de E_PG en el inf init o», «Der echa posit iva». Se leen, pero se ven rotos.
- «GM» sale con una C rara («ϹM»), y «GJ» se ve como «CJ».
- Los exponentes del dibujo («10² ⁴», «10¹ ⁴») salen con un espacio entre las cifras. En el texto se ven bien.

### Idea 1: Ley de gravitación universal (cuadrado-inverso)

- **Lee.** Veo un planeta (M), una sonda con paneles (m) y la distancia r entre los dos. Hay dos ensayos, uno con 12 000 km y otro con 18 000 km, los dos con M = 6×10²⁴ kg y m = 600 kg, y la fuerza «por medir». Me piden leer. Entendí que la fuerza jala la sonda hacia el planeta.
- **Juega.** La misión es dejar la fuerza en la cuarta parte de la de referencia. Muevo un deslizador de separación (en «veces»). Las letras están explicadas: M, m, r y F. Comprobé las cuentas: la referencia da 1667,5 N (con G = 6,67×10⁻¹¹) y el elegido, con 13 599,24 km, da 0,779 veces. Están bien. **Duda:** el deslizador dice «1,1 veces» y el dibujo dice 13 599,24 km, que son 1,133 veces. Además, ese número con decimales en km se ve raro. Aprendí que si alejo la sonda, la fuerza baja más rápido que la distancia.
- **Predice.** F_ref = 160 N, M se duplica, m se triplica y r se duplica. La cuenta es 160·2·3/4 = 240 N, la D. Se entiende bien.
- **Mira (paso 1).** Es la fórmula de cocientes: F_nueva/F_ref = (M_n/M_ref)(m_n/m_ref)(r_ref/r_nuevo)². Es clara. Aprendí a comparar sin usar G.
- **La regla.** F = G·M·m/r². El «Vale si» se entiende. **Duda:** el dibujo trae datos (5×10²⁴ kg, 200 kg, 15 000 km), pero nadie los usa ni calcula F con ellos. Pensé que tenía que hacer algo con esos números.
- **Así se resuelve (paso 1).** El caso es 820 N con ×2, ×1,5 y ×2. **Falla de forma:** en el recuadro «Datos», la fórmula de cocientes se parte en dos líneas y el «)²» queda solo abajo.
- **Ahora tú.** 320·2·1,5/4 = 240 N, la D. Tiene la misma fórmula partida en «Datos», con «)²» suelto.
- **Mi ejercicio.** F_ref = 90 N. Si la masa de la sonda baja a la mitad y la distancia se triplica: F = 90·0,5/9 = 5 N.

### Idea 2: Campo gravitatorio y peso (campo-gravitatorio)

- **Lee.** Veo el planeta, una sonda de 20 kg, r = 8000 km y GM = 4×10¹⁴ m³/s², con «El medidor de fuerza está apagado». Me explica qué es una masa de prueba. Se entiende. **Duda:** GM sale en negro, sin color, y no sé todavía qué es «GM».
- **Juega.** La misión es una sonda que pese 250 N. Cada kilogramo recibe 6,25 N; comprobé que 4×10¹⁴/(8×10⁶)² = 6,25, y está bien. Para 250 N tocan 40 kg. **Dudas:** el deslizador dice «23 kg», pero el dibujo dice «m ≈ 23,5 kg» y «F ≈ 146,872 N». Con 23,5 kg sale 146,875 N y con 23 kg sale 143,75 N, así que no cuadra con ninguno. La leyenda dice que r va «en kilómetros» mientras GM va en m³/s², y no me avisan que debo pasar a metros. Aprendí que el peso cambia con la masa, pero el campo del lugar no.
- **Predice.** g₀ = 18 N/kg y h = 2R. Entonces r = 3R y g = 18/9 = 2 N/kg, la D. El dibujo marca R y h, y está bien. Lo único es que el rótulo «R: radio del planeta» está pegado a la cota chica.
- **Mira (paso 1).** r = R + h = 3R. Es claro.
- **La regla.** g = GM/r², F = m·g y r = R + h. **Dudas:** «una balanza mide apoyo» no lo entendí. g sale en negro, sin color, en la fórmula. El dibujo muestra r = 10 000 km y GM = 7×10¹⁴, pero ni R ni h aparecen en el dibujo, aunque la fórmula los usa.
- **Así se resuelve (paso 1).** GM = 4,1×10¹⁵ y r = 9000 km. Da 50,6 N/kg. Es claro.
- **Ahora tú.** 1,1×10¹⁵/(9×10⁶)² ≈ 13,58 N/kg, la A. La opción C (10⁸) es el error de no pasar los km a m; está bien pensada.
- **Mi ejercicio.** GM = 4×10¹⁴ y la sonda está a 20 000 km del centro: g = 4×10¹⁴/4×10¹⁴ = 1 N/kg. Una sonda de 50 kg pesa ahí 50 N.

### Idea 3: Energía gravitatoria (energia-gravitatoria)

- **Lee.** Hay dos posiciones (8000 km y 12 000 km), con 400 kg y GM = 4×10¹⁴, y E_PG «está por comparar». La tarjeta recuerda E = m·g·h y dice que aquí cambia. Se entiende. **Duda:** aquí el planeta se dibuja mucho más grande que en las ideas 1 y 2.
- **Juega.** La misión es dejar la sonda en −10 GJ. Comprobé −4×10¹⁴·400/8×10⁶ = −20 GJ, y está bien. Para −10 GJ toca ir a 16 000 km, y esa opción está entre los botones. Las letras están explicadas. Aprendí que más lejos la energía es menos negativa.
- **Predice.** De 10 000 a 20 000 km con 300 kg: ΔE = +6 GJ, la A. **Duda:** en el dibujo, r₁ = 10 000 km y r₂ = 20 000 km tienen la misma longitud. Lo que cambia es justo la distancia, y el dibujo no lo muestra. Dice «sin escala», pero confunde.
- **Mira (paso 1).** E_PG = −GM·m/r. Es claro.
- **La regla.** Otra vez r₁ = 12 000 km y r₂ = 24 000 km se dibujan iguales. La frase «la gravedad realiza el trabajo opuesto» me costó: ¿opuesto a qué? Tilo aclara bien el signo negativo.
- **Así se resuelve (paso 1).** 710 kg a 13 000 km da ≈ −32,8 GJ. «Datos» trae «1 km/s = 1000 m/s», que aquí no sirve para nada.
- **Ahora tú.** −2×10¹⁴·110/7×10⁶ ≈ −3,143 GJ, la D. Las opciones están bien.
- **Mi ejercicio.** GM = 4×10¹⁴ y una sonda de 100 kg pasa de 8000 a 16 000 km. E₁ = −5 GJ y E₂ = −2,5 GJ, así que ΔE = +2,5 GJ y la gravedad hace un trabajo de −2,5 GJ.

### Parte 2: tarjetas

- **01 (nivel 3, fuerza).** Piden la fuerza. Están todos los datos y el resuelto se sigue. 6,67×10⁻¹¹·4×10²⁴·500/10¹⁴ = 1334 N, y está bien. El dibujo ayuda y no regala la respuesta. Lo único raro es que el enunciado da 1×10⁷ m y el dibujo dice 10 000 km; es lo mismo, pero en otra unidad.
- **02 (nivel 8, masa desconocida).** Piden la masa de la sonda. Está todo y el resuelto se sigue. 667·10¹⁴/(6,67×10⁻¹¹·4×10²⁴) = 250 kg, y está bien. El dibujo ayuda. Podría poner «m = ?» junto a la sonda, porque la «m» está sola.
- **03 (nivel 14, fuerza nula).** Piden dónde se anula la fuerza. Comprobé las cuentas: r_B/r_A = 0,75 y r_A = 10 000/1,75 = 5714,286 km, y están bien. También cuadran los distractores 6400 y 4285,714. **Me pierdo** en la segunda fórmula, r_A = 10 000/(1 + √…), porque no muestra que r_A + 0,75 r_A = D. El «10 000» va sin unidad. En «Datos» las fórmulas salen escritas como código, «F_A = G·M_A·m/r_A^2», con guiones bajos. Si 4285,714 es r_B, la explicación de 13 333,333 («omite sumar separaciones») no me queda clara.
- **04 (nivel 3, masa por peso).** 588/12 = 49 kg, y está bien. Es muy clara. No tiene dibujo, pero no hace falta.
- **05 (nivel 8, altura).** r = 6×10⁶·√16 = 2,4×10⁷ m y h = 18 000 km, y está bien. **Me pierdo un poco** en la primera fórmula, porque salta de g/g₀ = (R/r)² a r = R·√(g₀/g) sin decir «despejamos». El 6000 km aparece como 6×10⁶ sin mostrar la conversión. No tiene dibujo, y aquí sí ayudaría ver R y h. «La altura es no negativa» suena raro.
- **06 (nivel 14, altura por peso).** g = 3 N/kg, r = 2,1×10⁷ m y h = 14 000 km, y está bien. Los distractores también cuadran (56 000 y −4666,667). Se sigue bien, aunque tiene el mismo salto de despeje que la 05. No tiene dibujo.
- **07 (nivel 3, ΔE).** (−3) − (−8) = +5 GJ, y está bien. Es clara. El dibujo dibuja r₁ y r₂ iguales, cuando −3 GJ debería estar más lejos. Sobra o confunde un poco.
- **08 (nivel 8, distancia por energía).** 2×10¹⁴·360/4,5×10⁹ = 1,6×10⁷ m = 16 000 km, y está bien. **Me pierdo** en el paso de r = −GM·m/E_PG a «r = 16 000 km», porque no muestra el reemplazo de los números ni que 4,5 GJ = 4,5×10⁹ J. «1 km/s» sobra en «Datos».
- **09 (nivel 14, ida y vuelta).** E₁ = −14 GJ, E₃ = −8 GJ y W = −6 GJ, y está bien. **Me pierdo** en «E_PG1 = −14 GJ; E_PG3 = −8 GJ», que aparecen sin ninguna cuenta. La explicación de los distractores repite «conservaste solo ese valor» dos veces. En el dibujo, r₁ = 8000 km y r₃ = 14 000 km tienen la misma longitud, y el r₂ intermedio solo sale como texto en la primera posición. «Datos» da W_g = −ΔE, que es casi el método.

**Las 3 que mejor se entienden:** 04, 01 y 02. **Las 3 que peor:** 03, 09 y 08.

**Niveles:** sí suben de verdad. El nivel 3 es reemplazar en una fórmula, el 8 es despejar y el 14 son dos pasos o dos fuentes. El problema es que en el nivel 14 el resuelto se salta justo los pasos difíciles.

**Recuadro «Datos»:** ayuda, porque trae la fórmula y las conversiones. A veces distrae con cosas que no se usan («1 km/s»). En la 09 casi regala el método (W_g = −ΔE). En la 03 está escrito como código.

### Lo que me trabó
- Todas las ideas, rótulos del dibujo: las letras salen separadas («Ref er encia», «planet a», «inf init o»), «GM» sale como «ϹM» y «GJ» como «CJ».
- Idea 1, Juega: el deslizador dice «1,1 veces», pero el dibujo dice 13 599,24 km (1,133 veces).
- Idea 1, La regla: el dibujo trae M, m y r que nadie usa.
- Idea 1, Así se resuelve y Ahora tú: en «Datos», la fórmula de cocientes se parte y el «)²» queda solo en otra línea.
- Idea 2, Juega: el deslizador dice 23 kg, pero el dibujo dice m ≈ 23,5 kg y F ≈ 146,872 N, que no cuadra con ninguna de las dos masas.
- Idea 2, Juega: la leyenda pone r en km con GM en m³/s², y no avisa que hay que convertir.
- Idea 2, La regla: «una balanza mide apoyo» no se entiende. g va sin color, y R y h están en la fórmula pero no en el dibujo.
- Idea 3, Predice y La regla: r₁ y r₂ se dibujan iguales, aunque una es el doble de la otra.
- Idea 3, La regla: «la gravedad realiza el trabajo opuesto», ¿opuesto a qué?
- Idea 3, Así se resuelve y Ahora tú, y tarjetas 08 y 09: «1 km/s = 1000 m/s» sobra en «Datos».
- Tarjeta 03: en el resuelto, r_A = 10 000/(1+√…) sale sin explicar, y el 10 000 va sin unidad. «Datos» está escrito como código (F_A, r_A^2).
- Tarjeta 03: no entiendo la explicación del distractor 13 333,333 («omite sumar separaciones»).
- Tarjetas 05 y 06: el despeje r = R·√(g₀/g) aparece sin decir que se despeja. La 05 no tiene dibujo.
- Tarjeta 07: r₁ y r₂ se dibujan iguales, aunque las energías son distintas.
- Tarjeta 08: el resuelto salta de la fórmula a «16 000 km» sin reemplazar los números ni pasar los GJ a J.
- Tarjeta 09: E_PG1 = −14 GJ y E_PG3 = −8 GJ aparecen sin cuenta. Dos distractores tienen la misma explicación. r₁ y r₃ se dibujan iguales.

## Lector en frío B: Gravitación universal, ideas 4 a 6 y tarjetas 10 a 18

Soy un alumno de 5.º de Juliaca. Solo miré los PNG. De Lee, Mira y «Así se resuelve» solo veo la primera tarjeta o el primer paso. Lo digo esta vez y no lo cuento como falla.

**Algo que pasa en todas las pantallas:** el texto que va dentro del dibujo sale con los espacios rotos y algunas letras cambiadas. Ejemplos: «Un sat élit e y un planet a», «Ct r a ór bit a» (debe ser «Otra órbita»), «Ćr bit a alr ededor» («Órbita alrededor»), «Pr imer a ór bit a», «CM = 4 × 10¹ ⁴» (la G se ve como C y el exponente sale partido en «1 4»). Lo puedo adivinar, pero se ve roto y la «CM» confunde de verdad: el recuadro «Datos» dice «GM».

### Idea 4: Órbitas circulares

- **1 Lee.** Veo el planeta M (morado), el satélite m con la flecha v (naranja), GM = 4×10¹⁴, r = 16 000 km y v = 2 km/s. La tarjeta 1/3 dice qué es un satélite y qué es una órbita. Me piden leer. Las letras se entienden. Duda: los datos numéricos aparecen sin que todavía sepa para qué sirven.
- **2 Juega.** Planeta, satélite, botones de rapidez (2, 4, 5 y 6 km/s) y un reloj. La misión pide igualar g con v²/r. Con 2 km/s: g ≈ 1,563 y v²/r = 0,25. Lo comprobé y está bien. La leyenda explica cada letra, y eso me ayudó. Aprendí que con 5 km/s la gravedad da justo la aceleración para girar (√(GM/r) = 5 km/s). Duda: el reloj marca 700 s, pero se lee «vemos solo el lanzamiento» y «solo se muestra el estado inicial». No entiendo para qué está el reloj si no avanza.
- **3 Predice.** v₁ = 8 km/s y r₂ = 4r₁. Respondo C, 4 km/s (v ∝ 1/√r). Las opciones son buenas.
- **4 Mira.** Paso 1/6: GMm/r² = mv²/r, con los colores bien amarrados. Aprendí que la gravedad hace de fuerza centrípeta y no es una fuerza aparte.
- **5 Regla.** v = √(GM/r) y T = 2πr/v, con «Vale si». Se entiende. Duda: Tilo dice «la energía mecánica circular es la mitad de la potencial» y en esta pantalla no hay ninguna fórmula de energía. Además, el «Vale si» habla de energía potencial cero en el infinito, cosa que esta regla no usa. La m = 150 kg del dibujo sobra, aunque la regla dice que se cancela, y quizá sea a propósito.
- **6 Así se resuelve.** Veo solo el paso 1. Los «Datos» traen «1 min = 60 s; 1 h; 1 MJ = 10⁶ J», que no sirven para este problema. Además ya dan la fórmula v² = GM/r.
- **7 Ahora tú.** v² = 2,4×10¹⁴ / 7,2×10⁶ = 3,33×10⁷, así que v = 5 773,5 m/s = 5,774 km/s. Es la C. Hay distractores buenos: «5 773,503 km/s» castiga al que no pasa a km.
- **Mi ejercicio:** GM = 4×10¹⁴ m³/s² y r = 10 000 km. Entonces v = √(4×10¹⁴ / 10⁷) = √(4×10⁷) ≈ 6 325 m/s ≈ 6,32 km/s, y T = 2π·10⁷ / 6 325 ≈ 9 934 s ≈ 2,76 h.

### Idea 5: Leyes de Kepler

- **1 Lee.** Una elipse con el planeta en un foco, el satélite cerca, a = 10 000 km, e = 0,6, R = 2 000 km y T = 20 h. La tarjeta explica elipse y focos. Medí el dibujo: el foco está a 0,6a del centro y cuadra. Duda: la flecha de «a» empieza en el centro de la elipse, que no está marcado.
- **2 Juega.** El sector barrido, la duración del intervalo y el lugar de inicio. La misión pide barrer 1/5 del área. Aprendí que 1/5 de 20 h son 4 h, empiece donde empiece: ese es el chiste de la segunda ley. Duda: no entiendo qué hace el control «Parte del intervalo (0 inicio, 1 final) 0,07».
- **3 Predice.** T_A = 3 años, a_A = 2 UA y a_B = 8 UA. T_B = 3·4^{3/2} = 24 años: es la A. Duda: el «Datos» trae 1 UA = 149 597 870 700 m, que no se necesita. Distrae.
- **4 Mira.** Paso 1/4: la primera ley, con «a: tamaño fijo; r: separación que cambia». Pero los dos dibujos son círculos donde a = r, así que justo aquí no veo la diferencia. Aprendí que a es de toda la elipse y r cambia.
- **5 Regla.** Hay tres leyes en un solo texto y la fórmula T_B²/T_A² = a_B³/a_A³. El «Vale si» mete r_p v_p = r_a v_a. **Me confundí:** «a» es el semieje y «a» también es el subíndice de «lejano», en r_a y v_a.
- **6 Así se resuelve / 7 Ahora tú.** Piden la separación mínima: r_p = a(1 − e). En «Ahora tú»: 10 250 · 0,8 = 8 200 km, la D. Duda: esa fórmula r_p = a(1 − e) no está en la Regla, solo en «Datos», y la Regla me enseñó otra (la tercera ley). El satélite del dibujo está abajo, no en el punto más cercano, así que el dibujo no me muestra r_p.
- **Mi ejercicio:** a = 20 000 km y e = 0,5. Entonces r_p = 10 000 km y r_a = 30 000 km. Si T = 10 h, en 2 h barre el 20 % del área.

### Idea 6: Rapidez de escape

- **1 Lee.** Hay dos dibujos, «Referencia» (6 km/s) y «Ensayo elegido» (8 km/s): planeta, sonda, flecha v₀, r₀ = 8 000 km, m = 100 kg y GM. La tarjeta explica la salida radial. Duda: «E_M está por comparar» no me dice nada todavía.
- **2 Juega.** Botones de 6 a 11 km/s. Con 6 km/s: E_M = ½·100·36×10⁶ − 4×10¹⁴·100/8×10⁶ = 1,8 − 5 = −3,2 GJ. Comprobado. Aprendí que si E < 0, la sonda vuelve, y que el umbral está en 10 km/s. Duda: con 6 elegido, «Referencia» y «Ensayo elegido» se ven idénticos y no sé cuál cambia.
- **3 Predice.** v_esc = 10 km/s desde la superficie y luego se parte desde 4R. Respondo D, 5 km/s. Dudas: el dibujo dice «r₀ = ?», pero el «Datos» sí la da (4R). «M nueva: 1 veces» suena raro. El dibujo pone la sonda lejos del planeta, mientras que la referencia es «desde la superficie».
- **4 Mira.** Paso 1/4: E_C + E_PG = 0 en el umbral. Se entiende.
- **5 Regla.** v_esc = √(2GM/r). **La primera frase no se entiende:** «la energía mecánica fija si la sonda retorna». Le falta un verbo o algo. El resto sí lo entendí: con energía cero está el umbral, por encima sobra rapidez y por debajo vuelve. GM sale en negro, cuando antes M era morada.
- **6 Así se resuelve.** Solo el paso 1. El «Datos» ya trae la fórmula.
- **7 Ahora tú.** 2·6,4×10¹³ / 8×10⁶ = 1,6×10⁷, así que v = 4 000 m/s = 4 km/s. Es la C. Los distractores son buenos.
- **Mi ejercicio:** GM = 4×10¹⁴ m³/s² y r = 20 000 km. Entonces v_esc = √(8×10¹⁴ / 2×10⁷) = √(4×10⁷) ≈ 6,32 km/s.

### Parte 2: tarjetas 10 a 18

Revisé todas las cuentas y están bien.

- **10 (órbita, nivel 3).** Piden r con v = 4 km/s. Tengo todo, porque «Datos» da la fórmula. El resuelto se sigue, aunque escribe «4 000²» sin decir que pasó a m/s. 4,8×10¹⁴ / 1,6×10⁷ = 3×10⁷ m = 30 000 km ✓. El dibujo ayuda y no da la respuesta. Lo raro: «1 min, 1 h, 1 MJ» en «Datos» sobran.
- **11 (órbita, nivel 8).** Piden M con r = 10 000 km y T = 12 000 s. Tengo todo: G, T = 2πr/v y v² = GM/r. v = 5 235,988 m/s ✓ y M = v²r/G ≈ 4,11×10²⁴ kg ✓. Me pierdo un poco en «M = v²·r/G»: no muestra los números sustituidos. Mostrar tres decimales en la rapidez es demasiado. El dibujo ayuda.
- **12 (órbita, nivel 14).** Piden T con E = −4 000 MJ y m = 500 kg. Tengo todo. r = 30 000 km ✓, v = 4 000 m/s ✓ y T = 785,398 min ✓. Los distractores están explicados (A = usar E = −GMm/r: 2 221,4 ✓). El resuelto se sigue. Lo raro: el título «Una energía determina la vuelta» es vago, y «energía mecánica circular» es una frase rara. La m (satélite) y la M (planeta) tienen el mismo color morado.
- **13 (Kepler, nivel 3).** Piden a con r_p = 6 000 km y r_a = 18 000 km. a = 12 000 km ✓. Es clarísima. El dibujo no marca r_p ni r_a, porque el satélite está abajo. Otra vez el subíndice «a» choca con el semieje «a».
- **14 (Kepler, nivel 8).** Piden el tiempo para barrer el 15 % con T = 36 h. Da 5,4 h ✓. La frase «la relación vale tanto cerca como lejos» queda metida entre las dos líneas de cálculo, pero se sigue. El dibujo no muestra el sector barrido, así que no ayuda. Es más fácil que la tarjeta 13: no sube de nivel.
- **15 (Kepler, nivel 14).** T_B = 32 días ✓ y a_B³ = 27·64 = 1 728, así que a_B = 12 millones de km ✓. Los distractores cuadran (24 lineal, 192 sin raíz cúbica, 0,75 invertida, 8,485 raíz cuadrada). **Me confundí:** «A» y «B» son los cuerpos y también las alternativas («A: supone una relación lineal»). El dibujo es de una sola órbita y no ayuda.
- **16 (escape, nivel 3).** Piden v_esc con v_c = 4 km/s. 4√2 = 5,657 ✓. El «Datos» da las dos fórmulas, y eso casi regala la respuesta. El dibujo con «r₀ = ?» sobra.
- **17 (escape, nivel 8).** 14·√(2/8) = 7 km/s ✓. Lo raro: los subíndices salen pegados, «v_escnueva» y «v_escref», y parecen código.
- **18 (escape, nivel 14).** v = 9√6 ≈ 22,045 km/s ✓. Los distractores cuadran. Lo raro: «g_superficie» se lee con guion bajo, como código. El «campo superficial» aparece en negro. El dibujo pone la sonda lejos del planeta cuando el problema es desde la superficie: contradice el enunciado.

**Las que mejor se entienden:** 13, 10 y 16. **Las que peor:** 15 (A y B se cruzan), 18 (g_superficie y el dibujo que contradice) y 12 (título vago y frase rara). **¿Suben los niveles?** En órbita y en escape, sí. En Kepler, la 8 es más fácil que la 3, y la 14 da un salto grande. **El recuadro «Datos»** ayuda porque trae las condiciones, pero casi siempre trae la fórmula exacta que se necesita, y eso regala el camino. Mete también conversiones que no se usan (min, h, MJ, UA), y eso distrae.

### Lo que me trabó

- Todas las ideas y tarjetas, texto dentro del dibujo: espacios rotos y letras cambiadas («Ct r a ór bit a», «Ćr bit a», «CM» en vez de «GM», «10¹ ⁴»).
- Órbita circular, Juega: el reloj marca 700 s, pero dice «solo se muestra el estado inicial». No sé qué hace el reloj.
- Órbita circular, Regla: Tilo habla de la energía, «la mitad de la potencial», sin fórmula en pantalla.
- Órbita circular, Así se resuelve y Ahora tú, y tarjetas 10 y 12: «Datos» con conversiones que no se usan (min, h, MJ).
- Kepler, Juega: no entiendo el control «Parte del intervalo (0 inicio, 1 final)».
- Kepler, Mira paso 1: explica a contra r con dos círculos, donde a = r.
- Kepler, Regla y tarjeta 13: «a» es el semieje y también el subíndice de «lejano» (r_a, v_a).
- Kepler, Así se resuelve y Ahora tú: piden r_p = a(1 − e), que no está en la Regla (la Regla enseña la tercera ley).
- Kepler, Predice: «1 UA = 149 597 870 700 m» sobra.
- Tarjeta 14: el nivel 8 es más fácil que el nivel 3 (tarjeta 13), y el dibujo no muestra el sector barrido.
- Tarjeta 15: «A» y «B» son cuerpos y también alternativas.
- Escape, Juega: con 6 km/s, «Referencia» y «Ensayo elegido» se ven idénticos.
- Escape, Predice: el dibujo dice «r₀ = ?» aunque «Datos» la da, y «M nueva: 1 veces» suena raro.
- Escape, Regla: la frase «la energía mecánica fija si la sonda retorna» no se entiende.
- Escape, Regla: GM en negro, cuando antes M era morada.
- Tarjeta 17: subíndices «escnueva» y «escref» pegados.
- Tarjeta 18: «g_superficie» con guion bajo, y el dibujo pone la sonda lejos aunque el problema es desde la superficie.
- Tarjetas 10, 11, 16, 17 y 18: «Datos» trae la fórmula exacta y regala el camino.

## Correcciones de la ronda 1 (26 nov)

Hechas en el mismo pase que la auditoría (`rutinas/auditoria/fisica.gravitacion.md`, «Correcciones»), cada una con su
prueba y miradas en las capturas de después (`scratchpad/cierre-grav/despues/`).

| Lo que trabó | Qué se hizo |
|---|---|
| Texto roto en todos los dibujos («Ref er encia», «CM», «10¹ ⁴») | La pieza `fis-gravitacion` escribe el texto seguido; subíndices con `dy` (A1). |
| Juegos 1 y 2: el control no cuadra con el dibujo | Dibujo y lectura con el valor que muestra el control; lectura «Peso: 40 kg · 6,25 N/kg = 250 N» (M3). |
| Idea 1: «)²» solo en Datos | Datos con la ley general; el atajo queda en Mira y en el resuelto (M4). |
| Idea 1, tarjeta 03: despeje sin explicar, «10 000» sin unidad, Datos como código, «omite sumar separaciones» | r_A + 0,75 · r_A = 10 000 km y r_A = 10 000/1,75; Datos con notación; «divide D entre la razón» (M7, M9). |
| Idea 2: «una balanza mide apoyo», «1 veces» | «Una balanza mide cuánto la aprietan, no el peso»; «1 vez» (M8). |
| Tarjetas 05 y 06: despeje sin decir | «Despejamos r de la relación de campos: r = R · √(g₀ / g)» (M9). |
| Idea 3: r₁ y r₂ iguales en el dibujo (Predice, regla, tarjetas 07 y 09) | La posición más lejana se dibuja más lejos (M5). |
| Idea 3: «trabajo opuesto» | «El trabajo de la gravedad es el cambio de energía potencial con el signo cambiado» (M8). |
| «1 km/s» y «1 min; 1 h; 1 MJ» que sobran; «1 UA = 149 597 870 700 m» | Solo las equivalencias que el caso usa; «1 UA ≈ 150 millones de km» (B1). |
| Tarjeta 08: sin reemplazo ni GJ → J | Paso «Reemplazamos con la energía en joules» (M9). |
| Tarjeta 09: energías sin cuenta, dos explicaciones iguales | E_PG,1 y E_PG,3 con su cuenta; «diste solo la energía inicial / final» (M9). |
| Idea 4: el reloj no se mueve; Tilo habla de energía sin fórmula | Lectura «g mayor que v²/r: no sigue este círculo; el reloj espera»; la regla trae E_M = −G·M·m/(2r) (M10). |
| Kepler: «a» semieje y subíndice de lejano | Subíndices «cerca» y «lejos» (M6). |
| Kepler: piden r = a(1 − e) y la regla no lo dice | La regla trae r_cerca = a·(1 − e) y r_lejos = a·(1 + e) (M6). |
| Kepler: «Parte del intervalo (0 inicio, 1 final)» | «Avance dentro del intervalo (0: al empezar; 1: al terminar)» (M8). |
| Tarjeta 14 (nivel 2) más fácil que la 13 | El período va en días y se pide en horas (M6). |
| Tarjeta 15: A y B cuerpos y alternativas | Alternativas explicadas por su valor, en negrita (M6). |
| Escape: «r₀ = ?» con el dato dado; sonda lejos en la salida desde la superficie; «M nueva: 1 veces» | «r₀ = 4 R»; la sonda en la superficie; sin factores 1 (M11). |
| Escape: «la energía mecánica fija si la sonda retorna» | «La energía mecánica decide si la sonda regresa…» (M8). |
| Tarjetas 17 y 18: «v_escnueva», «g_superficie» | v_esc,nueva y g₀ con su notación (M7). |

**Quedan, con motivo:** GM y g en tinta (decisión 4 de Codex; Gerson decide); Datos que traen la fórmula del ejercicio
(es el contrato, punto 13: van las fórmulas; el lector lo sintió como regalo); Mira de Kepler con dos círculos; la
referencia igual al ensayo al abrir el juego de escape; la figura de la regla 1 con números que no se usan; tres
decimales en las respuestas.
