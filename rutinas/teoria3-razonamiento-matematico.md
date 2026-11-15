# Ronda 3 de la teoría: glosario y retos comprobados en razonamiento matemático (15 nov 2026)

Rama `teoria3/razonamiento-matematico`, desde `claude/awesome-einstein-ch5g9a`. Son las 19 unidades del curso, cada una con su glosario y con retos en todas las mesas del laboratorio. Hay un commit por unidad, más uno para cuatro términos que quedaron entre bloques y otro para `app/datos/`.

- **Cómo se hizo:** cinco subagentes en paralelo, en bloques del orden del curso (1–4, 5–8, 9–12, 13–16, 17–19). Antes de definir un término, cada uno comprobaba en qué unidad aparecía primero, así cada término se define en la unidad que lo estrena.
- **Pruebas:** `node --test contenido/teoria/teoria.test.js nucleo/glosario.test.js` dio 161 de 161 en verde. El índice del curso no da ningún problema: ningún término repetido ni ningún `ver` roto. `npm test` completo: 8549 de 8549 en verde.

## Términos y retos por unidad

Los heredados son términos de otras unidades del curso que salen en el texto de esta (datos de `app/datos/glosario/razonamiento-matematico.json`).

| Unidad | Propios | Heredados | Retos |
|---|---|---|---|
| razonamiento-deductivo | 14 | 1 | 13 (3 mesas) |
| trazos-y-perimetros | 16 | 1 | 11 (3 mesas) |
| ordenamiento-de-informacion | 10 | 3 | 12 (3 mesas) |
| verdades-y-mentiras | 10 | 3 | 12 (3 mesas) |
| traslados-y-puntos-cardinales | 13 | 1 | 11 (3 mesas) |
| arreglos-numericos | 10 | 1 | 11 (3 mesas) |
| razonamiento-inductivo | 12 | 4 | 10 (3 mesas) |
| juegos-recreativos | 7 | 4 | 11 (3 mesas) |
| cronometria-y-calendarios | 12 | 5 | 12 (3 mesas) |
| certezas | 9 | 3 | 11 (3 mesas) |
| frecuencia-de-sucesos | 10 | 5 | 11 (3 mesas) |
| ruedas-poleas-engranajes | 13 | 6 | 9 (2 mesas) |
| maximos-y-minimos | 11 | 4 | 12 (3 mesas) |
| cortes-y-pesadas | 10 | 3 | 12 (3 mesas) |
| planteo-de-ecuaciones | 11 | 6 | 12 (3 mesas) |
| transformaciones-de-figuras | 13 | 12 | 12 (3 mesas) |
| rutas-y-visualizacion-espacial | 10 | 4 | 12 (3 mesas) |
| tablas-graficos-y-suficiencia | 11 | 4 | 12 (3 mesas) |
| diagramas-de-flujo | 12 | 2 | 11 (3 mesas) |
| **Total** | **214** | | **217** |

Todas las mesas tienen retos: 56 mesas en total, con 3 a 5 retos cada una. Cada `logrado` usa las funciones que dibujan la mesa. Los «el mayor» y «el menor» se calculan con el motor sobre todos los casos de la mesa: no hay cifras escritas a mano.

En varias unidades se sacaron funciones del dibujo a funciones con nombre, que ahora comparten el dibujo, la lectura y los retos: `acumulado`, `diaCal`, `alMenos`, `pruebas`, `cuentaTomas`, `mcm3`, `tramoTotal`, `vueltasB`, `vueltasC`, `vueltasFaja`, `vueltasDe`.

### Tipos de reto, por mesa

- **razonamiento-deductivo**
  - venn-libre: caso; forma; extremo; comparación (idea central: algún A es C en un dibujo y en otro no).
  - pistas-a-eleccion: caso; extremo (el mínimo de pistas lo calcula el motor: 3); forma; caso; comparación.
  - cualquier-pariente: caso; extremo; comparación (idea central: padre ↔ hijo); comparación.
- **trazos-y-perimetros**
  - lineas-sueltas: forma (idea central); extremo; caso; comparación.
  - escalera-con-entrante: extremo; exacto; forma; comparación.
  - arcos-arriba-y-abajo: forma; extremo; comparación.
- **ordenamiento-de-informacion**
  - mesa-redonda: forma; caso; forma; comparación (idea central).
  - mesa-cuadrada-libre: caso; forma; extremo; comparación.
  - pistas-a-elegir: caso; caso; extremo; comparación.
- **verdades-y-mentiras**
  - tres-que-hablan: caso; extremo; forma; comparación.
  - quien-fue: caso; caso; extremo; comparación.
  - seis-alumnos: forma (idea central); extremo; caso; comparación.
- **traslados-y-puntos-cardinales**
  - paseo-de-cuatro-tramos: exacto (idea central); exacto; extremo; comparación.
  - mudanza-paso-a-paso: exacto (idea central); forma; comparación.
  - pasar-dos-numeros: exacto; exacto; extremo; comparación.
- **arreglos-numericos**
  - reparto-libre: idea central (total par sin reparto); exacto; extremo; comparación.
  - magico-libre: exacto; extremo; comparación.
  - triangulo-libre: idea central; extremo; extremo; comparación.
- **razonamiento-inductivo**
  - palitos-libres: exacto; comparación; extremo.
  - seis-puntos: idea central (el primer contraejemplo); exacto; exacto; comparación.
  - impares-desde: exacto; extremo; comparación.
- **juegos-recreativos**
  - domino-marcado: exacto; caso límite; extremo; comparación (idea central).
  - pila-dados: exacto; extremo; comparación.
  - rectangulo-cerillas: exacto; forma; extremo; comparación.
- **cronometria-y-calendarios**
  - reloj-libre: extremo; idea central (90° sin hora en punto); extremo; comparación.
  - reloj-que-gana: exacto; exacto; extremo; comparación.
  - calendario: exacto; exacto; patrón; comparación.
- **certezas**
  - urna-libre: exacto (idea central); caso raro; extremo; comparación.
  - palomar-libre: idea central; extremo; patrón; comparación.
  - llaves-libre: exacto; extremo; comparación.
- **frecuencia-de-sucesos**
  - receta-libre: exacto; extremo; patrón; comparación.
  - tres-ritmos: caso; exacto; idea central (MCM = producto); extremo.
  - tramo-del-dia: exacto; extremo; comparación.
- **ruedas-poleas-engranajes**
  - tren-de-engranajes: exacto; comparación (idea central: el del medio no decide); extremo; patrón.
  - faja-libre: idea central; exacto; patrón; extremo; comparación.
- **maximos-y-minimos**
  - cuarta-recta: forma; forma; extremo; idea central (la recta es infinita).
  - rio-libre: exacto (idea central); caso; extremo; comparación.
  - precio-libre: exacto (idea central); forma; extremo; simetría.
- **cortes-y-pesadas**
  - cortes-libre: comparación (idea central); forma; exacto; extremo.
  - reparte-monedas: extremo (idea central); exacto; extremo; comparación.
  - pesas-libre: forma; caso; extremo; comparación.
- **planteo-de-ecuaciones**
  - veces-o-mas: comparación; extremo; forma; comparación.
  - edades-libres: exacto (idea central); exacto; forma; extremo.
  - corral: comparación; exacto; extremo; forma.
- **transformaciones-de-figuras**
  - dos-movimientos: idea central; forma; patrón; exacto.
  - moneda-y-disco: exacto (idea central); caso; extremo; comparación.
  - punto-fijo-movil: extremo (idea central); exacto; extremo; comparación.
- **rutas-y-visualizacion-espacial**
  - dos-cierres: extremo; extremo; exacto; comparación.
  - caja-que-crece: exacto; extremo (idea central); comparación; comparación.
  - arma-la-pila: forma; idea central; forma con tope; comparación.
- **tablas-graficos-y-suficiencia**
  - eje-libre: exacto; extremo; idea central; comparación.
  - liga-libre: exacto; extremo; comparación; comparación.
  - casos-en-el-plano: idea central; forma; forma; comparación.
- **diagramas-de-flujo**
  - bucle-libre: exacto; extremo; forma; comparación (idea central: el orden cambia S).
  - umbral: exacto; extremo; comparación.
  - operadores-libres: idea central (a ≠ b y a ∗ b = b ∗ a); exacto; extremo; comparación.

## Mesas ampliadas y arreglos en los motores

- **verdades-y-mentiras · tres-que-hablan:** el control `fc` tiene una opción nueva, `valor: 3` («Ana dice la verdad»). El comentario de la mesa prometía frases con varias suposiciones que encajan, y ninguna de las existentes lo cumplía; con esta encajan dos. No cambió ningún id.
- **maximos-y-minimos · cuarta-recta:** `contarRegiones` contaba como cuatro rectas el caso en que la cuarta cae encima de una fija, y la lectura decía 9 regiones cuando son 7. Ahora quita las rectas repetidas.
- **Textos tocados para que el término salga.** Son pasos de «Mira», reglas o consignas, y siguen dentro de los topes:
  - premisa y diagrama de Venn; condicional, forma directa y forma indirecta;
  - recorrido euleriano (en la historia); ordenamiento lineal y circular; frases contradictorias;
  - torre de Hanói, mínimo de movimientos y recurrencia; progresión aritmética;
  - término general y sucesión; principio del palomar; frecuencia; inversamente proporcional; polea;
  - sistema de ecuaciones; semejante y factor de escala;
  - principio de adición, factorial, permutación con repetición y ciclo hamiltoniano; suficiencia de datos;
  - diagrama de flujo, asignación y conmutativo.
  - En cortes-y-pesadas, la voz «la pesada está afuera» pasó a «la moneda distinta está afuera», porque chocaba con el término «pesada».

## Palabras dudosas

- **Fuera por comunes o con doble sentido:** reparto, todos, ninguno, total, mitad, casilla, acertijo, área, doble, triple, tercio, segmento, cruce, diagonal, mínimo, máximo, par e impar sueltos y «eje».
  - «Par» sale antes como «pareja» en deductivo. Se dejaron «vértice impar» y «par sin orden».
  - «Eje» es barra de giro en ruedas y eje de la gráfica en tablas. Se definieron «mismo eje» y «eje vertical».
- **Dentro, aunque dudé:**
  - urna, cerilla (en Perú se dice «fósforo»), producto, ambas incluidas (es una frase), dado común (porque «pasos dados» marcaría «dado»);
  - pesas, en plural, porque «pesa» choca con el verbo;
  - «radio», que se define en deductivo porque es la primera unidad donde sale (en el rótulo de un control).
- **Formas recortadas a propósito:**
  - «entero», sin «entera» ni «enteras» (marcaban «mesa entera», «hora entera»);
  - «necesario», sin «necesaria» (deductivo dice «conclusión necesaria», en otro sentido);
  - «cuerda», solo como «cuerdas» (en ruedas es una soga).
- **Términos con dos sentidos que el lector resuelve por la forma más larga:**
  - «horario» (aguja corta, en cronometría) frente a «sentido horario» (ruedas) y «sentido antihorario» (ordenamiento);
  - «reflejo»: ordenamiento lo usa antes como el orden de espejo, compatible con la definición de máximos y mínimos;
  - «razón»: cronometría dice «a razón de 63 por hora», que también es un cociente.
- **«variable»** se define en diagramas-de-flujo, que es su primer uso real. Ver el pedido 2.
- **«factorial»** se define en rutas, pero `(n − 1)!` sale antes, en la ecuación de la mesa redonda de ordenamiento, sin la palabra.
- **Cuatro términos que quedaron entre bloques**, agregados después en la unidad que los estrena: condición (verdades), ecuación (arreglos), tramo (trazos) y giro (ordenamiento).

## Pedidos al molde (no se tocó `nucleo/` ni `app/`)

1. **Los retos con casos guardados se validan solo con los primeros 160 casos de la grilla**, en la que el primer control cambia más rápido. En varias mesas esos 160 casos dejan fijos los otros controles:
   - `urna-libre` siempre tiene n = 1;
   - `cuarta-recta` siempre tiene el giro en 0°;
   - en `eje-libre` el eje siempre empieza en 0.

   Por eso hubo que cambiar o quitar comparaciones buenas, como en `precio-libre` y en «mismas ventas, distinto piso del eje». Propuesta: tomar los pares de una muestra repartida por toda la grilla.
2. **`grosor: 'variable'`** (un dato de las líneas en deductivo) entra en `G.texto()`, y hace que «variable» figure como aparecida en deductivo. Propuesta: agregar `grosor` a `NO_TEXTO` en `nucleo/glosario.js`.
3. **`G.texto` no recorre lo que se genera** (`ahoraTu.generar`, `lectura`). Un término que solo sale en una pregunta generada no cuenta como presente, así que hubo que llevarlo al texto fijo. Le pasó a «mínimo de movimientos», «sucesión» y «semejante».
4. **En mesas con más de 20 000 casos, el validador mira una muestra.** En `arma-la-pila` (4⁹ casos) el reto «9 cubitos o menos» no aparecía en la muestra, y su tope se subió a 12; el `bien` pregunta por el mínimo de verdad.
5. **La forma «algún» de «algunos»** marca también un rótulo de juegos-recreativos («en algún orden»). La definición vale igual, pero es un falso positivo leve.

## Recorrido en el navegador (Playwright, 360 × 780, `npm run dev`)

Con un alumno guardado en `lab-v1` (unmsm, 4.º y la prueba de entrada de las 19 unidades), el script recorrió las 19 unidades:

- **La hoja del glosario:** se tocó el primer término subrayado visible de la primera idea. Abre bien, con «Nuevo en este tema», el ejemplo y «Ver también». En 10 unidades, la pantalla «Juega» de la primera idea no tiene ningún término visible, así que ahí no se abrió la hoja.
- **El glosario del tema:** se abrió `#/unidad/<id>/teoria/glosario` y se buscaron las primeras letras de un término; en las 19 unidades lo encuentra. La sección «Vienen de otros temas» dice «Lo viste en…».
- **El laboratorio:** en la primera mesa se eligió el primer reto de un argumento y se movieron los controles reales hasta valores que el propio `logrado` da por buenos. Las 19 unidades muestran «✓ Lo lograste» y la línea `bien` de Faro.
- **Errores de página:** ninguno.
- **Capturas:** la hoja de deductivo, el reto logrado de ruedas y el glosario de certezas se miraron a ojo.

## No verificado

- No se cumplieron en el navegador los retos con casos guardados ni los de las otras mesas: el validador solo comprueba que se puedan lograr.
- No se probó en un celular real, con un lector de pantalla ni con alumnos.
- Los ejemplos del glosario se comprobaron a mano o con node, unidad por unidad. Algunos de esos cálculos:
  - 8:20 da 130°; MCM(6, 8) = 24; 1 + … + 12 = 78;
  - 136/4 = 34; T(4) = 15;
  - 3!/2! = 3; el dodecaedro tiene 20 vértices y 30 aristas;
  - con el operador 2a + b, 2 ∗ 5 = 9 y 5 ∗ 2 = 12;
  - 1000 = 20·50 = 25·40;
  - 3S = 21 + 15 da S = 12.
- Nadie revisó a ciegas las definiciones: las escribió cada subagente y yo leí solo una parte.
