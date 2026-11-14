# Reporte: teoría de Aritmética, ronda 2 (14 nov 2026, noche)

Encargo: `rutinas/encargos/teoria2-aritmetica.md`. Rama: `teoria2/aritmetica`, que sale de `claude/awesome-einstein-ch5g9a`. No se integró a `main`.

**Qué se pidió.** Gerson vio la teoría y pidió cinco cosas:
- arrastrar la figura;
- tipografía cuidada;
- llaves bajo las ecuaciones;
- zoom;
- más laboratorio.

El molde ya traía el zoom y las llaves. Faltaba aplicarlas a las 19 unidades, ponerles arrastres y armar su laboratorio.

## Cómo se hizo

1. **La sesión principal** preparó lo común:
   - agregó a las piezas de aritmética lo que les faltaba de geometría para ubicar las manijas;
   - escribió `herramientas/revisar-teoria.js`, que arrastra con el mouse cada manija de cada idea y de cada mesa a 360 × 780, guarda 2 casos por mesa y deja capturas;
   - hizo `porcentajes` como unidad modelo.
2. **Cuatro sesiones hijas** hicieron las otras 18 unidades, cada una en su worktree y con un commit por unidad.
3. **La sesión principal** integró esos commits con cherry-pick. En cada integración:
   - regeneró el catálogo y corrió el validador y las pruebas de piezas;
   - volvió a pasar el revisor por cada unidad;
   - miró capturas;
   - corrió `npm test` completo al final.

## Arrastres: 64 de 94 ideas

Todas las unidades tienen al menos una idea con arrastre.

| Unidad | Con arrastre | Sin arrastre y por qué |
| --- | --- | --- |
| porcentajes | 5/5 | — |
| razones-y-proporciones | 4/4 | — |
| magnitudes-proporcionales | 4/4 | — |
| mezclas-y-aleaciones | 4/4 | — |
| estadistica | 5/6 | Frecuencias: es una tabla de conteo, no un lugar |
| interes-y-descuento | 4/5 | Tasas: entre m = 4 y m = 365 la tira cambia pocos px; el gesto sería elegir m de una lista |
| sucesiones-y-series | 4/5 | Diferencias: a, b y c son coeficientes de una tabla, no objetos |
| cuatro-operaciones | 4/6 | Otras bases y cifras del producto: tablas de registro |
| potenciacion-y-radicacion | 3/4 | Exponentes: se eligen de una tabla |
| logica-proposicional | 3/5 | Tautología y De Morgan: la variable es una fórmula elegida de una lista |
| conjuntos | 3/5 | Pertenencia: el criterio es texto · Conteo: los aros no codifican cantidades (fidelidad de `arit-venn`) |
| divisibilidad | 3/5 | Criterios y diofánticas: tablas de cuentas |
| numeros-primos-y-divisores | 3/6 | Rectángulos: al cambiar n se rearman todos (el gesto pasó a la mesa «Filas de c») · Factorización: es un procedimiento · Fermat y Wilson: p se elige de una lista |
| mcd-y-mcm | 3/5 | MCD por MCM: a y b de listas · Fracción continua: registro de divisiones |
| analisis-combinatorio | 3/5 | La palabra se elige de una lista · C(n, r) es el resultado, no una variable |
| razonamiento-numerico | 3/6 | Regresivo, criptoaritmética y suficiencia: tablas o elección de opciones |
| numeracion | 2/4 | Descomposición y cambio de base: tablas de cuentas; la base no es una posición |
| numeros-racionales | 2/5 | Exacto o periódico, generatriz y otras bases: tablas de la división |
| probabilidades | 2/5 | Unión y condicional: el evento se elige de una lista · Esperanza: el premio es un número escrito |

**Patrón:** casi todas las ideas sin arrastre son las que eligen un caso de una lista, como una fórmula, un evento o una palabra. Ahí el gesto natural es tocar para elegir, y el molde no lo tiene (ver los pedidos).

Algunas decisiones de diseño que vale la pena conocer:
- **Escala fija mientras se arrastra.** Si la regla de la figura depende del valor que se mueve, la manija se dispara al máximo. Se fijó la escala en:
  - la mesa de cadena de porcentajes;
  - la serie de razones;
  - la tira geométrica (r ahora va de 1 a 3);
  - los móviles;
  - el interés compuesto (escala del quinto período);
  - el eje de estadística (0 a 14).
- **Probabilidades:** el primer dado ahora va de 6 arriba a 1 abajo. Así las sumas iguales quedan en una diagonal y el gesto hacia arriba y a la derecha sube la suma.
- **Fichas que se reacomodan** (divisibilidad): `mover` elige el valor cuya manija quedaría más cerca del dedo. Así no salta cuando cambia el tamaño de la ficha.

## Laboratorio: 54 mesas

Las 19 unidades tienen laboratorio. Las mesas marcadas con * tienen arrastre. La columna «La más rica» dice qué deja probar que los juegos de las ideas no dejan.

| Unidad | Mesas | La más rica |
| --- | --- | --- |
| porcentajes | cadena*, ganancia* | Tres cambios con signo y P₀ libre. Se guarda un caso, se cambia el orden y el final es el mismo |
| razones-y-proporciones | antes-despues*, tres-medias*, serie* | ×k y +s juntos, con el par de antes y el de después |
| magnitudes-proporcionales | tres-relaciones*, reparto-tres*, obra* | y = kx + 6: crece sin ser proporcional |
| mezclas-y-aleaciones | tres-cafes*, aspa-libre*, dos-alcoholes* | El aspa con un precio fuera del rango: la mezcla imposible |
| estadistica | cinco-datos*, cuatro-barras*, poblacion-muestra* | σ² y s² lado a lado; la moda que aparece y desaparece |
| interes-y-descuento | tres-montos*, descuento-largo*, tres-letras* | Simple, compuesto y continuo a la vez; el comercial que se come la letra |
| sucesiones-y-series | escalera-suma*, suma-sin-fin*, tiras-geometricas* | Cualquier progresión aritmética, también con d = 0, y su copia al revés |
| cuatro-operaciones | escaleras-a-z*, restos-grandes*, dos-productos* | (a + k) · b con k negativo |
| potenciacion-y-radicacion | raiz-grande*, cuatro-primos, encerrar* | Hasta 200 fichas; el primo 7 para cuadrado y cubo |
| logica-proposicional | dos-formulas*, dominio-grande* | 8 fórmulas comparadas fila por fila |
| conjuntos | tres-conjuntos*, conteo-universo, pares-orden* | Tres aros con la sonda en 8 zonas; el conteo imposible |
| divisibilidad | filas-grandes*, juntar-sobrantes*, ciclos-largos* | Bases que comparten factores con el divisor |
| numeros-primos-y-divisores | filas-de-c*, otro-primo*, criba-100* | n = 2ᵃ · qᵇ con q libre; el 11, que no tacha nada |
| mcd-y-mcm | cintas-libres*, tres-combis*, euclides* | Pares que solo comparten el 1; el encuentro fuera de la recta |
| analisis-combinatorio | casilleros-libres*, grupos-ordenes*, menu* | Más puestos que objetos (da 0); C(n, r) = C(n, n − r) |
| razonamiento-numerico | canje-libre*, persecucion*, edades-libre* | Precios iguales o al revés (la falsa suposición ya no sirve); B más rápido que A |
| numeracion | canje-amplio*, libros-largos* | Base 10 dentro del juego; libros de 1500 páginas |
| numeros-racionales | dos-tiras*, dos-puntos*, division-base | Fracciones mayores que 1; a, b y la base juntos |
| probabilidades | dados-condicion*, fabrica-libre*, ruleta | Evento y condición a la vez; la máquina que no falla |

**Las lecturas en vivo** nombran los valores que definen el caso. Así un caso guardado se entiende solo, con su miniatura y su pie.

## Llaves, separadores y tipografía

- **Llaves.** Hay llaves en las reglas de las 19 unidades y en los pasos de «Mira» donde un símbolo necesita nombre. Las notas tienen 3 palabras o menos.
- **Separadores.** Todo `' · '` o `'; '` que juntaba dos relaciones pasó a `'   ·   '`. Varias reglas largas se partían a la mitad de una expresión; se cortaron en su «=» o «⇔». Eso está comentado donde el separador corta una línea y no separa dos relaciones.
- **Espacio duro:**
  - entre número y unidad (S/, %, meses, km/h);
  - en los miles, porque `Kit.formatear` usa un espacio normal y «S/ 1 566» se partía en el caso guardado.
- **Exponentes:** ningún «^».
- **Hallazgo 9.** Hay tres ideas donde el juego y «Mira» usan dibujos distintos, y en las tres hay un comentario que explica por qué son dos representaciones:
  - sucesiones, idea 1: fichas y recta;
  - análisis combinatorio, idea 1: tabla y fichas;
  - conjuntos, operaciones: Venn y Carroll.

  Además:
  - en numeración, el conteo de cifras juega con tiras y explica con la tabla;
  - en la criba, se juega con la grilla y «Mira» usa la tabla resumen.

  En el resto se usa la misma pieza de principio a fin.

## Piezas tocadas

Todas se tocaron solo para agregar algo; lo que ya dibujaban no cambió. Cada una lleva su prueba.

| Pieza | Qué se agregó |
| --- | --- |
| `arit-fichas` | `geometria().ficha(k, i)`, `caja(k)` y `piso`; la opción `datos.arriba` (bloques que cuelgan de arriba) |
| `arit-tiras` | `geometria().centroY(k)`, `deX(px)` y `altoTira` |
| `arit-tabla` | `geometria().celda(i, j)`, `altoFila` y `cabezaY` |
| `barra-porcentaje` (común, autorizada) | Exporta `geometria` (con `barraY`, `barraH`, `piezaH`, `filaY` y `deX`) y el dato opcional `escala`, que fija la regla de la barra |

**Herramienta nueva:** `herramientas/revisar-teoria.js <puerto> <unidad> <carpeta>`. Sirve para todos los cursos.

## Pedidos al molde (no se tocaron: son de `app/` o del kit común)

1. **Tocar para elegir.** Es la mayoría de las 30 ideas sin arrastre: zonas del Venn, filas de una tabla, el evento en probabilidades, la palabra en combinatoria, m en tasas de interés. Hoy solo se arrastra un valor numérico; un toque sobre la figura que elija una opción del control resolvería esas ideas.
2. **Arrastre relativo.** Que `mover` reciba también el desplazamiento desde que empezó el gesto. En bloques apoyados abajo, la última ficha siempre está en la fila de abajo y la posición absoluta se dispara. Caso: n en «agrupar» de numeración.
3. **La lupa tapa la esquina de arriba a la derecha.** Ahí caen el encabezado de la última columna de las tablas (2⁴ en divisores, «mayor», «corte», la columna 6 de los dados) y algunas manijas. Pedido: reservar esa zona o mover el botón.
4. **La «×» de los casos guardados** se monta sobre el encabezado de la tabla en la miniatura.
5. **Valor del control.** Con unidades largas («3 meses», «200 fichas», «100 km/h») el valor se sale de la tarjeta (`.te-control output`, 44 px, en `app/estilos.css`).
6. **Figura fija alta.** Una figura de más de unos 330 px deja «Guardar este caso» fuera de alcance; la tabla de una mesa se bajó a 9 filas por eso. Además, la figura fija tapa en parte la pista «Arrastra los círculos», y las figuras bajas dejan una banda vacía (hallazgo 10).
7. **Desborde horizontal.** La ficha de repaso y la fila de chips ensanchan la página a 670–936 px contra 360. Pasa también en la unidad de referencia de física.
8. **`Kit.formatear`** separa los miles con espacio normal. Convendría el espacio duro en el kit, para todos los cursos.
9. **Notas de llave.** Bajo una sola letra, la nota se parte en dos líneas (D = F d t). Convendría dejarla más ancha que su llave.
10. **`recta`.** El nombre de la variable arriba a la izquierda («minutos», «valor») choca con los rótulos de los puntos.

## No verificado

- El celular real, el lector de pantalla, el tema oscuro y alumnos reales.
- **Cómo se siente el arrastre con un dedo.** Las manijas de celda más cercana avanzan a saltos: criba, φ, esquina de la tabla de divisores y la fila de la lógica.
- **Los momentos Predice, Mira y Ahora tú de las ideas tocadas.** Pasan el validador con 60 semillas; a la vista solo se revisaron a través de la ficha de repaso.
- **El pedazo chico en porcentajes.** En «El segundo muerde lo que quedó», con un descuento chico (5 %), la manija del primer corte tapa parte de su rótulo.
- **El techo de la mesa «Tres cambios seguidos».** Si el final pasa de 2 · P₀, ese pedazo ya no avanza con el dedo; queda − y +.
- **Servidores de las sesiones hermanas.** Una hija ejecutó `pkill -f herramientas/servidor.js` al terminar y pudo cortar el servidor de desarrollo de otras sesiones paralelas en esta máquina.

## Reporte de diseño

```
Ficha de tarea: el postulante de 3.º a 5.º, en un celular de 360 px, agarra la cosa que cambia (el corte, el
  final de la tira, la ficha, el punto) y ve responder la variable; en el laboratorio prueba el caso raro y
  guarda casos para comparar.
Sistema: existente (tokens de app/estilos.css, kit de piezas, colores de variable). Decisiones nuevas escritas
  en las piezas y en este reporte: escala fija mientras se arrastra, manija en el lugar del valor (validado),
  espacio duro en miles y unidades, separador '   ·   ' también como corte de línea comentado.
Carácter: acogedora, viva y precisa · firma: el hilo de color, ahora también en la manija (color de su variable;
  sin color cuando mueve dos variables, como la fila de la lógica).
Movimientos: arrastre — gesto — sigue al dedo 1:1, sin curva; el lector ajusta al paso al soltar — recorrido
  el de la figura — con movimiento reducido igual (no hay traslado animado). Nada nuevo animado en el contenido.
Verificación: validador de nucleo/teoria.js (manija dentro de la figura, en su valor, sobre controles reales) en
  las 19 unidades; revisar-teoria.js arrastró con el mouse las manijas de las 94 ideas y las 54 mesas: ninguna
  sin mover, sin errores de página; capturas a 360 px miradas por unidad; npm test completo en verde.
  Zona de toque de 44 px: la da el lector. Toda manija tiene − y + como alternativa (lo exige el validador).
No verificado: celular real, dedo real, lector de pantalla, tema oscuro, alumnos.
Hipótesis: agarrar el objeto en vez del deslizador sube los casos distintos probados por idea y baja el tiempo
  de «Juega»; se mide con los eventos teoria (momento juego) antes y después de esta ronda.
Conflictos: ninguno con CLAUDE.md. Con el skill: las manijas de celda más cercana no siguen al dedo 1:1 (saltan
  entre celdas); es la naturaleza de un valor entero en una tabla, declarado arriba.
```
