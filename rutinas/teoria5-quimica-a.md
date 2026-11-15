# Ronda 5: química animada, parte A (15 nov 2026, noche)

Rama `teoria5/quimica-a`. Encargo: `rutinas/encargos/teoria5-quimica-a.md`. Molde: `docs/3d.md` §6 y `fisica/oscilaciones.js`.

**Resultado:** las 10 unidades quedan animadas.
- Las **49 ideas** se mueven solas al abrir.
- La **primera mesa** de cada laboratorio también (tres son 3D).
- **Ninguna idea quedó sin animar.**
- No se cambiaron:
  - las preguntas de «Predice» ni sus correctas;
  - «Mira», «La regla» ni «Ahora tú»;
  - los `id` de mesas ni de controles.

## Cómo se comprobó

- **Pruebas:**
  - `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` en verde después de cada unidad;
  - `npm test` completo antes del último push.
- **Prueba nueva, `contenido/teoria/animacion-quimica-a.test.js`:**
  - recorre cada control animado en 61 instantes, también entre pasos (el lector no ajusta al paso mientras corre);
  - exige dibujo sano, alt, lectura de 12 palabras o menos que cambia en el recorrido y manijas finitas;
  - exige que cada idea y la primera mesa tengan su control animado.
- **Recorrido en Playwright a 360 × 780, con swiftshader** (`rutinas/teoria5-quimica-a/pw-anima.js <unidades>`), con un alumno `unmsm`, 5.º en `lab-v1`:
  - en cada idea y en la primera mesa, la lectura cambia sola: cinco lecturas cada 700 ms, y basta un cambio entre dos seguidas. Las ideas que se arman y quedan completas un rato pueden caer en esa pausa final;
  - «⏸ Pausa» congela la lectura;
  - con `reducedMotion: 'reduce'` arranca quieta, con «▶ Seguir»;
  - sin errores de consola.
  - Resultado: 10 de 10 unidades, «todo bien». Capturas revisadas.
- **Mesas 3D** (`rutinas/teoria5-quimica-a/pw-mover3d.js`): envuelve `construir` y `mover`. En 3 s de animación:
  - `construir` se llamó 0 veces y `mover`, unas 90 (30 por segundo), en las tres mesas;
  - la escena no se rearma.
- **Casos que no son los de inicio** (`rutinas/teoria5-quimica-a/ver-svg.js`): pinta varios cuadros de un juego en una captura. Se miraron:
  - H₂O, NH₃, BF₃ y CO₂ en el campo;
  - las fuerzas intermoleculares;
  - Al₂(SO₄)₃ armándose;
  - el árbol del azufre;
  - la glucosa llenando su barra;
  - los saltos redox del Mg;
  - el limitante con 7 H₂ y 4 O₂.

## Por unidad e idea: qué se anima y con qué control

`auto` va con `modo: 'rebota'` salvo que diga «repite». **«t nuevo»** es un control de tiempo agregado a una idea que solo tenía opciones. Los conteos (Z, neutrones, fichas, moles en su paso) se leen enteros mientras corre (`Math.round` o el paso del control), porque el lector entrega valores intermedios.

### quimica.materia-y-energia
1. **Sustancia o mezcla.** t nuevo (0–8 s, repite). Las partículas se mueven en cámara lenta: el oxígeno vuela; el agua y lo disuelto se deslizan; el agua y el aceite, cada uno en su capa.
2. **¿Qué partícula cambia?** t nuevo. Cada caja se mueve según su estado: el hielo vibra, el agua se desliza, el vapor y los gases vuelan; en «disolver sal», la sal queda quieta en el fondo.
3. **Calor sensible y latente.** `q` (repite, 0,8 kJ/s). El punto recorre la curva y la curva se traza hasta Q; lo que falta queda punteado.
4. **Masa y energía.** `mg` (rebota). El punto sube por la recta y la lectura da Δm y E.
- **Mesa «Del hielo al vapor».** `q` (repite). El punto recorre las dos mesetas y la curva se traza.

### quimica.estructura-atomica
1. **El núcleo decide el elemento.** `n`, los neutrones (rebota): isótopos; el nombre no cambia y A sí.
2. **Modelos atómicos.** t nuevo (repite). La cadena se lee sola: evidencia, modelo, límite; lo que aún no se lee queda tenue.
3. **Números cuánticos.** `n` (rebota). Aparecen y se van los subniveles; con l ≥ n dice «no existe».
4. **Configuración.** `z` (rebota, 1,5 por s). Los electrones entran uno por uno hasta el calcio; se ve el 4s antes del 3d.
5. **Desapareados.** t nuevo. Los electrones de valencia entran uno por uno y llenan las cajas como dice Hund; la lectura cuenta los desapareados de cada momento. Al final coinciden con la tabla de la unidad: N 3, O 2, F 1, Ne 0, Fe²⁺ 4.
- **Mesa 3D «La nube del orbital».** Control nuevo `t` (0–8 s, repite, inicio 8). La nube se arma medida a medida: 4 % a 100 % de los puntos del motor, que salen en orden de azar. La lectura cuenta los puntos.

### quimica.tabla-periodica
1. **Periodos, grupos, bloques.** `z` (repite). La casilla recorre la tabla.
2. **Ubicación y Lewis.** `z` (rebota). El símbolo de Lewis cambia con Z.
3. **Radio.** t nuevo. Un marco baja por el grupo y la lectura da el radio y el periodo de cada elemento.
4. **Energía de ionización.** t nuevo. Un marco recorre el periodo; la lectura da EI y si sube o baja desde el anterior (salen solas las excepciones).
5. **Electronegatividad.** t nuevo. Otro marco recorre el periodo 2 y baja por el grupo 17 (las dos tendencias); el par elegido y su ΔEN siguen marcados.
- **Mesa «Un elemento, tres propiedades».** `z` (repite). La casilla recorre la tabla con r, EI y EN.

### quimica.enlace-quimico
1. **Tres enlaces.** t nuevo. Los iones, los cationes y las moléculas de hielo vibran en su sitio; los electrones del cobre vuelan entre los cationes (el mar de electrones).
2. **Lewis y octeto.** t nuevo (inicio en el final). Los electrones se colocan solos, de a dos: enlaces y después pares; la lectura cuenta «colocados x de Nval». Lo que falta se oculta con `desde` (no se quita), para que el encuadre no salte.
3. **Resonancia.** t nuevo. Lo mismo, contar los 24 e⁻ en el dibujo elegido. **El doble enlace no se mueve solo, a propósito:** el error que la predicción vigila es EN6, «el doble salta de un O a otro». Animarlo saltando enseñaría ese error.
4. **Forma y polaridad.** t nuevo. La molécula entra inclinada 50° y al segundo se enciende un campo eléctrico (flecha de + a −). La polar gira hasta alinear su extremo δ− con la placa +; la apolar no gira.
   - El giro es un acercamiento exponencial **cualitativo**: lo dice el comentario del código.
   - Los datos (forma, μ) siguen saliendo de GEOM.
5. **Fuerzas intermoleculares.** Control nuevo `T` (−180 a 120 °C, rebota). Bajo su ebullición, las dos moléculas siguen unidas; al pasarla, la segunda se aleja y la línea punteada desaparece. La lectura dice «siguen unidas» o «ya pasó Tₑ, se separan», sin nombrar estados, que serían falsos para el agua a −150 °C.
- **Mesa 3D «La molécula que gira».** Control nuevo `giro` (0–360°, repite, 30°/s). La molécula gira sola; la lectura muestra que forma, hibridación y polaridad no cambian al girar.

### quimica.nomenclatura-inorganica
1. **Estados de oxidación.** `w`, ω (rebota). La suma pasa por la carga (✓); se puede pausar justo ahí.
2. **Tres nombres.** t nuevo. Sistemática, Stock y tradicional se leen uno por uno.
3. **Árbol de funciones.** t nuevo. El árbol se arma por pasos: elemento + O₂, óxido, + H₂O, oxácido o hidróxido, y el camino con H₂ (`corte` + 0,5, ver pedidos).
4. **Sales.** t nuevo. Las fichas entran enteras, una a una: catión si la neta es ≤ 0, anión si es > 0, hasta quedar neutra. Cada cuadro da la fórmula y la carga neta.
5. **Sales ácidas, básicas, hidratadas.** t nuevo. Las fichas entran de a una con la carga neta de cada momento.
- **Mesa «La sal armada a mano».** `na` (rebota). Las fichas de anión suben y bajan; se pausa cuando no queda carga suelta.

### quimica.mol-y-composicion
1. **Masa atómica promedio.** `p`, % de cloro-35 (rebota). La lupa y el promedio cambian juntos.
2. **Mol y masa molar.** `n` (rebota). La balanza pesa 0,5 a 3 mol.
3. **Relaciones en la fórmula.** `u`, moléculas (rebota). Cambia la cuenta de átomos.
4. **Composición.** t nuevo. La barra se llena elemento por elemento; lo que falta es un tramo **tenue**, dato nuevo de `quim-composicion`.
5. **Leyes ponderales.** `g` (rebota). Crecen los dos tramos y la razón O : H = 8 : 1 no cambia.
- **Mesa «Dos isótopos en una barra».** `p` (rebota). El borde corre y el promedio sigue.

### quimica.reacciones-y-balance
1. **Indicios.** t nuevo. Las partículas de antes y después se mueven según su recipiente; el precipitado vibra en el fondo.
2. **Clasificar.** t nuevo. Las partículas vuelan en las dos cajas.
3. **Tanteo.** `b`, H₂O (rebota). El H se iguala en b = 2; el O₂ lo pone el alumno.
4. **Oxida y reduce.** t nuevo. En la recta se dibuja primero el salto del que se oxida, después el del que se reduce, y quedan los dos, con su lectura en cada paso.
5. **Ion-electrón.** `n`, e⁻ (rebota). La carga de la izquierda baja hasta +2 (✓).
- **Mesa «El metano con todo».** `b`, O₂ (rebota).

### quimica.estequiometria
1. **Vía de los moles.** `k`, N₂ (rebota). La receta crece y baja.
2. **Reactivo limitante.** t nuevo (inicio en el final). La reacción 2 H₂ + O₂ → 2 H₂O ocurre paquete por paquete:
   - a la derecha, la mezcla del momento; la lectura dice «Paquete p de P · quedan…»;
   - al final, la figura de siempre: agua y sobrantes con aro.
3. **Pureza y rendimiento.** `p`, pureza (rebota), leída en su paso de 10 %. Las manijas siguen a la pureza dibujada.
4. **Masa equivalente.** t nuevo. Los H⁺ u OH⁻ se van de a uno, con la carga que queda; al final, θ y la masa equivalente.
- **Mesa «Dos recetas, un limitante».** `y`, segundo reactivo (rebota).

### quimica.gases
1. **Una condición.** `v` (rebota, continuo). El émbolo sube y baja y P responde; PV queda fijo.
2. **Ecuación de estado.** `p` (rebota, continuo). El émbolo busca V = RT/P.
3. **Presiones parciales.** `a`, N₂ (rebota). Cambian su presión parcial y la total.
4. **Graham.** Control nuevo `M` (2–48 g/mol, rebota). Un punto recorre la curva; el gas elegido queda marcado.
5. **Gas de reacción.** `z`, Zn (rebota, en pasos de 6,5 g). La cadena gramos, moles, receta, litros se recalcula.
- **Mesa «El cilindro con todo».** `v` (rebota, continuo).

### quimica.liquidos-y-solidos
1. **Orden y libertad.** t nuevo (id `s`). Los dos sólidos vibran en su sitio, el líquido se desliza y el gas vuela.
2. **Capilaridad.** `r` (rebota, continuo). El punto recorre la curva h = k/r.
3. **Presión de vapor.** `p` externa (rebota, continuo). El corte con la curva da la temperatura de ebullición.
4. **Diagrama de fases.** `p` (rebota) a la T elegida. **Cambió el `inicio` de T, de −90 a −20 °C:**
   - a −20 °C, la animación cruza de gas a líquido cerca de 20 atm;
   - partiendo de −90 °C a 1 atm, habría barrido justo la sublimación de −78 °C, que es lo que pregunta «Predice».
5. **Gas húmedo.** `v`, vapor (rebota). Pasa de HR % a «satura, n se condensan».
- **Mesa 3D «La celda que se repite».** Control nuevo `giro` (0–360°, repite). La celda o el bloque giran solos con sus rótulos.

## Piezas tocadas

Todas reciben solo datos opcionales: sin ellos dibujan igual que antes, y cada una tiene su prueba nueva.

| Pieza | Qué se agregó | Animación |
| --- | --- | --- |
| `quim-orbital-3d` | `medidas` (cuántos puntos de la muestra se ven) | `forma` sin las medidas; `mover` cambia `setDrawRange` de los puntos (`contar` busca cuántos índices de cada signo quedan) |
| `quim-molecula-3d` | `giro` | Todo va en un pivote; `mover` gira el pivote y lleva los rótulos con `h.moverEtiqueta`; el respaldo plano suma el giro a la vista |
| `quim-red-3d` | `giro` | Igual que `quim-molecula-3d` |
| `quim-composicion` | `tenue` en un tramo | Sin relleno y punteado: lo que falta de la barra |

**Para la sesión `teoria5/quimica-b`:**
- Si toca estas mismas piezas, puede haber choque al integrar, aunque los cambios son solo agregados.
- **No se tocó `quim-particulas`.** El movimiento de partículas se calcula en cada unidad y se pasa con las `x, y` fijas que la pieza ya admitía.

## Lo que no se animó y por qué

**Nada quedó sin animar.** Dos decisiones de contenido:
- **Resonancia:** no hay un doble enlace que salte (error EN6); lo animado es el conteo de electrones.
- **Diagrama de fases:** se cambió el inicio de T, para no mostrar sola la respuesta de «Predice».

## Pedidos a la base o a la app

1. **Ajustar al paso al pausar.**
   - Al pausar (botón o tocando otro control), el valor animado queda entre pasos (por ejemplo, q = 4,73).
   - Los retos se evalúan con ese valor cuando el alumno toca otro control: un reto como «el menor calor…» puede darse por logrado con un valor intermedio y otros como `mg === 1000` no.
   - Pedido: que `pausar` aplique `T.ajustar` al control animado.
2. **Girar el lienzo 3D no pausa la animación.**
   - En las mesas que giran solas, el giro del dedo (de `vivo3d`) se suma al automático.
   - Pedido: un aviso de `vivo3d` al empezar a arrastrar, para que `montarJuego` llame a `anim.pausar()`.
3. **Un solo control animado por juego.**
   - En gases habría querido que el émbolo bajara y las partículas siguieran volando a la vez.
   - Pedido: un reloj de animación aparte, `valores.reloj`, que no sea control ni cuente como caso.
4. **La clase de «lo nuevo» en el juego.**
   - Si la figura del juego conservara `.kit-anima` de «Mira», lo que aparece en un paso volvería a empezar su animación en cada cuadro.
   - Por eso aquí se usa `corte = paso + 0,5` (árbol de funciones, saltos redox) o se oculta con `desde: 99` (Lewis, campo eléctrico).
   - Pedido: que `montarJuego` quite `.kit-anima`, o un `estado.sinAparecer` común.
5. **El movimiento de partículas está repetido en cinco unidades** (materia, enlace, reacciones, líquidos y sólidos con un mismo `mover`).
   - Convendría llevarlo a `quim-particulas` como dato opcional (`mueve: { t, modo }`), o a un módulo `nucleo/particulas-mov.js` con prueba.
   - No se hizo porque la otra sesión de química usa la misma pieza en paralelo.

## Lo no verificado

- **El rendimiento en el Redmi 15C de Gerson:**
  - las ideas 2D se repintan unas 30 veces por segundo con `innerHTML`; las lupas tienen hasta 35 partículas;
  - la emulación aquí no mide eso.
- **El lector de pantalla** con la animación corriendo y al pausar. El lector apaga `aria-live` mientras corre; no se probó con TalkBack.
- **Sin conexión.** No se agregaron archivos nuevos que el service worker deba guardar: solo cambiaron archivos que ya estaban en `requiere`.
- **«Muéstrame» y la miniatura de la colección** en las mesas 3D con el control nuevo. El validador sí comprueba en Node todos los retos en la grilla, ya con `t` o `giro`.
- **El recorrido en el navegador** cubre la opción de inicio de cada idea. Las demás opciones se miraron como SVG en `ver-svg.js` (las listadas arriba) y en la prueba de Node, no todas en el navegador.
- **Las capturas de casos guardados de antes** (sin `t` ni `giro`): el código los trata (nube entera, giro 0), pero no se probó con una colección real.
