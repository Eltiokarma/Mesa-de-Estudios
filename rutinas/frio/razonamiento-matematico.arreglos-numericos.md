# Lector en frío · razonamiento-matematico.arreglos-numericos (26 nov 2026)

Dos lectores en frío sobre las capturas del lector (momentos a 390 px con `--entera` y las tarjetas 3, 8 y 14 de cada idea). La primera tanda de momentos salió con la pantalla «No se pudo abrir la teoría» (el servidor del auditor se cayó); los lectores repitieron la parte 1 con las capturas nuevas (`lector2`). Sus informes van tal cual; al final, las correcciones.

### Lector en frío A — Arreglos numéricos y cuadrados mágicos (ideas 1 a 3 y tarjetas 01 a 09)

### Parte 1: momentos

**Aviso grande:** de las 21 capturas que me tocaban, solo 3 muestran la teoría: reparto-parejo 1 Lee, 2 Juega y 3 Predice. Las otras 18 (reparto-parejo 4 a 7, y vertices-dos-veces y mayor-suma de la 1 a la 7) son la misma pantalla de error, «No se pudo abrir la teoría. Revisa tu conexión…», con el botón «Volver al tema». Las 18 son el mismo archivo, byte por byte. No puedo opinar sobre esos momentos: hay que volver a capturarlos.

### Idea 1: El total se reparte parejo

**1 Lee (tarjeta 1/4; solo veo esta, lo digo una vez).** Veo una bandeja con seis tarjetas, 1 2 3 arriba y 7 6 5 abajo, y el texto «El juego de la kermés». Me piden leer. Sin el texto diría «un tablero con fichas», no «bandeja», pero se entiende igual. No hay letras. Nada me trabó.

**2 Juega.** Veo la misma bandeja; a la derecha de cada fila está su suma (6 y 18) y debajo dice «Total de las seis: 24». La misión es que las dos filas sumen lo mismo. Hay botones por columna («1 arriba / 7 arriba», etc.). La letra *T* es el total de las seis tarjetas, y «6, 18…» son las sumas de las filas. «Voltear» no me quedó claro hasta que vi los botones; con ellos se entiende que la columna cambia de arriba abajo. La resolví: si volteo la columna 1, arriba queda 7+2+3 = 12 y abajo 1+6+5 = 12. Hay una segunda solución, el espejo de esa: voltear las columnas 2 y 3. Las dos valen. *Aprendí:* el total no cambia, así que cada fila tiene que llegar a la mitad (12). Faro lo dice bien: «Lo que una fila gana, la otra lo pierde».

**3 Predice.** Las tarjetas son 2, 4, 6, 8 y 10, que suman 30. La pregunta es si se pueden partir en dos grupos de igual suma. Mi respuesta es C: cada grupo tendría que sumar 15, que es impar, y con pares solo salen sumas pares. La B es una buena trampa, porque 10+4 = 14 y 2+6+8 = 16. El recuadro Datos («un impar no se parte en dos mitades enteras») y la pista de Faro casi me dan el camino, aunque no la respuesta. La A es el error típico de quedarse en «el total es par». Una duda: el dato habla de partir *un número* en mitades, pero aquí la mitad (15) sí es entera. Lo que choca es que 15 no sale sumando pares. El dato no apunta a esa razón; te la tiene que dar la pista de Faro.

**4 Mira, 5 Regla, 6 Así se resuelve y 7 Ahora tú:** pantalla de error. No los vi.

*Ejercicio inventado:* repartir las tarjetas del 1 al 6 en tres grupos de igual suma. T = 21, así que cada grupo suma 7: {1,6}, {2,5}, {3,4}.

### Idea 2: vertices-dos-veces
No vi ninguno de sus siete momentos (todo es la pantalla de error). Por las tarjetas 04 a 06 deduzco la idea: los números de las esquinas o del centro se cuentan una vez por cada línea que los tiene.
*Ejercicio inventado:* triángulo con las tarjetas del 1 al 6 y lados que suman 10. Los tres lados suman 3 × 10 = 30 y T = 21, así que las esquinas suman 9. Por ejemplo, esquinas 1, 3 y 5 con medios 6, 2 y 4: 1+6+3, 3+2+5 y 5+4+1, los tres dan 10.

### Idea 3: mayor-suma
Tampoco vi ninguno de sus siete momentos. Por las tarjetas 07 a 09: para que el lado sume lo más posible, se ponen en las esquinas las tarjetas más grandes.
*Ejercicio inventado:* triángulo con 1 a 6, la mayor suma por lado. (21 + 4+5+6) ÷ 3 = 12, y se arma con los medios 3 (entre 4 y 5), 1 (entre 5 y 6) y 2 (entre 6 y 4).

### Parte 2: tarjetas de ejemplos
Resolví cada una sola antes de leer el «Resuelto» y comprobé todas las cuentas. Todas salen bien y en todas la respuesta es única.

- **01 (n.º 3, Un total impar).** Piden saber si 1 a 5 se parten en dos grupos de igual suma. Tengo todo lo que necesito. Sigo el Resuelto entero: T = 15 y 15 ÷ 2 = 7,5, así que no se puede. El dibujo es solo la fila de tarjetas: no estorba, pero tampoco aporta. Nada raro.
- **02 (n.º 8, Tres filas con un hueco).** Las tarjetas son de 1 a 9 y la fila tiene el 9 y el 2. Calculé T = 45, S = 15 y x = 4, todo correcto. Las otras filas, 1+6+8 y 3+5+7, también dan 15 y usan las tarjetas que quedan. El dibujo (9, 2, ? y dos filas vacías punteadas) ayuda. El recuadro Datos trae cuatro viñetas: es mucho texto, y la última («la tarjeta que falta es la suma menos lo que ya tiene») ya es el método.
- **03 (n.º 14, Una fila gana por 6).** Calculé T = 36 y (36−6) ÷ 2 = 15, con abajo 1+2+4+8 = 15 y arriba 3+5+6+7 = 21. Todo correcto. **El recuadro Datos regala el método:** «la menor = (total − diferencia) ÷ 2». Con eso solo hay que reemplazar. El dibujo son ocho casillas vacías: no ayuda, pero tampoco confunde. Lo raro es que el 15 de la respuesta va en morado, que en las otras tarjetas es el color de *S*, aunque aquí no es una suma común.
- **04 (n.º 3, La cruz con el 5).** Calculé 2S = 15+5 = 20, así que S = 10, con la fila 1+5+4 y la columna 2+5+3. El 15 aparece sin que nadie diga «T = 15», pero se adivina. El dibujo de la cruz con el 5 marcado sí ayuda.
- **05 (n.º 8, El centro de la cruz).** Las tarjetas son de 2 a 6, así que T = 20, y 24 − 20 = 4 es el centro. Lo comprobé: 2+4+6 = 12 y 3+4+5 = 12. Muy clara, el Resuelto se sigue línea por línea. La letra *c* va en verde azulado.
- **06 (n.º 14, Las que no son esquina).** Calculé 4·13 = 52, esquinas = 52 − 36 = 16 y medios = 36 − 16 = 20. Probé con la computadora y hay arreglos reales: 16 ordenamientos, por ejemplo 8-4-1-7-5-6-2-3. **Primera línea donde me pierdo: «V = 52 − 36 = 16».** Nadie dice qué es *V* (¿vértices?; el texto dice «esquinas»), y el 36 aparece sin «T = 36». El 20 de la respuesta también va en morado, como *S*. Las alternativas y su explicación de errores están bien.
- **07 (n.º 3, Impares, la mayor).** Los impares del 1 al 11 suman 36 y las esquinas 7+9+11 suman 27, así que S = 21. Lo comprobé: 7+5+9, 9+1+11 y 11+3+7 dan 21 los tres. El Datos vuelve a traer la fórmula completa, «(total + esquinas) ÷ número de lados», y así la tarjeta se reduce a reemplazar. El dibujo del triángulo ayuda.
- **08 (n.º 8, El pentágono, la mayor).** Calculé T = 55, esquinas 6+…+10 = 40 y S = 19. Los medios son 5, 1, 2, 3 y 4, y todos los lados dan 19. Lo malo es el dibujo: **no se lee como pentágono**. Parece un óvalo de diez casillas, y las casillas «del medio» de arriba quedan pegadas a la esquina de arriba, no al medio del lado. Me costó saber cuáles eran esquinas. El Datos trae cinco viñetas, que es demasiado.
- **09 (n.º 14, La cruz, la mayor).** S = 10. Es casi el mismo problema que la 04 (misma cruz de 1 a 5, misma cuenta y mismo arreglo, 1+5+4 y 2+5+3). Como nivel 14 no sube nada respecto del nivel 3. Las alternativas están bien explicadas (7,5, 9, 5 y 15).

**Las 3 que mejor se entienden:** 05, 01 y 02.
**Las 3 que peor se entienden:** 06 (la *V* sin explicar y el 36 que aparece de la nada), 08 (el dibujo del pentágono) y 09 (repite la 04).
**¿Suben los niveles?** En el primer bloque (01 → 02 → 03) sí suben. En el segundo (04 → 05 → 06), un poco. En el tercero (07 → 08 → 09), no: la 09 (n.º 14) es más fácil que la 08 y repite la 04.
**El recuadro «Datos»:** ayuda cuando define (el total, «comparten el centro»). Regala el método cuando trae la fórmula ya armada (03, 07 y 08), y con cuatro o cinco viñetas (02, 06 y 08) se vuelve pesado de leer.

### Lo que me trabó
- Idea reparto-parejo, pantallas 4 a 7: «No se pudo abrir la teoría»; no se ven.
- Idea vertices-dos-veces, pantallas 1 a 7: «No se pudo abrir la teoría»; no se ven.
- Idea mayor-suma, pantallas 1 a 7: «No se pudo abrir la teoría»; no se ven.
- reparto-parejo 2 Juega: «voltear la columna» se entiende solo al ver los botones (hay dos soluciones espejo, las dos valen).
- reparto-parejo 3 Predice: el Datos habla de «partir un número en mitades», pero lo que impide la respuesta es que 15 no sale sumando pares.
- Tarjeta 06: «V = 52 − 36» usa una *V* que nadie define y un 36 sin «T = 36».
- Tarjeta 04: el 15 aparece sin «T = 15».
- Tarjetas 03 y 06: la respuesta va en morado como *S* sin serlo.
- Tarjetas 03, 07 y 08: el recuadro Datos trae la fórmula armada y regala el método.
- Tarjetas 02, 06 y 08: el recuadro Datos trae 4 o 5 viñetas, demasiado texto.
- Tarjeta 08: el dibujo no parece un pentágono; no se distinguen las esquinas de los medios.
- Tarjeta 09 (n.º 14): repite la 04 (n.º 3); no sube de nivel.

---

### Parte 1 (capturas nuevas, carpeta lector2)
Ahora sí se ven las 21 pantallas. Lo digo una sola vez: de Lee, Mira y «Así se resuelve» solo veo la primera tarjeta o el primer paso, y eso no lo cuento como falla.

### Idea 1: El total se reparte parejo (4 a 7)
**4 Mira (paso 1/4).** Veo la bandeja con el grupo 1 (7, 6, 1) y el grupo 2 (5, 4, 3, 2), y la frase «Del 1 al 7: total 28». Dice S = T ÷ 2 = 28 ÷ 2 = 14. Lo comprobé: 7+6+1 = 14 y 5+4+3+2 = 14. *S* es lo que suma cada grupo y *T* el total. *Aprendí:* primero se saca el total y luego cada grupo vale total ÷ número de grupos. Nada me trabó.

**5 La regla.** El dibujo es el mismo, ahora con 14 al lado de cada grupo, y debajo dice «Con 2, 4, 6, 8 y 10: mitad 15, impar». Las fórmulas son S = T ÷ grupos y x = S − lo que ya tiene. Lo que me hizo dudar:
- **El recuadro de fórmulas se ve mal armado:** «x = S − lo que ya» queda en una línea y la palabra «tiene» cae sola más abajo, centrada.
- La línea «mitad 15, impar» se lee rara. Entiendo que habla del Predice, pero sola no dice qué pasa con el 15 ni por qué eso impide repartir.
El «Vale si» (el total ÷ grupos tiene que dar entero y los grupos tienen que poder armarse) está claro.

**6 Así se resuelve (paso 1).** Las tarjetas pares del 16 al 32 van en tres columnas de tres, y piden la suma de cada columna. Lo resolví solo: son 9 tarjetas, T = (16+32)·9 ÷ 2 = 216 y S = 72. Ejemplo de columnas: 16+24+32, 18+26+28 y 20+22+30, las tres dan 72. El paso 1, «¿Qué me piden?», está claro. El dibujo dice «Columna 1, 2 y 3» al lado de lo que parecen *filas* (las etiquetas van a la izquierda de cada fila de casillas). **Eso confunde.**

**7 Ahora tú.** Las tarjetas del 10 al 18 van en tres filas iguales. Calculé T = (10+18)·9 ÷ 2 = 126, así que cada fila suma 42: es la B. Las trampas están bien: 126 es el total, 14 sale de ÷ 9 y 84 de ÷ 1,5. Aquí el dibujo sí dice «Fila» al lado de las filas, al revés que en el 6. El Datos vuelve a traer la fórmula de los seguidos y la de ÷ grupos.

*Ejercicio inventado (sin cambios):* 1 a 6 en tres grupos: T = 21 y cada grupo suma 7, con {1,6}, {2,5} y {3,4}.

### Idea 2: Lo compartido cuenta dos veces
**1 Lee (1/3).** Veo una cruz de cinco casillas vacías. Sin el texto la reconozco como cruz, y el texto explica que la casilla del centro está en la fila y en la columna. Está claro.

**2 Juega.** La cruz trae los números 3 arriba, 2 1 5 en la fila y 4 abajo; el 1 del centro va marcado en verde. Dice fila 8 y columna 8, y hay dos deslizadores: «Desde» y «Centro». La misión es que la fila y la columna sumen 12 cada una. *c* es la tarjeta del centro. Me hizo dudar «Desde»: no dice desde qué. Recién al moverlo entiendo que es el primer número de las cinco tarjetas seguidas. El título «Tarjetas del 1 al 5» también estorba, porque la misión **solo sale si no se empieza en 1**. Lo resolví: las cartas son a…a+4, y 24 = (5a+10) + c, así que c = 14 − 5a. Con a = 2 queda c = 4 (fila 2+4+6 y columna 3+4+5). Es la única solución, salvo intercambiar el orden. *Aprendí:* la fila más la columna da el total más el centro.

**3 Predice.** El triángulo con 1 a 6 tiene las esquinas 1, 3 y 5. Calculé 3S = 21 + 9 = 30, así que S = 10: es la B. Las trampas son razonables (7 = 21 ÷ 3, que se olvida de las esquinas; 12; 9 = la suma de las esquinas). El Datos ayuda sin regalar.

**4 Mira (1/5).** El triángulo ya está armado: 1, 4, 5, 2, 3, 6. Comprobé los lados: 1+4+5, 5+2+3 y 3+6+1 dan 10 los tres. Las esquinas van marcadas en verde. Está claro.

**5 La regla.** Fórmulas: lados × S = T + V (con *V* = «las esquinas») y 2 × S = T + c (con *c* = «el centro»). Aquí por fin se explica la *V* que me trabó en la tarjeta 06. Igual, «V» por «esquinas» no se entiende sin la palabra «vértice», que nunca aparece. El texto de la regla está claro.

**6 Así se resuelve (paso 1).** Los impares del 3 al 13 van en un triángulo con las esquinas 9, 11 y 13. Lo resolví: T = 48, V = 33 y 3S = 81, así que S = 27. Los medios son 5 (entre 9 y 13), 7 (entre 9 y 11) y 3 (entre 13 y 11), todo correcto. El Datos trae cuatro viñetas.

**7 Ahora tú.** El pentágono va con 4 a 13 y las esquinas 5, 9, 13, 7 y 11. Calculé T = 85, V = 45 y 5S = 130, así que S = 26: es la A. Los medios quedan 12, 4, 6, 8 y 10, que son justo las cartas que sobran, así que sí se arma. Las trampas están bien: 45 son las esquinas, 17 = 85 ÷ 5 y 25. El pentágono se lee mejor aquí que en la tarjeta 08, porque los números de las esquinas ayudan.

*Ejercicio inventado:* cruz con 3 a 7 y fila y columna de 14 cada una. T = 25, así que el centro vale 28 − 25 = 3, con fila 4+3+7 y columna 5+3+6.

### Idea 3: La mayor suma tiene que armarse
**1 Lee (1/3).** Veo un triángulo de seis casillas punteadas, y lo reconozco sin leer el texto. «Polígono» trae glosario. Está claro.

**2 Juega.** Las tarjetas son de 1 a 6, con tres deslizadores para las esquinas (arriba, derecha e izquierda). La misión es que cada lado sume 11. Arriba dice V = 9, así que cada lado suma S = 10. *V* es la suma de las esquinas y *S* la de cada lado (aquí sí se definen). Lo resolví: 3·11 = 33 = 21 + V, así que V = 12. Las esquinas tienen que ser 2, 4 y 6, con medios 5, 1 y 3. Probé las otras ternas que suman 12 ({1,5,6} y {3,4,5}) y no se arman, así que la solución es única. Faro: «que la cuenta dé entera no basta», muy bien. *Aprendí:* la cuenta da la suma, pero hay que comprobar que se arme.

**3 Predice.** Cuadrado con 1 a 8, la mayor suma por lado. Si pongo las esquinas más grandes: 4S = 36 + 26 = 62, así que S = 15,5, que no es entera. Bajo a 15. Lo comprobé con la computadora: las sumas posibles son 12, 13, 14 y 15, así que la respuesta es la B (15). La D (15,5) es la trampa buena. El Datos no regala.

**4 Mira (1/4).** Veo un cuadrado vacío, «Del 1 al 8: total 36» y la fórmula 4 × S = T + V. Faro dice «la cuenta da un tope». Está claro.

**5 La regla.** El cuadrado viene armado: 3 5 7 arriba, 4 y 2 a los costados y 8 1 6 abajo, con 15 en cada lado. Lo comprobé: los cuatro lados dan 15. Debajo dice «5+6+7+8 = 26 → 15,5». Fórmulas: S = (T + V) ÷ lados y «mayor: V con las más grandes», con una llave que dice **«la cota»**. Faro dice «tope» en el Mira y «la cota» aquí, para lo mismo. «Cota» es palabra nueva y no tiene glosario. La regla «si no sale entera, se prueba el entero siguiente: hacia abajo para la mayor» está clara.

**6 Así se resuelve (paso 1).** Los pares del 12 al 26 van en un cuadrado; piden la mayor suma por lado. Lo resolví antes de ver los pasos: T = 152 y las esquinas más grandes 20+22+24+26 = 92, así que (152+92) ÷ 4 = 61. **Ojo:** 61 es entero pero no se puede, porque tres números pares nunca suman un impar. La respuesta debe ser 60, que es la misma cuenta que 15 en el cuadrado de 1 a 8, cambiando cada k por 2k+10. Es una buena trampa, si los pasos siguientes la explican. Solo vi el paso 1, así que no sé si lo hacen. El Datos trae cuatro viñetas con la fórmula completa.

**7 Ahora tú.** El pentágono va con 5 a 14; piden la mayor suma. Calculé T = 95 y las esquinas 10 a 14 = 60, así que (95+60) ÷ 5 = 31. Se arma: es el pentágono de 1 a 10 (S = 19) con cada número subido en 4. Es la D. Las trampas son 60 (las esquinas), 19 (la del 1 a 10) y 29. El dibujo del pentágono vuelve a tener las casillas del medio de arriba pegadas a la esquina de arriba, y como todas dicen «?», no se sabe cuáles son esquinas.

*Ejercicio inventado (sin cambios):* triángulo con 1 a 6, la mayor suma: (21+15) ÷ 3 = 12, con esquinas 4, 5 y 6 y medios 3, 1 y 2.

### Lo que me trabó (capturas nuevas)
- reparto-parejo 5 La regla: en el recuadro de fórmulas, «x = S − lo que ya» y «tiene» quedan partidos en dos líneas.
- reparto-parejo 5 La regla: la línea «Con 2, 4, 6, 8 y 10: mitad 15, impar» no se entiende sola.
- reparto-parejo 6 Así se resuelve: las etiquetas «Columna 1, 2, 3» van al lado de filas.
- vertices-dos-veces 2 Juega: «Desde» no dice desde qué, y «Tarjetas del 1 al 5» engaña, porque la misión solo sale empezando en 2.
- vertices-dos-veces 5 La regla: *V* = «las esquinas» sin decir por qué V (la palabra «vértice» no aparece).
- mayor-suma 5 La regla: «la cota» es palabra nueva, sin glosario, y Faro la llamó «tope» en el Mira.
- mayor-suma 6 Así se resuelve: la cuenta da 61, pero no se arma (tres pares no suman impar); solo vi el paso 1 y no sé si los pasos lo aclaran.
- mayor-suma 7 Ahora tú: en el pentágono vacío no se distinguen las esquinas de los medios (igual que en la tarjeta 08).
- 6 Así se resuelve y 7 Ahora tú de las tres ideas: el recuadro Datos trae de 3 a 4 viñetas con la fórmula ya armada.

### Lector en frío B: suma-magica, producto-magico, piramide-de-sumas (+ tarjetas 10 a 18)

### Parte 1: momentos. NO SE PUDO LEER
Las 21 capturas `claro-cel-{suma-magica,producto-magico,piramide-de-sumas}-{1..7}-*.png` son la misma imagen (md5 1df5036f…): la tarjeta «No se pudo abrir la teoría. Revisa tu conexión y vuelve a intentarlo» con el botón «Volver al tema». No veo ni Lee, ni Juega, ni Predice, ni Mira, ni Regla, ni «Así se resuelve», ni «Ahora tú». No puedo opinar sobre ningún momento ni sobre las misiones. La misma pantalla de error sale también en mayor-suma y vertices-dos-veces (1-7) y en reparto-parejo (4-7). Parece una falla del capturador o de la carga de la teoría, no del contenido. Hay que volver a sacar las capturas y repetir esta parte.

Como alumno, ese mensaje también confunde: dice «revisa tu conexión» aunque el problema podría no ser la red.

### Parte 2: tarjetas

**10 · El 4×4 clásico (suma, nivel 3).** Piden la suma de cada fila de un 4×4 con los números del 1 al 16. Tengo todo: los Datos dan la regla «total ÷ filas» y la fórmula de la suma. Sigo el resuelto sin problema: T = 17·16/2 = 136 y S = 136/4 = 34. Lo comprobé y está bien. El dibujo (una cuadrícula vacía) no ayuda ni estorba; solo muestra que son 4 filas. Lo raro: el resuelto no dice de dónde sale T (la tarjeta 11 sí lo dice). El dato «o que van de 2 en 2» no se usa aquí. El segundo dato prácticamente da el método armado.

**11 · El 4×4 desde 3 (suma, nivel 8).** Es igual a la 10, pero con los números del 3 al 18. Tengo todo y lo sigo. T = 21·16/2 = 168 y S = 42. Lo comprobé y está bien. El dibujo es el mismo de la 10, decorativo. Que sea del 3 al 18 sí sube un poco la dificultad: hay que contar que son 16 números.

**12 · Dos casillas opuestas (suma, nivel 14).** Piden la suma de las casillas opuestas a la esquina 5 y al borde 12, con el centro 9. Tengo todo: la regla «opuestas suman el doble del centro» está en los Datos. Sigo el resuelto: 18-5 = 13, 18-12 = 6 y 13+6 = 19. El dibujo ayuda mucho: pone los «?» justo enfrente del 5 y del 12. Además, armé el cuadrado entero (5 12 10 / 14 9 4 / 8 6 13) y es válido, con todos los números distintos. Las explicaciones de los distractores (27, 18, 36) están bien. Lo raro: en la línea «Ahora sumo esas dos casillas opuestas.» el texto llega pegado al borde derecho del recuadro y la palabra «opuestas.» parece que se corta o se sale. El enunciado «sus dos casillas opuestas» al principio me hizo dudar (¿opuestas entre sí o a cada una?), pero el dibujo lo aclara.

**13 · La esquina opuesta (producto, nivel 3).** Piden la esquina opuesta al 4 con el centro 6, en un cuadrado multiplicativo. Tengo todo: la regla está en los Datos. Sigo el resuelto: 36 ÷ 4 = 9. Comprobado. El dibujo ayuda porque marca la esquina opuesta con «?». La tarjeta es clara.

**14 · La opuesta en el de 1000 (producto, nivel 8).** Dan el producto 1000 y la esquina 4, y piden la esquina opuesta. **Falta algo:** el resuelto empieza con «Primero el centro: 10×10×10 = 1000», pero ningún dato dice que el centro multiplicado tres veces por sí mismo da P. Los Datos traen la tabla de cubos y «por el centro pasan cuatro líneas», pero no la conclusión. Ahí me pierdo: ¿por qué el centro es la raíz cúbica? Lo demás (100/4 = 25) está bien. El dibujo, con «?» en el centro y en la esquina, ayuda.

**15 · El centro con 3375 (producto, nivel 14).** Piden el centro si cada línea multiplica 3375. Me pasa lo mismo que en la 14: «El centro multiplicado tres veces por sí mismo da 3375» se afirma sin ninguna razón, y no está en los Datos. Además, **los Datos regalan la respuesta**: la tabla dice «15 → 3375», así que basta buscarla. Con eso, este nivel 14 resulta más fácil que el 8. Las explicaciones de los distractores (1125, 225, 45) se entienden, aunque «como en el cuadrado de sumas» supone que ya sé que allí el centro es S/3. El dibujo solo muestra el centro con «?».

**16 · Fila por fila (pirámide, nivel 3).** Piden la cima con la base 6, 1, 2. Tengo todo y lo sigo: 7, 3 y 10. Comprobado. El dibujo con adobes punteados ayuda a ver los pisos. Es clara.

**17 · El del medio que falta (pirámide, nivel 8).** Piden el número del medio con la base 2, ?, 4 y la cima 16. Tengo todo: los Datos traen la regla de caminos 1, 2, 1. Sigo el resuelto: 2 + 2x + 4 = 16, así que x = 5. Comprobé de vuelta: 2, 5, 4 dan 7 y 9, y la cima es 16. Bien. El dibujo ayuda. Es clara.

**18 · La cima más alta (pirámide, nivel 14).** Piden la mayor cima posible con las tarjetas 1, 2, 3 y 4. Tengo todo: los caminos 1, 3, 3, 1 están en los Datos. Sigo el resuelto: el orden 1, 4, 3, 2 da 1 + 12 + 9 + 2 = 24. Comprobé los distractores: 1, 2, 3, 4 da 20, las cuatro sumadas dan 10 y con los grandes en las puntas da 16. Todos están bien. **Hay más de un orden que da 24** (1-4-3-2, 2-3-4-1, 1-3-4-2, 2-4-3-1, …), pero la pregunta pide el valor y ese es único, así que no es problema. El resuelto no dice qué orden usó, aunque se deduce de la cuenta. Con cuatro «?» en la base, el dibujo no da la respuesta.

### Balance
- Mejor se entienden: 16, 17 y 13 (y la 12 por su dibujo).
- Peor se entienden: 15 (centro = raíz cúbica sin razón y la respuesta regalada en la tabla), 14 (el mismo salto) y 10 (el dibujo no aporta y el método viene dado).
- Niveles: en la pirámide suben de verdad (3 → 8 → 14). En la suma mágica suben un poco: 10 y 11 son casi la misma tarjeta, y la 12 sí es otro nivel. En el producto no suben: la 15 (nivel 14) es más fácil que la 14 porque la tabla trae la respuesta.
- El recuadro «Datos» casi siempre ayuda y deja resolver sin haber memorizado nada. Pero en las tarjetas 10 y 11 el método viene ya armado, en la 15 la tabla regala la respuesta, y en la 14 y la 15 falta justo la regla que usa el resuelto (centro³ = P). El dato «de 2 en 2» sobra en la 10 y la 11.

### Lo que me trabó
- suma-magica, producto-magico, piramide-de-sumas, pantallas 1 a 7: todas muestran «No se pudo abrir la teoría»; no pude leer ningún momento (tampoco en mayor-suma, vertices-dos-veces ni reparto-parejo 4-7).
- Tarjeta 14 (producto, nivel 8), primera línea del resuelto: «el centro es 10 porque 10³ = 1000» no tiene razón y no está en los Datos.
- Tarjeta 15 (producto, nivel 14), resuelto: el mismo salto (centro³ = P sin explicar).
- Tarjeta 15, Datos: la tabla «15 → 3375» regala la respuesta, y el nivel 14 queda más fácil que el 8.
- Tarjeta 12, línea «Ahora sumo esas dos casillas opuestas.»: el texto toca o se sale del borde derecho del recuadro.
- Tarjeta 10, resuelto: no explica de dónde sale T (la 11 sí); el dibujo vacío no aporta.
- Tarjetas 10 y 11: casi idénticas, el nivel apenas sube.
- Tarjeta 18, resuelto: no dice qué orden de tarjetas usa (hay varios que dan 24).

---

### Parte 1 (capturas nuevas, carpeta lector2)
De Lee y Mira solo veo la primera tarjeta o el primer paso, y de «Así se resuelve» solo el paso 1 («¿Qué me piden?»). Lo digo una vez y no lo cuento como falla.

### Idea 4 · El cuadrado mágico y su centro (suma-magica)
- **1 Lee.** Veo un tablero de 4×4 con casillas vacías y unos rombos grises en algunas uniones. El texto dice «El tablero de madera», pero el dibujo es gris y no parece de madera. No sé qué son los rombos: ¿clavos, marcas de las diagonales? Me hizo dudar. Me piden leer. La tarjeta define bien el cuadrado mágico y la suma mágica.
- **2 Juega.** Es el cuadrado 16 3 2 13 / 5 10 11 8 / 9 6 7 12 / 4 15 14 1, con la suma de cada fila a la derecha (34) y abajo «Total de las 16: 136». La misión es «Haz que cada fila sume 50» moviendo el deslizador «Empieza en». T es el total y S la suma de una fila, y los colores coinciden con la ecuación. La resolví: la fila suma 4·a + 30, así que a = 5. Hay una sola solución. Aprendí que cada fila se lleva la cuarta parte del total. No veo dónde se ve el «centro» del título en este juego.
- **3 Predice.** Es un 3×3 vacío: «con los números del 1 al 9, ¿qué número va en el centro?». Los Datos dicen 1+…+9 = 45. Yo respondo 5 (A), por la pista de Faro de las cuatro líneas. El salto del 4×4 del Juega al 3×3 se nota, pero se entiende.
- **4 Mira.** Es el cuadrado 2 7 6 / 9 5 1 / 4 3 8 con el 5 marcado. El paso 1 da S = 45 ÷ 3 = 15. Lo comprobé y está bien. Aprendí que la suma mágica es el total entre el número de filas.
- **5 Regla.** Debajo del dibujo dice «4 × 15 = 45 + 3 × 5». Sin explicación es un jeroglífico: no dice que son las cuatro líneas que pasan por el centro y que el centro se cuenta 4 veces. El texto dice «pasan cuatro líneas por el centro, y por eso el centro es la tercera parte», pero el «por eso» no explica nada. Las letras a y b de «a + b = 2 × c» no tienen color ni aparecen en el dibujo; solo el «Vale si» dice que son casillas opuestas. Las fórmulas S = T ÷ n y c = S ÷ 3 sí se entienden. Aprendí que el centro del 3×3 es S/3 y que dos opuestas suman 2c.
- **6 Así se resuelve.** «Usa una vez cada número: 14, 17, … 38. ¿Qué va en el centro?» Lo resolví yo: T = 52·9/2 = 234, S = 78 y c = 26. Ojo: los Datos no traen la fórmula de la suma de números de 3 en 3; hay que sumar a mano o saberla.
- **7 Ahora tú.** «12 al 20: ¿cuánto suma cada fila?» Mi respuesta es T = 144 y S = 48 (B). Faro dice «Primero la suma mágica; después, lo que falta», pero aquí solo piden la suma mágica y no falta nada más. Confunde. Tampoco se pregunta por el centro, que es lo que da nombre a la idea.
- **Ejercicio mío.** Un 3×3 con los números 5, 7, 9, …, 21 (son 9 números). ¿Cuánto vale el centro? T = 26·9/2 = 117, S = 39 y c = 13.

### Idea 5 · Cuando las líneas multiplican (producto-magico)
- **1 Lee.** Veo dos filas de tarjetas, 2 4 9 y 1 3 6, en una caja con una raya. El texto dice «dos tiras de cartulina» y «otro juego de la kermés». Como tiras de cartulina se reconocen a medias: parecen una caja de dos filas. «La kermés» supone una idea anterior que no vi.
- **2 Juega.** Arriba da 72 y abajo 18, y «juntas multiplican 1 296». Hay botones por columna para elegir qué tarjeta va arriba. La misión es que las dos tiras den el mismo producto. La resolví: 1296 = 36·36, y queda 2·3·6 = 36 arriba con 1·4·9 = 36 abajo. Hay dos soluciones (esa y la misma al revés), y las dos valen. La leyenda «P, el producto común» habla de una P que no aparece en el dibujo. La línea «= 72, = 18: lo que multiplica cada tira» se lee rara. Aprendí que si juntas dan 1296, cada una da la raíz: 36.
- **3 Predice.** «Cada línea da 216; ¿qué va en el centro?», con el Dato 216 = 2·2·2·3·3·3. Respondo 6 (C). Se entiende.
- **4 Mira.** Es el cuadrado 2 9 12 / 36 6 1 / 3 4 18. Comprobé las 8 líneas y todas dan 216. El paso 1 dice «Las tres filas juntas multiplican las nueve casillas: 216×216×216». Se entiende, aunque «multiplican las nueve casillas» suena raro (sería «dan el producto de las nueve»).
- **5 Regla.** Debajo dice «2 × 18 = 36 = 6 × 6», y está bien: son esquinas opuestas. Las reglas P = c·c·c, a·b = c·c y x = P ÷ (otras dos) son claras. Aquí sí se dice que el centro al cubo da P. Es justo lo que falta en los Datos de las tarjetas 14 y 15 de la parte 2. Aprendí que es lo mismo que en sumas, pero multiplicando.
- **6 Así se resuelve.** P = 2744 y se pide el centro. Los Datos traen la tabla «14 → 2744», así que la respuesta se lee directamente de la tabla.
- **7 Ahora tú.** P = 3375 y se pide el centro, con las opciones 1125, 15, 45 y 225. La tabla de los Datos dice «15 → 3375»: regala la respuesta. Además es el mismo problema que la tarjeta de ejemplo 15 (nivel 14). Para practicar no sirve, porque solo se busca en la tabla.
- **Ejercicio mío.** P = 343 y una esquina es 1. ¿Cuánto vale la esquina opuesta? c = 7, c² = 49, así que es 49.

### Idea 6 · La pirámide de sumas (piramide-de-sumas)
- **1 Lee.** Es una pirámide de 3+2+1 rectángulos vacíos sobre una línea. «Muro de adobes»: como ladrillos apilados se reconoce, aunque no tienen color ni textura de adobe. Se entiende.
- **2 Juega.** La base es 1 2 3, el medio 3 5 y la cima 8, con «Cima 8 = 1+2+2+3». Hay tres deslizadores (Izquierda, Medio, Derecha). La misión es que la cima valga 20 sin repetir números abajo. Tiene muchas soluciones (a + 2b + c = 20, por ejemplo 1, 8, 3 o 2, 7, 4), y está bien que sea abierta. En la leyenda, «adobe: la suma de los dos de abajo» no vale para los de la base. Aprendí que el del medio cuenta dos veces.
- **3 Predice.** Base de cuatro: 2, 5, 1, 3; ¿cuánto vale la cima? Lo calculé: 7, 6, 4 → 13, 10 → 23 (B). Se entiende.
- **4 Mira.** Es la misma base con los pisos punteados. El paso 1 solo nombra los números. Faro: «cada adobe de abajo, tantas veces como caminos». Se entiende.
- **5 Regla.** Es la pirámide llena (23 arriba), con ×1 ×3 ×3 ×1 debajo de la base. Está muy clara. La fórmula «1.º + 3 × 2.º + 3 × 3.º + 4.º» con ordinales se lee extraña, pero el dibujo la aclara. «Cada fila de caminos sale de la anterior sumando vecinos» se dice sin mostrarlo. Aprendí que los del medio pesan más (1, 3, 3, 1).
- **6 Así se resuelve.** Base 2, 6, 1, 12. Lo resolví: 2 + 18 + 3 + 12 = 35.
- **7 Ahora tú.** Base 7, 5, 9, 1. Lo resolví: 7 + 15 + 27 + 1 = 50 (A). Lo comprobé armando el muro: 12, 14, 10 → 26, 24 → 50. Bien.
- **Ejercicio mío.** Base de cinco: 1, 0, 2, 0, 1. Con los pesos 1, 4, 6, 4, 1 la cima vale 1 + 12 + 1 = 14.

### Lo que me trabó (parte 1, capturas nuevas)
- suma-magica, 1 Lee: «tablero de madera», pero el dibujo es gris; los rombos grises de las uniones no se explican.
- suma-magica, 2 Juega: el juego trata del total y las filas; el «centro» del título no aparece.
- suma-magica, 5 Regla: «4 × 15 = 45 + 3 × 5» va sin explicación, y el «por eso» del texto no justifica que el centro sea S/3.
- suma-magica, 5 Regla: a y b de «a + b = 2 × c» no tienen color ni están en el dibujo.
- suma-magica, 6 Así se resuelve: los Datos no traen cómo sumar 14, 17, …, 38 (números de 3 en 3).
- suma-magica, 7 Ahora tú: Faro dice «después, lo que falta», pero solo se pide la suma mágica.
- producto-magico, 1 Lee: «otro juego de la kermés» remite a algo no visto; las «tiras» parecen una caja.
- producto-magico, 2 Juega: la leyenda nombra una P que no está en el dibujo; la línea «= 72, = 18» se lee rara.
- producto-magico, 6 Así se resuelve y 7 Ahora tú: la tabla de cubos de los Datos (14 → 2744, 15 → 3375) regala la respuesta.
- producto-magico, 7 Ahora tú: es el mismo problema que la tarjeta de ejemplo 15.
- piramide-de-sumas, 2 Juega: la leyenda «adobe = suma de los dos de abajo» no vale para la base.
- piramide-de-sumas, 5 Regla: «cada fila de caminos sale de la anterior sumando vecinos» no se muestra; los ordinales 1.º, 2.º se leen raros.

## Correcciones de la ronda 1

Detalle y pruebas en `rutinas/auditoria/razonamiento-matematico.arreglos-numericos.md` («Correcciones (26 nov)»).

| Lo que señaló el lector | Qué se hizo |
|---|---|
| Tabla de cubos en Datos que regala el centro (B: tarjeta 15, Así se resuelve y Ahora tú de la idea 5) | Fuera la tabla; los Datos traen el producto en factores primos y los centros ya no son primos (A1). |
| Centro³ = P sin razón ni dato (B: tarjetas 14 y 15) | El porqué en los resueltos y el dato en el ejemplo 8 (A2). |
| Ahora tú de la idea 5 repite la tarjeta 15 (B) | «Ahora tú» del centro usa otros centros (21, 22 y 26). |
| La cota 61 no se arma y no se dice por qué (A: Así se resuelve 3) | Cada paso dice la razón (tres pares suman par) y hacia dónde se prueba (A3). |
| El pentágono vacío no distingue esquinas de medios (A: tarjeta 08 y Ahora tú 3) | Las esquinas van siempre en turquesa, también con «?» (M5). |
| Tarjeta 09 repite la 04 (A) | El ejemplo 14 de la idea 3 es ahora la cruz grande de 1 a 9 (M4). |
| V sin definir y 36 o 15 sin «T =» (A: tarjetas 04 y 06) | El resuelto nombra V y escribe T (M6); el Lee de la idea 2 presenta V «de vértices». |
| Regla de la idea 4: «4 × 15 = 45 + 3 × 5» sin explicar y el «por eso» no justifica; a y b sin decir (B) | Regla y nota nuevas; la regla dice qué son a y b (M3). No se les dio color propio: la paleta de la unidad no tiene verde y a y b no son lo compartido. |
| Así se resuelve de la idea 4 sin cómo sumar 14, 17, …, 38 (B) | Dato de números con un mismo salto y el paso con la fórmula (M7). |
| Juega 2 «Desde»; «tope» y «cota»; «tablero de madera» y rombos; «otro juego de la kermés» y tiras; leyendas del producto y del muro; voz de Ahora tú de la idea 4 (A y B) | Textos nuevos (M8). |
| «sumando vecinos» de la regla 6 no se muestra (B) | La regla escribe la fila: 1, 1 + 2, 2 + 1, 1 (M10). |
| Dato de la Predice 1 apunta a la mitad, no a la suma de pares (A) | Se agrega «Al sumar números pares, el resultado siempre es par» (B1). |
| «Con 2, 4, 6, 8 y 10: mitad 15, impar»; «lo que ya / tiene» partido; «Columna» al lado de filas (A) | Corregidos (B2, B3). |
| Tarjeta 10 sin de dónde sale T; tarjeta 18 sin el orden (B) | Corregidos (B4, B5). |
| Tarjetas 10 y 11 casi iguales (B) | Sin cambio: la 11 obliga a contar los 16 números (B6). |
| Tarjeta 12, texto al borde (B) | Fuera de alcance (ancho del lector en `app/`); anotado (B7). |
| Datos con la fórmula armada y 3 a 5 viñetas (A) | Sin cambio: el contrato pide la fórmula general en los Datos (punto 13); no traen el paso hecho. |
| Respuesta en violeta «como S» (A) | Sin cambio: violeta es lo que se pide. |
| El juego de la idea 4 no toca el centro (B) | Sin cambio: decisión de la propuesta, para no mostrar la respuesta de la Predice. |
| Misiones con dos o más soluciones (A y B) | Sin cambio: `logrado` acepta todas. |
