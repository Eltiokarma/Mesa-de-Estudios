# Reporte: teoría interactiva de Trigonometría (14 nov 2026)

Sesión paralela «teoría de trigonometría», según `rutinas/encargos/teoria-trigonometria.md`. Rama `teoria/trigonometria`, que sale de `claude/awesome-einstein-ch5g9a`. No se integró a `main`.

**Cómo se hizo.** La sesión principal escribió la pieza `trig-plano` y la unidad 1, `angulo-trigonometrico`, que quedó como modelo del curso. Las otras 18 unidades las escribieron cinco subagentes en paralelo, con un brief común: el contrato, la unidad modelo, las fuentes, las reglas y el método de verificación. La sesión principal revisó cada unidad antes de su commit: validador, capturas y correcciones (por ejemplo, el «·» que se leía como producto en dos lecturas de la circunferencia trigonométrica). Hay un commit por unidad y un push después de cada uno.

Los reportes detallados de cada unidad, con lo que se vio y se corrigió en las capturas, están en `rutinas/teoria-trigonometria-unidades.md`.

## 1. Unidades hechas

Las 19 unidades del catálogo están en estado `completa`: tienen todos sus temas cubiertos y pasan `teoria.test.js` con 60 semillas. Suman 86 ideas, cada una con sus cinco momentos.

Todas se recorrieron con Playwright a 360 × 780, en tema claro y en tema oscuro, sin errores en la consola. Se revisaron las capturas por momento: jugado, revelación, fin de «Mira», regla y solución de «Ahora tú».

| Grado | Unidad | Ideas | Títulos | Piezas |
| --- | --- | --- | --- | --- |
| 3.º | angulo-trigonometrico | 4 | El sentido es el signo · Una vuelta, tres escalas · Un radián: un radio de arco · Minutos no son décimas | trig-plano, recta |
| 3.º | longitud-de-arco-y-sector | 5 | El arco cuenta radios · El área lleva dos radios · Sector grande menos sector chico · La rueda gira lo que avanza · Mismo borde o mismo ángulo | trig-plano |
| 3.º | razones-trigonometricas-agudas | 4 | Una razón es un cociente · Medio cuadrado, medio equilátero · 37° es un redondeo · Complementarias y recíprocas | triangulo |
| 3.º | triangulos-rectangulos | 3 | Un lado y un ángulo bastan · Desde la horizontal del ojo · Lo que abarca la mirada | triangulo |
| 4.º | recta-en-el-plano | 6 | La distancia es una hipotenusa · Promedio con pesos cruzados · Caja menos esquinas · Lo que sube por paso · Tres ecuaciones, una recta · Paralelas, perpendiculares y distancia | trig-plano |
| 4.º | angulos-en-posicion-normal | 4 | Las razones salen de P · El signo sale de x, y · Cero no es «no definida» · Vueltas iguales, giros reflejados | trig-plano |
| 4.º | reduccion-al-primer-cuadrante | 4 | Mismo tamaño, otro signo · Un cuarto de vuelta intercambia · Primero se quitan las vueltas · Suplementarios y de una vuelta | trig-plano |
| 4.º | circunferencia-trigonometrica | 5 | Cada número es un arco · Seno y coseno con signo · Tangente y cotangente: dos rectas · Secante y cosecante: los cortes · Crecer es subir con signo | trig-plano |
| 4.º | identidades-fundamentales | 4 | Pitágoras dentro de la circunferencia · Recíprocas y cocientes, con dominio · Al cuadrado aparece el doble · Demostrar no es probar valores | trig-plano, ejes |
| 5.º | arcos-compuestos | 4 | El seno no se reparte · La tangente y su denominador · Dos ondas, una sola cresta · Tres ángulos que suman 180° | trig-plano, ejes, triangulo |
| 5.º | arcos-multiples | 4 | El doble del ángulo · Bajar la potencia · El signo de la mitad · El triple y su cubo | trig-plano, ejes |
| 5.º | transformaciones-trigonometricas | 4 | Dos flechas, un rombo · Un producto, dos ondas · Una cadena de flechas · Doblar y doblar | trig-plano, ejes |
| 5.º | funciones-trigonometricas | 5 | La altura, desenrollada · Alto y ancho de la onda · Ramas entre asíntotas · Copas fuera de la franja · El periodo depende de la función | trig-onda |
| 5.º | funciones-trigonometricas-inversas | 5 | Una inversa elige una rama · Cada inversa, su rama · Componer sin cancelar a ciegas · La gráfica se refleja · arccot, arcsec y arccsc | trig-plano |
| 5.º | ecuaciones-trigonometricas | 5 | Cuántas veces corta la recta · La calculadora da un valor · Los extremos del intervalo cuentan · Factorizar, no dividir · Un sistema pide ambas | trig-plano, ejes |
| 5.º | triangulos-oblicuangulos | 5 | Cada lado con su seno · Dos triángulos, mismos datos · Pitágoras con corrección · La base, suma de dos sombras · Rumbo: desde norte o sur | trig-plano, triangulo |
| 5.º | areas-y-lineas-notables | 5 | El área sigue al seno · Herón: solo con los lados · Tres radios, una misma área · El largo de una ceviana · Un cuadrilátero, dos diagonales | trig-plano |
| 5.º | conicas | 5 | Un lugar: PF = PD · La cuerda del jardinero · La diferencia que no cambia · Tocar una sola vez · Girar los ejes, no la curva | trig-plano |
| 5.º | coordenadas-polares-y-complejos | 5 | Un punto, muchos nombres · El cuadrante decide el argumento · Multiplicar es girar y estirar · De Moivre: potencias que giran · La forma exponencial | trig-plano |

### Las seis precisiones del expediente, dónde quedaron

1. **La reducción puede cambiar a cofunción:** `reduccion-al-primer-cuadrante`, idea «Un cuarto de vuelta intercambia».
2. **sen = ±1 tiene una sola solución por vuelta y |k| > 1 no tiene ninguna:** `ecuaciones-trigonometricas`, idea «Cuántas veces corta la recta», que sigue el microguion 15.
3. **El periodo depende de la función y de su transformación:** `funciones-trigonometricas`, idea «El periodo depende de la función».
4. **37°/53° y 16°/74° son aproximaciones:** `razones-trigonometricas-agudas`, idea «37° es un redondeo».
5. **Una inversa exige una rama:** `funciones-trigonometricas-inversas`, ideas 1 a 3.
6. **La resultante de dos flechas unitarias puede invertir la dirección de la semisuma:** `transformaciones-trigonometricas`, idea «Dos flechas, un rombo». Con A = 20° y B = 280°, la resultante apunta a 330°.

## 2. Piezas nuevas del kit

- **`nucleo/kit/piezas/trig-plano.js`** (y su `.test.js`, 5 pruebas). Es el plano de trigonometría a una sola escala:
  - ejes con cuadrícula opcional y circunferencias;
  - rayos con punta;
  - arcos firmados con flecha, en espiral si dan más de una vuelta;
  - sectores y trapecios circulares;
  - segmentos rotulados, rectas `y = k` y `x = k`, curvas muestreadas, puntos y rótulos.

  **Afirmación:** «el ángulo es un giro que se ve; el arco con flecha dice el sentido y las vueltas, y cada largo se mide con la misma escala que el radio». La usan 16 de las 19 unidades. Se revisó a 360 px en color y en grises.
- **`nucleo/kit/piezas/trig-onda.js`** (y su `.test.js`, 7 pruebas). Gráficas trigonométricas con el eje x en múltiplos de π, asíntotas, la llave del periodo, franjas y puntos. **Afirmación:** «el periodo es un largo sobre el eje x, medido con las marcas de π; la misma forma se repite cada T». La usa `funciones-trigonometricas`.

## 3. Pedidos al molde, con el caso que los pide

**App (`app/teoria.js`, no se tocó):**
1. **Ruta de la idea.** `vista()` lee `location.hash.split('/')[3]`, que siempre es `'teoria'`. Por eso `#/unidad/<id>/teoria/<idea>` abre la primera idea pendiente y no la pedida, y lo mismo pasa con `…/teoria/ficha`. El índice correcto es el 4. Afecta a todos los cursos. Se encontró al recorrer `angulo-trigonometrico`.
2. **«Vale si si…».** La pantalla antepone «Vale si» a la condición; una condición que empieza por «si» se lee doble. Se evitó en este curso; puede pasar en otros.
3. **Hueco sin figura.** Cuando «Ahora tú» no trae dibujo, queda un hueco alto arriba. Casos: `longitud-de-arco-y-sector`, ideas 4 y 5.
4. **Respuesta manipulable.** En ecuaciones, la respuesta es un conjunto de ángulos: sería mejor marcarlo sobre la circunferencia que elegir listas entre opciones. Caso: `ecuaciones-trigonometricas`.
5. **Control en múltiplos de π.** Hoy el juego mueve x en grados y la lectura lo traduce («x = 150° = 5π/6»). Caso: `funciones-trigonometricas`.
6. **Control 2D.** Tocar un punto de la cuadrícula haría más natural el lugar geométrico. Caso: `conicas`, idea 1, que hoy usa dos controles, x e y.

**`nucleo/ecuacion.js`:**

7. Una `raiz` que contiene una `frac` dibuja la barra del radical sobre el numerador. Se escribió la fracción en línea.

**Piezas del kit:**

8. **`recta`:** si `cada` no es 1, 2, 5, 10, 20, 50 ni 100, la pieza lo sube al siguiente de su lista y rotula valores redondeados falsos: con paso 1/6 y cada 6 escribió «2» en 1,67, y con paso 0,25 y cada 4, «1» en 1,25. Se evitó con rayitas de 12′ (paso 0,2 y cada 5) en `angulo-trigonometrico`. Pedido: aceptar cualquier `cada` o rotular con los decimales reales.
9. **`trig-plano`** (pieza de este curso; queda para la integración):
   - **Recortar a la ventana.** El SVG tiene `overflow: visible` y lo que sale de la ventana se pinta encima del texto. Un `clipPath` choca con la regla «sin ids» del kit; hay que recortar en el código, segmento contra rectángulo. Casos: la secante de la circunferencia trigonométrica, el compás del caso ambiguo, la hipérbola, la circunferencia cortada en el juego de transformaciones.
   - **Lado explícito del rótulo** (`lado`) en segmentos que pasan por el origen y en rectas `x = c` e `y = k`.
   - **Cuadrícula sin números**, para que no choquen con los rótulos de coordenadas.
   - **Relleno de polígonos** (el área en `recta-en-el-plano` y en `areas-y-lineas-notables`).
   - **Rectas oblicuas** `{ m, b }` de borde a borde.
10. **`ejes`:** opción `lado` para el rótulo de un punto, porque en un mínimo choca con la curva. Caso: `arcos-compuestos`, idea 3.
11. **`triangulo`:**
    - `hasta` por elemento;
    - distancia del rótulo por lado;
    - escala fija opcional (una torre de 30 m y otra de 10 m se ven del mismo tamaño);
    - centro por grupo cuando hay dos triángulos.

**Brief y herramientas:**

12. `node --test nucleo/kit/piezas/` falla en este Node porque recibe la carpeta. Se usa `node --test nucleo/kit/piezas/*.test.js`. Lo mismo vale para `docs/teoria.md` §8, paso 5.

## 4. Códigos de error

- **Existentes reusados:**
  - TR3, TR4, TR7–TR12, TR14–TR16 y TR21–TR25, de `docs/investigacion/trigonometria-ideas-erroneas.md`;
  - IN, CP y CX, de inversas, polares y complejos;
  - AL9.
- **Nuevos, todos hipótesis de distractor sin datos de prevalencia.** Cada archivo los declara en su encabezado; la lista completa está en `rutinas/teoria-trigonometria-unidades.md`. Las familias son:
  - TRIG-*, CONV-*, RAD-*, SEX-* (ángulo);
  - ARCO-*, SEC-*, TRAP-*, VUEL-*, POL-* (arco y ruedas);
  - TRPN-*, TRRD-*, TRCT-*, TRID-* (4.º);
  - COMP-*, TANS-*, AUX-*, TRES-*, DEG-*, FUN-*, PER-*, TAN-*;
  - ECU-*, INV-*, LS-*, LC-*, LP-*, LT-*, RUMBO-*, DIST-*.

  Hay un **choque de prefijo que hay que resolver al integrar:** POL-* se usa en dos unidades con sentidos distintos. En `longitud-de-arco-y-sector` son las poleas (POL-FAJA-EJE, POL-PROPORCIONAL, POL-SENTIDO, POL-IGUAL, POL-INVERSA). En `coordenadas-polares-y-complejos` son los polares (POL-CUADRANTE, POL-ARG-FIJO, POL-REPARTE, POL-EXP-REAL, POL-SIN-I). No comparten ningún código, pero el prefijo no identifica la unidad. Propuesta: renombrar los de poleas a POLEA-*. Además, TRID-RAIZ y DEG-UNO están declarados pero ningún distractor los usa.

## 5. No verificado

- **Lo que no se probó:**
  - celular real de Gerson, lector de pantalla y otros navegadores (solo Chromium);
  - alumnos reales: los códigos nuevos son hipótesis.
- **Decisiones pendientes para Gerson:**
  - **Notación de intervalos.** Las unidades usan «[0°, 360°)», como el microguion 15, y el motor de inversas usa «⟨a; b⟩». Hay que elegir una para todo el curso.
  - **Rama de arccot.** Se declaró (0°, 180°), igual que en `plantillas/funciones-trig-inversas`. Hay que confirmar la convención del examen.
- **Lo que no entró:**
  - las raíces n-ésimas de complejos (cabría como sexta idea de polares);
  - los sistemas de dos ángulos con x + y = S;
  - la fórmula de Brahmagupta y el corte del cono, que solo aparecen en la historia.
- **Pulido visual pendiente**, menor y anotado por unidad:
  - figuras de «Mira» cargadas de rótulos en `arcos-compuestos`, idea 1;
  - el último paso de «Mira» de `areas-y-lineas-notables`, idea 3, habla de R pero la figura muestra la circunferencia inscrita;
  - la escalera de De Moivre se ve chica al lado de 16;
  - en `ecuaciones-trigonometricas`, idea 1, la figura de «Ahora tú» muestra la recta y la circunferencia, y eso adelanta la respuesta.

## 6. Reporte de diseño

```
## Reporte de diseño
Ficha de tarea: una por unidad, como comentario al inicio de cada archivo (Promesa · Persona y condiciones ·
  Resultado observable · Orden de atención · Estados · Duda que resuelve). Persona común: postulante de 3.º a 5.º,
  celular de 360 px de gama baja, con o sin conexión.
Sistema: existente (tokens del kit, escala de tiempo, colores de variable c-o, c-i, c-h, c-d). Decisiones nuevas:
  dos piezas (trig-plano, trig-onda), con su afirmación en el encabezado. El color de cada variable se declara
  en el encabezado de cada unidad; en las unidades de la circunferencia, cada razón comparte color con su
  recíproca (seno y cosecante en rojo, coseno y secante en turquesa, tangente y cotangente en verde).
Carácter: acogedora, viva y precisa (escena-viva.md) · firma: el hilo de color (control → figura → texto →
  ecuación) y, en este curso, el arco con flecha que guarda el sentido del giro.
Movimientos: los de la línea de tiempo del kit (paso 900, largo 480 trasladar, corto 200 llegar); las piezas
  nuevas solo marcan kit-nuevo / kit-aparece; con movimiento reducido, los mismos estados con fundido.
Cinco decisiones (estructura-visual-motion): escritas sobre cada una de las 86 ideas (Cambia · Permanece ·
  Progresa · Se reserva · Debe verse). La excepción reservada es siempre el caso de la predicción.
Verificación: npm test completo en verde; teoria.test.js con 60 semillas por idea; recorrido Playwright de las
  19 unidades a 360 × 780 en claro y oscuro, sin errores de consola; piezas nuevas revisadas a 360 px en color
  y en grises. Puntos en «no»: los del pulido visual de la sección 5.
No verificado: celular real, lector de pantalla, Safari/Firefox, alumnos.
Hipótesis: que jugar con el giro firmado y predecir el caso reservado reduzca los errores de signo, de
  coterminalidad y de «una sola solución». Se comprueba con los eventos de teoría (prediccion y ahora-tu,
  con su código de error) en el colegio piloto.
Conflictos: kit.css deja el SVG con overflow visible y el kit prohíbe ids, así que no se puede usar clipPath
  (pedido 9). El tope de 6 ideas alcanzó en todas las unidades; cónicas metió 7 temas en 5 ideas.
```
