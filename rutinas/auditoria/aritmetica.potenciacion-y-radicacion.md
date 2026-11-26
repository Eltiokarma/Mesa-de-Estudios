# Auditoría de contenido: «Potenciación y radicación» (aritmetica.potenciacion-y-radicacion)

26 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa9/propuesta-aritmetica.md`. Antes pasó el redactor
(`rutinas/redaccion/aritmetica.potenciacion-y-radicacion.md`), con ocho notas para el auditor; aquí se cierran. Lo que
vieron los dos lectores en frío está en `rutinas/frio/aritmetica.potenciacion-y-radicacion.md`.

**Qué se revisó.**
- La teoría `contenido/teoria/aritmetica/potenciacion-y-radicacion.js`: las 6 ideas con sus 7 momentos, los 90
  ejemplos, y «Ahora tú» y «Así se resuelve» en 200 semillas por idea, todo leído como texto plano (lo que ve el alumno).
- La práctica `plantillas/potencias-raices/` (24 tipos en 6 ideas), sus `casos.json` y su papel.
- La app a 390 px con `--entera --lector` (servidor propio, puerto 4238): 42 momentos y 90 ejemplos, sin pantallas de
  error (md5 sin repetidas).

**Herramientas propias** (en
`/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-aritmetica/aud/`),
escritas sin el código de la unidad: `plano.js` aplana el texto rico de cada momento; `cuentas.js` lee cada pregunta de
«Ahora tú» y cada enunciado de «Así se resuelve» como texto, reconoce su tipo (28 tipos) y rehace la respuesta por
fuerza bruta (factorizaciones, menor multiplicador o divisor, raíces enteras por búsqueda, conteos uno por uno, décimas
y centésimas), y compara también que ningún distractor valga lo mismo que la correcta.

**Cuentas.**
- **2 400 casos** (200 semillas × 6 ideas × «Ahora tú» y «Así se resuelve»): todas las correctas cuadran. Lo que no
  cuadraba era el texto de «Así se resuelve» de la idea 2 (abajo, grave 2).
- **Las 6 predicciones** con sus 18 distractores, rehechas: 600 × 6 = 3 600 = 60² (30, 24 y 2 dan 18 000, 14 400 y 1 200);
  2 021 entre 44² y 45²; 18 = 2 × 9; 217 = 729 − 512 (17, 192, 1); 22 = 31 − 10 + 1 (21, 31, 29 = ⌊√899⌋); √2 entre
  1,41 y 1,42 (1,9881 y 2,0164).
- **Los 30 ejemplos de nivel 3** (y los 60 de niveles 1 y 2) rehechos a mano con su explicación de cada trampa: todos
  cuadran (540 × 15 = 90², 1 350 × 20 = 30³, 12 divisores cuadrados de 3 600, 75 × 12 = 30², 72 × 648 = 36³; 87² = 7 569;
  76² = 5 776; 575, 139, 100 sillas, 440, 25; 1 330, 412, 14, 43, 17; 68, 17, 3, 13, 11; 3,31–3,32, 7,0, 13, 6,4, 10).
- **Las 6 misiones** con su grilla: una sola manera en cada una (144; cifra 6; 41; 74; a = 50 y b = 121; √10 con 3,1).
- **La práctica**: 34 pruebas propias en verde; el caso nuevo de `casos.json` (c5: 168 × 42 = 7 056 = 84²) rehecho aparte.
- **Validador con `calidad: 2` simulada** (400 semillas, en la prueba de la unidad): sin hallazgos.
- **Ecuaciones a 390 px** (`herramientas/ecuaciones-ancho.js`): todo cabe después de las correcciones.

## Hallazgos

| # | Gravedad | Punto | Dónde | Evidencia | Corrección propuesta |
| --- | --- | --- | --- | --- | --- |
| 1 | Alta | 13 y regla 3 (lo previo no responde) | idea 6, Lee, tarjeta «La calculadora de doña Juana» | El texto y la pantalla dicen √2 = 1,4142135, y la Predice pregunta entre qué centésimas está √2 (1,41–1,42). La regla `antes-predice` no lo ve porque la respuesta no sale entera. | Mostrar otra raíz irracional en la calculadora (√6) y sacar el 6 de «Ahora tú». |
| 2 | Alta | 13 (aprende algo falso) | idea 2, «Así se resuelve», 13 de 200 semillas | «70 000 termina en tres ceros», «30 000 … que tiene tres ceros»: el generador multiplicaba por 1 000 un número de dos cifras que podía terminar en 0 (cuatro ceros). | Saltar esos casos (`b % 10 000 === 0`). |
| 3 | Alta | 13 | idea 2, «Ahora tú» tipo 0 (y práctica `descarta`) | «20 000 termina en 2: ningún cuadrado termina así» (s108); con 20 × 10 = 200 pasa lo mismo. El criterio enseñado no cubre una cifra mala antes de una cantidad par de ceros. | Solo uno o tres ceros en lo que se descarta por ceros. |
| 4 | Media | 13 (datos que bastan, sin sobrar) | idea 4, «Ahora tú» tipo 4 (`casoAristaCubo`) | Los Datos traen 30³ = 27 000 y la solución dice «entre 10³ y 30³», pero el filtro deja solo 12, 13, 17 y 18 (nota 2 del redactor). | Datos con 10³ y 20³; «entre 10³ y 20³»; k de 11 a 19. |
| 5 | Media | Ahora tú: errores reales | idea 1, «Ahora tú» tipos 1 a 3 | Distractor «1» en «¿por qué número mínimo hay que multiplicar…?» (AT-OTRO-INDICE con 3 969 = 63², AT-EXP-UNO con 1 512) y en «dividir». Nadie responde «por 1» (nota 3 del redactor). | Quitar el distractor cuando vale 1 (la app busca otro caso). |
| 6 | Media | Ahora tú: errores reales | idea 3, ejemplo «El mayor con raíz 23» | La trampa E (546) «no sale de ninguna cuenta» (nota 4 del redactor). | E = 46: da el residuo más grande en vez del número. |
| 7 | Media | Ahora tú: `siFuera` | idea 6, «Ahora tú» tipo 2 (por exceso o defecto) | El distractor lejano decía «Ese valor no es ninguno de los dos bordes del tramo»: no dice qué hizo bien ni el porqué. | Decir su cuadrado y por qué no es la primera décima que se pasa (o la mayor que cabe). |
| 8 | Baja | 5 (escritura) | ideas 3 y 4, «Ahora tú» y «Así se resuelve» | «1106», «1520», «Faltan 1144», «1140», «r = 1008» sin espacio, mientras el resto de la unidad escribe «1 081» (nota 5 del redactor). | Pasarlos por `ent`. |
| 9 | Baja | verdad frágil | idea 6, «Ahora tú» tipo 2 | «N/2 al cuadrado pasa de N» es falso con N = 2 y 3; hoy no salen por `USADOS6` (nota 6 del redactor). | Exigir N ≥ 5 en ese tipo. |
| 10 | Baja | Práctica distinta de la teoría | práctica `mult-cuadrado` | Podía sacar 600, el de la Predice de la idea 1 (nota 7); su caso c5 de `casos.json` era justo 600. | Excluir 600 y rehacer c5. |
| 11 | Baja | 13 | idea 2, «Ahora tú» tipo 0 | «termina en 3 ceros» en cifra, «tres ceros» en el resto. | En palabras. |

Las ocho notas del redactor: 1 → hallazgo 1; 2 → 4; 3 → 5; 4 → 6; 5 → 8; 6 → 9; 7 → 10; 8 («N es un entero positivo» en
tres condiciones): se queda, no estorba; dice el dominio que antes estaba implícito y los lectores no lo marcaron.

## Lo que está bien y hay que copiar al molde

- La prueba de la unidad rehace la correcta de «Ahora tú» desde el texto de la pregunta, por fuerza bruta, en 400
  semillas: por eso las 2 400 respuestas cuadraron. Lo que falló fue texto de los pasos y de los `siFuera`, que esa
  prueba no lee.
- Misiones con una sola manera en su grilla, comprobada por fuerza bruta, y predicciones que el juego no alcanza (el juego
  6 va por décimas y la Predice pide centésimas).
- La figura de un ejemplo de conteo no pinta los puntos de adentro (diría cuántos son).
- El color fijo por magnitud con su prueba, y lo que falta en tinta y punteado.

## Reglas que faltan en el contrato o el validador

| Regla | Qué pediría | ¿Automática? |
| --- | --- | --- |
| `antes-predice` por cifras | Que nada antes de Predice traiga el valor de una opción correcta con decimales ni sus primeras cifras (1,41 de «Entre 1,41 y 1,42»), aunque la opción sea un texto con dos números. | Sí: tomar los números de la opción correcta y buscarlos en Lee, la consigna, la misión, la leyenda y los rótulos de las piezas de Lee (la pantalla de `arit-calculadora`). |
| `siFuera-vacío` | Un `siFuera` dice qué valor da el error o por qué no sirve; frases como «Ese valor no es ninguno de…» no explican. | A medias: una lista de frases vacías y un número mínimo de cifras o palabras de la pregunta en el `siFuera`. |
| `distractor-trivial` | Ninguna opción de «menor multiplicador» o «menor divisor» vale 1. | Sí, por tipo de pregunta. |
| `cifras-con-espacio` | En una unidad que escribe «1 081», ninguna cifra de cuatro o más va pegada (fuera de bases, años y códigos). | Sí: la prueba de esta unidad ya lo hace para las ideas 3 y 4. |
| `pasos-ciertos` | La prueba propia de la unidad mira también lo que afirman los pasos de «Así se resuelve» («termina en tres ceros») y no solo la respuesta. | Por unidad, con las cuentas aparte de su prueba. |

## Correcciones (26 nov)

Cada corrección con su prueba, que falla con la versión anterior (`contenido/teoria/aritmetica/potenciacion-y-radicacion.test.js`,
cinco pruebas nuevas «auditoría: …», escritas y vistas fallar antes de corregir; y una en `plantillas/potencias-raices/generador.test.js`).

1. **Lee de la idea 6**: la calculadora muestra √6 = 2,4494897 («Las cifras de √6 nunca terminan ni se repiten»), y el 6
   entra en `USADOS6`, así que ningún «Ahora tú» pregunta por √6. Prueba: nada de Lee, la consigna ni la misión trae
   «1,41», y la raíz de la calculadora no sale en 400 semillas de «Ahora tú». Captura revisada a 390 px.
2. **«Así se resuelve» de la idea 2**: se saltan los múltiplos de 10 000. Prueba en 400 semillas.
3. **«Ahora tú» tipo 0 de la idea 2 y práctica `descarta`**: se saltan los casos con dos o cuatro ceros; «tres ceros» en
   palabras. Pruebas en 400 y 2 000 semillas.
4. **Arista del cubo (idea 4)**: Datos «10³ = 1 000; 20³ = 8 000», solución «entre 10³ y 20³», k de 11 a 19. La práctica
   `arista` va de 11 a 29 y ya escribía el tramo de cada caso: no se toca.
5. **Distractor 1 (idea 1)**: fuera en multiplicar (AT-OTRO-INDICE y AT-EXP-UNO) y en dividir (AT-OTRO-INDICE). En
   «cuántos divisores son cuadrados» el 1 se queda: es un conteo real (AT-SIN-CERO).
6. **«El mayor con raíz 23»**: E = 46, «es el residuo más grande, 46, y no el número». La letra correcta sigue en B.
7. **Por exceso o defecto (idea 6)**: el distractor lejano dice su cuadrado y por qué no es la décima que va
   («8,8² = 77,44 pasa de 74, pero 8,7² = 75,69 ya pasaba: por exceso va la primera décima que se pasa»).
8. **Cifras con espacio** en «Ahora tú» de las ideas 3 y 4 (opciones, `siFuera` y solución) y en «Así se resuelve» de las
   dos. La prueba de la unidad lee ahora las opciones con espacio.
9. **N ≥ 5** en «por exceso o defecto».
10. **Práctica**: `mult-cuadrado` no saca 600; `casos.json` c5 pasa a N = 168, respuesta 42 (168 = 2³ × 3 × 7; × 42 = 7 056
    = 84², rehecho en Python aparte). Papel al día (`papel-generador.js --revisar` no la lista).

Pruebas: unidad 14 de 14; práctica 34 de 34; mis cuentas aparte, 0 fallas en 2 400 casos; ecuaciones a 390 px, todo cabe.
`contenido/teoria/teoria.test.js`: 160 de 164; las cuatro fallas son de otras unidades en curso (binomio de Newton,
geometría molecular, arreglos numéricos y el glosario de Álgebra sin regenerar), ninguna de esta.

**Decidido por la sesión, Gerson revisa después.** La calculadora de la idea 6 muestra √6 y no √2 (la propuesta, §2,
decía √2 con su pantalla): √2 sigue siendo el hilo de la idea, pero su pantalla respondía la Predice.
