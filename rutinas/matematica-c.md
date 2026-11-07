# Rutina de matemática C: reporte

Sesión paralela de la rama `rutina/matematica-c` (creada desde `claude/awesome-wozniak-5etl1n`). La conversación principal integra. Dos tareas: la escena `plantillas/coordenadas-polares/` y los pares de reserva del banco de entrada y salida de álgebra, geometría y trigonometría.

## 7 nov 2026 · Banco: pares de reserva de álgebra, geometría y trigonometría

**Qué hice.** 16 pares en `reserva` (no en las formas), 2 por cada escena del curso que no tenía par. Criterio: transferencia cercana, o sea la misma tarea y los mismos códigos de error que una predicción de la escena, con otra situación y otros números, sin copiar `papel.json`. Cada par tiene su verificador en `catalogo/pruebas/verificar.js` (secciones «Reserva de … (rutina de matemática C)»), y ahí la respuesta y cada distractor salen del motor de su plantilla. Algunos verificadores comprueban además que el enunciado cuadre con el motor: la hipotenusa dada, que P equidiste de A y de B, el polígono con un vértice arriba y los radicales exactos en tt-01.

| Par | Plantilla | Qué mide | Correcta A / B | Códigos |
| --- | --- | --- | --- | --- |
| cx-01 | numeros-complejos | Módulo √(a² + b²) | 17 / 13 | AL9 (parcial), CX10, CX11 |
| cx-02 | numeros-complejos | iⁿ con el resto entre 4 (i²⁷, i⁵⁹) | −i / −i | CX2, CX3, CX4 |
| re-01 | numeros-reales | \|x − a\| ≤ r como trozo | [1; 9] / [−2; 8] | AL22 (parcial), NR5, NR6 |
| re-02 | numeros-reales | Imagen de kx + t con k < 0 | [−11; 7⟩ / ⟨−10; 6] | AL20, NR20, NR22 |
| po-01 | polinomios | Resto de P ÷ (x + 2) es P(−2) | 11 / 15 | PO8, PO15, PO27 |
| po-02 | polinomios | Teorema del factor, despejar k | −8 / −10 | PO17, PO33, AL16 |
| pl-01 | programacion-lineal | Traducir «a lo más» | 5x + 2y ≤ 40 / 3x + 4y ≤ 120 | PL14 (parcial), PL15, PL12 (parcial) |
| pl-02 | programacion-lineal | Máximo de z en los vértices | (5; 4) / (4; 5) | PL5, PL4, PL7 |
| cg-01 | congruencia | Punto de la mediatriz equidista | 25 cm / 41 km | PM-como-PB, suma-de-segmentos, GE11 |
| cg-02 | congruencia | Mediana a la hipotenusa = mitad | 8,5 cm / 12,5 m | mediana-igual-cateto, GE8 (parcial), mediana-promedio-catetos |
| sa-01 | segmentos-angulos | Alternos internos iguales, despejar x | 45 / 50 | GE17, despeje-signo, da-el-angulo-y-no-x |
| sa-02 | segmentos-angulos | Segmentos que se pisan | 8 km / 9 cm | suma-segmentos-solapados, resta-da-otro-segmento, promedia-los-datos |
| si-01 | simetria | Simétrico respecto de y = x + c | (3; 6) / (5; 4) | se-queda-en-el-pie, refleja-en-vertical, intercambia-coordenadas |
| si-02 | simetria | Ejes de un regular impar | 5 / 3 | solo-el-eje-vertical, impar-sin-ejes, cuenta-vertices-y-lados-aparte |
| tt-01 | transformaciones-trig | sen A + sen B a producto, sin tabla | √6/2 / √2/2 | TR16, TT2, TT1 |
| tt-02 | transformaciones-trig | (sen px + sen qx)/(cos px + cos qx) | tan 8x / tan 7x | TT4, TT2, TT3 |

No hay pares para conjuntos y lógica en álgebra porque ya están en la reserva de aritmética (ari-23 a ari-26).

**Pruebas.** `npm test`: 4126 en verde, comprobado en una copia limpia de la rama antes de cada push. `app/datos/pruebas.json` regenerado: la reserva no viaja a la app, pero sí los códigos nuevos del diccionario `errores`.

**Avisos que quedan (no fallan).**

- Los 16 pares avisan «ya está en el catálogo; pasa el par de "reserva" a "pares"». Siguen en reserva porque las formas de álgebra, geometría y trigonometría ya tienen 10 pares, el tope. Si se quieren en la app, hay que elegir cuáles salen.
- Cada par comparte sus códigos con una predicción de su escena. Eso es lo esperado en transferencia cercana. No hubo avisos de parecido con el papel (re-02 se cambió porque se parecía a p5).

**Dudoso.**

- `GE11-resta-cuadrados` está como `hipotesis` en el diccionario de geometría, pero la escena de congruencia lo marca `parcial`. Lo dejé en hipótesis porque en la duda se baja un escalón. Conviene igualar la escena o el banco.
- si-02 B (el triángulo, 3 ejes) puede salir más fácil que A (el pentágono). El heptágono está en la escena y el eneágono obligaba a escribir «nueve lados», lo que dejaba la respuesta en el enunciado.
