# Teoría de Álgebra: reporte de la sesión (14 nov 2026)

Encargo: `rutinas/encargos/teoria-algebra.md`. Rama `teoria/algebra`, salida de `claude/awesome-einstein-ch5g9a`. No se integró a main.

## Resultado

Las 19 unidades de `catalogo/cursos/algebra.json` tienen su teoría en `contenido/teoria/algebra/<unidad>.js`. Las 19 están en estado `completa`: cada tema del catálogo está en una idea que lo enseña. Suman 96 ideas, cada una con sus cinco momentos.

| Grado | Unidad | Estado | Ideas | Ids | Piezas | Códigos TAL nuevos |
| --- | --- | --- | --- | --- | --- | --- |
| 3.º | logica-y-conjuntos | completa | 6 | condicional, equivalencias, operaciones, potencia, cuantificadores, certezas | alg-tabla, alg-venn, recta | 28 |
| 3.º | numeros-reales | completa | 4 | orden, intervalos, acotados, tabla-operacion | recta, alg-tabla | 16 |
| 3.º | exponentes-y-productos-notables | completa | 5 | leyes-exponentes, radicales, cuadrado-suma, radicales-dobles, racionalizar | alg-tabla, alg-baldosas, ejes | 21 |
| 3.º | ecuaciones-lineales-y-cuadraticas | completa | 5 | balanza, dividir-entre-x, discriminante, suma-producto, planteo | balanza, recta, ejes, alg-tabla | 17 |
| 3.º | polinomios | completa | 5 | grados, valor-numerico, completo-ordenado, igualdad, operaciones | alg-tabla, ejes | 13 |
| 3.º | division-de-polinomios | completa | 5 | algoritmo, ruffini, divisor-k, teorema-resto, cocientes-notables | alg-tabla, ejes | 14 |
| 3.º | factorizacion | completa | 5 | factor-comun, aspa-simple, aspa-doble, teorema-factor, mcd-mcm | alg-tabla, alg-baldosas, ejes | 18 |
| 4.º | inecuaciones | completa | 4 | lineales, cuadraticas, puntos-criticos, fraccionarias | recta, ejes | 9 |
| 4.º | valor-absoluto-y-radicales | completa | 4 | distancia, casos-absoluto, radical-ecuacion, radical-inecuacion | recta, ejes | 9 |
| 4.º | ecuaciones-polinomiales | completa | 6 | grado-raices, viete, raices-racionales, conjugadas, cambio-de-variable, binomica | ejes, alg-tabla, recta, flechas | 18 |
| 4.º | funciones | completa | 6 | dominio-rango, cuadratica, especiales, composicion, traslaciones, polinomial | ejes, recta, alg-tabla | 36 |
| 4.º | sistemas-de-ecuaciones | completa | 5 | dos-rectas, gauss, cramer, rouche, no-lineal | ejes, alg-tabla | 10 |
| 5.º | tipos-de-funciones-e-inversa | completa | 5 | paridad, monotona, inyectiva, inversa, modelacion | ejes | 18 |
| 5.º | exponenciales-y-logaritmos | completa | 6 | exponencial, logaritmo, numero-e, logaritmica, ecuaciones, inecuaciones | ejes, alg-tabla | 16 |
| 5.º | numeros-complejos | completa | 6 | por-i-gira, forma-binomica, conjugado-modulo, polar, raices, regiones | flechas, ejes | 18 |
| 5.º | matrices-y-determinantes | completa | 5 | fila-por-columna, tipos-traza-transpuesta, determinante-area, inversa-adjunta, rango | alg-tabla, ejes | 17 |
| 5.º | programacion-lineal | completa | 4 | semiplano, region-factible, recta-de-nivel, casos-especiales | ejes | 5 |
| 5.º | sucesiones-y-series | completa | 6 | progresiones, limite, recurrencia, gauss, telescopica, serie-geometrica | ejes, alg-tabla | 25 |
| 5.º | binomio-de-newton | completa | 4 | pascal-elecciones, termino-general, exponente-no-natural, potencia-trinomio | alg-tabla, ejes | 14 |

Puntos del expediente que se respetaron:
- El microguion «dividir por x exige revisar x = 0» es una idea entera de ecuaciones (`dividir-entre-x`):
  - x² = 3x con la rama x ≠ 0;
  - el juego x² = kx con k ∈ {−2, 0, 4};
  - la transferencia x(x − m) = nx;
  - el contraste con x²/x = k.
- Las precisiones de Aritmética y Álgebra están en las reglas y condiciones:
  - factorizar es reescribir como producto;
  - la suma de las raíces es −b/a y el producto, c/a, normalizando;
  - el óptimo de programación lineal puede ser todo un lado, no existir o tener una región vacía;
  - la inversa como reflejo vale solo si la función es biyectiva;
  - el logaritmo admite valores no enteros, con base positiva distinta de 1;
  - una lista finita admite muchas reglas.
- La figura del cuadrado de una suma vale para lados positivos. El caso negativo se resuelve con álgebra.

## Cómo se hizo

- La unidad de lógica y las tres piezas nuevas las escribí yo. Esa unidad quedó como molde de Álgebra.
- Las otras 18 las escribieron seis subagentes en paralelo, tres unidades cada uno, con el mismo contrato y las mismas herramientas de revisión.
- Cada unidad:
  - se validó con `Teoria.problemas`;
  - se leyeron en texto plano de 5 a 8 casos de «Ahora tú» por idea;
  - se recorrió en Playwright a 360 × 780, mirando hojas de contacto de juega, revela, mira, regla, ahora tú y solución;
  - tuvo al menos una idea revisada en tema oscuro.
- Se hizo un commit por unidad. El `catalogo.json` de cada commit lleva solo las unidades ya confirmadas, así que cada commit pasa su propia prueba de catálogo.

## Piezas nuevas del kit (`nucleo/kit/piezas/`, pruebas en `alg-piezas.test.js`)

| Pieza | Afirmación | Sirve para |
| --- | --- | --- |
| `alg-tabla` | Cada casilla sale de otras que ya se ven; nada aparece sin su origen | Tablas de verdad, sustitución, Ruffini y Horner (separador y flechas «multiplica y suma»), aspas, matrices con corchetes, Pascal triangular, tablas de signos y de operación, con pie y fantasma por casilla |
| `alg-baldosas` | El área del todo es la suma de las piezas; cada pieza es su ancho por su alto | Productos notables, multiplicación de polinomios, factor común, aspa y completar cuadrados. Una sola escala; `separar` aparta las piezas sin cambiar su tamaño |
| `alg-venn` | Cada elemento vive en una sola región, y cada operación es un conjunto de regiones | Operaciones con conjuntos, De Morgan, cardinal de la unión y cuantificadores. Sombreado con puntitos (se lee en grises), sin ids ni clipPath |

- Las tres se revisaron renderizadas a 360 px, en tema claro, oscuro y en grises.
- Correcciones después de mirarlas:
  - los rótulos de las baldosas pasaron a tinta (en color se perdían sobre su propio relleno);
  - la tabla ganó `pie` (antes, una fila de «y N más» ensanchaba la primera columna);
  - las flechas de la tabla nacen en el borde de la caja del texto (en Ruffini tapaban el producto).

## Pedidos al molde

1. **Error en el lector (`app/teoria.js`, no lo toqué):**
   - `const [, , , sub] = location.hash.split('/')` toma el índice 3 del hash, que siempre es «teoria»; la idea está en el índice 4.
   - Por eso `#/unidad/<id>/teoria/<idea>`, `#/…/teoria/ficha` y los chips de ideas abren siempre la primera idea sin terminar.
   - Arreglo propuesto: `const sub = location.hash.split('/')[4]`.
   - Para recorrer las unidades en Playwright marqué como hechas las ideas previas.
2. **El botón fijo tapa la condición:** en la pantalla de la regla, el botón fijo de abajo tapa en parte la condición a 360 × 780 (visto en programación lineal). Pide un margen inferior en `.te-zona`.
3. **Notación de intervalos (decisión de Gerson):**
   - Números reales, inecuaciones y valor absoluto escriben (a; b).
   - Funciones, tipos de funciones y logaritmos escriben ⟨a; b⟩, como la plantilla `numeros-reales` y los exámenes peruanos.
   - Hay que elegir una. En las capturas, ⟩ se parece a «)».
4. **Balanza:** a 360 px la balanza del kit queda chica para ecuaciones (las cajas x son pequeñas y rozan el platillo). Lo vio la sesión de ecuaciones; la pieza no es de Álgebra y no se tocó.
5. **Respuesta manipulable:** se resolvió todo con opciones. Varias ideas pedirían arrastrar una marca, como un extremo de intervalo, una raíz o un vértice.

## Códigos de error

- **De la investigación y de las plantillas:**
  - AL1–AL3, AL8–AL10, AL14–AL23, AL28, AL29, AL31–AL33 de `docs/investigacion/algebra-funciones-ideas-erroneas.md`;
  - NR, PO, BN, EL, CX, MT y PL de las plantillas de cada tema.
- **Nuevos, todos hipótesis de diseño (prefijo `TAL-`):**
  - Son unos 320 entre las 19 unidades; la tabla de arriba da cuántos tiene cada una.
  - Cada uno vive en su archivo, junto a la opción que lo usa, con su `siFuera`.
  - **Cuidado al analizar:** el mismo nombre corto aparece en unidades distintas con sentidos distintos (TAL-DELTA es la diferencia simétrica en lógica y el discriminante en ecuaciones; TAL-SIGNO, TAL-SUMA y TAL-RESTA se repiten). El evento de medición lleva `unidad` e `idea`, así que el análisis tiene que agrupar por (unidad, idea, error), nunca por el código solo.
  - Ninguno tiene dato de prevalencia en alumnos peruanos.

## No verificado

- Celular real (el de Gerson), lector de pantalla y otros navegadores. Todo se miró en Chromium de Playwright.
- Prueba con alumnos: ninguna idea se probó con personas.
- Algunos textos de pasos de «Mira» traen números escritos a mano, como la unidad de referencia. Las cuentas de predicciones, revelados, opciones y soluciones salen del código.
- Detalles visuales menores que quedan:
  - en el último paso del determinante, «col 1» y «col 2» se enciman;
  - en complejos, cuando las flechas son cortas, los rótulos cerca del origen tocan a î y ĵ;
  - en la circunferencia de sistemas no lineales, (3; 4) y (4; 3) quedan juntos;
  - en la telescópica, las casillas que se cancelan se marcan solo con borde punteado.
- Algunas semillas de «Ahora tú» quedan con 3 opciones, porque un distractor coincide con la respuesta y se descarta. El validador lo admite.

## Reporte de diseño

- **Ficha de tarea:** una de 6 líneas al inicio de cada archivo. Las ideas llevan encima sus cinco decisiones (cambia, permanece, progresa, se reserva, debe verse).
- **Sistema:** el existente (`docs/diseno.md`, tokens c-o, c-i, c-h y c-d, trazos 3/2/1 del kit, texto de 16 en un lienzo de 320). Decisiones nuevas:
  - el sombreado por puntos de Venn;
  - la convención de color de cada unidad, escrita en la cabecera de su archivo (p y A naranja, q y B turquesa, verdadero o «cumple» verde, falso o contraejemplo rojo).
- **Carácter:** acogedora, viva y precisa, como en el proyecto. La firma es el hilo de color: la variable conserva su color en el control, la figura, la pregunta y la ecuación.
- **Movimientos:** no se agregó ninguno. Los pasos de «Mira» usan la línea de tiempo del kit (`paso` 900 ms, lo hecho se queda), y las piezas solo marcan `kit-nuevo`, `kit-aparece` y `kit-crece`. Con movimiento reducido rige el CSS del kit.
- **Verificación:**
  - recorrido en Playwright de las 96 ideas a 360 × 780, sin errores de consola de las unidades (las advertencias de preload del catálogo son de la app);
  - pruebas de pureza, alto fijo, texto ≥ 14 y colores solo de variable en las piezas nuevas;
  - topes de texto vigilados por `teoria.test.js`.
- **Hipótesis:** jugar con la tabla o el diagrama antes de predecir debería bajar los errores de recíproca (TAL-RECIPROCA) y de división entre x (AL15). Se comprobaría comparando la tasa de esos errores en la predicción con la de «Ahora tú» en la medición del piloto.
- **Conflictos:** ninguno con el skill. El del repo es el error del lector (pedido 1), que impide abrir una idea por su ruta.
