# Ronda 2 de la teoría de Física: gesto, llaves, laboratorio y tipografía (14 nov 2026, noche)

Encargo: `rutinas/encargos/teoria2-fisica.md` (rama `claude/awesome-einstein-ch5g9a`). Rama de trabajo: `teoria2/fisica`.
Las 20 unidades de `contenido/teoria/fisica/` pasaron a la versión 0.2.0 con un commit por unidad.
- **Cómo se hizo.** Cuatro subagentes trabajaron en paralelo con un brief común: el encargo, `docs/teoria.md` §4b, la auditoría y la unidad de referencia. Cada uno recibió 5 unidades y sus propias piezas, para no chocar. La sesión principal revisó las capturas y subió cada unidad.
- **Pruebas.** Cada unidad pasa `problemas()` con 60 semillas y el recorrido de Playwright a 360 × 780:
  - se arrastra con el mouse cada manija de cada idea y de cada mesa;
  - en cada mesa se guardan 2 casos;
  - no hay errores de página ni desbordes.

  El script del recorrido está en el scratchpad de la sesión y no se versiona.

## 1. Gesto directo: 81 ideas con arrastre y 26 sin él (107 ideas)

| Unidad | Con arrastre | Sin arrastre | Mesas del laboratorio (✋ = con manijas) |
| --- | --- | --- | --- |
| corriente-y-circuitos | 3 de 6 | no-se-gasta, serie-paralelo, potencia-joule | Pila real con reóstato ✋ · Dos ramas, dos cursores ✋ · La recta V contra I ✋ |
| dinamica | 6 de 6 | — | Fuerza, masa y rozamiento ✋ · Ascensor hasta la caída libre ✋ · El auto en la loma ✋ |
| electrostatica | 3 de 6 | electrizacion, serie-paralelo, energia-condensador | Dos cargas cualesquiera ✋ · Campo y potencial en P ✋ · Las placas paralelas ✋ |
| estatica | 6 de 6 | — | Palanca con los dos lados libres ✋ · Caja de masa variable ✋ · El nudo y sus cuerdas ✋ |
| fisica-moderna | 4 de 6 | fotoelectrico, fotones | Dos metales, dos rectas ✋ · Lámpara, metal y brillo · Del horno a la estrella ✋ |
| fluidos | 5 de 6 | empuje | Presión total en tres vasos ✋ · Bloque de densidad libre ✋ · La prensa hidráulica ✋ |
| gravitacion | 4 de 4 | — | Dos satélites lado a lado ✋ · Elipse de cualquier forma ✋ · Atracción y distancia ✋ |
| impulso-y-choques | 2 de 5 | conservacion, elastico-inelastico, centro-masa | Golpes de dos formas ✋ · Choque frontal libre ✋ · Masas que se mueven ✋ |
| induccion-electromagnetica | 4 de 6 | lenz, transformador | Rieles con todo suelto ✋ · La espira que gira ✋ · Subidas de flujo ✋ |
| magnetismo | 4 de 5 | fuerza-cable | El cable que gira ✋ · Dos corrientes distintas ✋ · La brújula junto al cable ✋ |
| magnitudes-y-vectores | 3 de 5 | unidades, homogeneidad | Dos flechas sin amarras ✋ · Componentes y unitario ✋ · Sombra y área a la vez ✋ |
| movimiento-parabolico-y-circular | 3 de 4 | dos-aceleraciones | Tiro con cualquier ángulo ✋ · El arco de la rueda ✋ · Rapidez fija, flecha que gira ✋ |
| movimiento-rectilineo | 5 de 5 | — | Pista con acelerador · Ida y vuelta en v–t ✋ · La recta v–t ✋ · Encuentro con brecha libre ✋ |
| ondas-electromagneticas | 3 de 4 | todas-a-c | Recorre todo el espectro ✋ · Ondas largas y cortas ✋ · Luz que cambia de medio ✋ |
| ondas-mecanicas | 4 de 5 | ondas-estacionarias | Tensión, cuerda y frecuencia ✋ · Cuerda fija de largo libre ✋ · Más parlantes, más decibeles ✋ |
| optica-geometrica | 5 de 6 | fabricante | Dos medios a elección ✋ · Lentes y espejos ✋ · Curvatura, índice y foco |
| oscilaciones | 5 de 5 | — | Otro resorte, otra masa ✋ · Péndulo en tres lugares ✋ · La curva x–t ✋ |
| temperatura-y-calor | 5 de 6 | equilibrio-mezcla | Mezcla libre ✋ · La curva del hielo ✋ · La varilla que se estira ✋ |
| termodinamica | 3 de 6 | trabajo-area, cuatro-procesos, maquina-termica | Camino libre de 1 a 2 ✋ · Barras de la primera ley ✋ · El punto del gas ✋ |
| trabajo-y-energia | 4 de 5 | potencia-y-eficiencia | Cuerda con fuerza y ángulo ✋ · La rampa con y sin roce ✋ · El empujón y las barras ✋ |

**Qué se arrastra.** Lo que pide el fenómeno:
- la cola o la punta de la fuerza;
- el peso que cuelga;
- el gancho de la palanca;
- la cima del plano o de la parábola;
- el satélite sobre su radio;
- la carga, la placa o el cable de la derecha;
- el nivel del aceite o el punto en el vaso;
- el émbolo;
- el objeto frente a la lente;
- el cursor del reóstato;
- la barra sobre los rieles;
- la cresta o el punto sobre la curva.

**Cómo se mueve la manija.**
- Si la relación es lineal, `mover` usa la inversa de la escala de la pieza.
- Si no lo es (el nudo, el plano, la cima de la parábola), elige el valor del control cuya manija queda más cerca del dedo.
- La manija lleva el color de la variable que mueve, y siempre quedan los − y +.

**Por qué 26 ideas quedan sin arrastre.** Son de cuatro clases:
- **El control es de opciones o un entero.** Son montajes distintos, no una posición:
  - unidades, conexión de condensadores, ángulo de la fuerza sobre el cable, material y líquido del empuje;
  - polo y sentido en Lenz;
  - proceso en `cuatro-procesos` y camino en `trabajo-area`;
  - modo n en las estacionarias;
  - serie o paralelo.
- **La variable no está dibujada.** Arrastrar no tendría dónde caer:
  - la masa en la gráfica T–t de la mezcla;
  - las temperaturas de la máquina térmica;
  - la separación en la energía del condensador;
  - la carga en la electrización;
  - el tiempo y la eficiencia en la potencia;
  - las espiras del transformador;
  - la frecuencia o la potencia en el fotoeléctrico y los fotones.
- **La figura muestra la respuesta, no la causa.** En el riel de los choques, arrastrar la flecha de después movería el resultado. Las masas y e no tienen lugar en la figura.
- **Las flechas son muy chicas.** En dos-aceleraciones miden de 10 a 20 px y la manija las taparía. El control que queda es el reloj.

En casi todos estos casos, el laboratorio trae el gesto que la idea no permite:
- masas arrastrables en el centro de masa;
- largo libre de la cuerda fija;
- cable que gira de 0° a 180°;
- choque general con las dos velocidades arrastrables.

## 2. Laboratorio

Las 20 unidades traen 3 mesas, y la de referencia, 4. En cada unidad, al menos una mesa es nueva y más rica que los juegos de sus ideas. Ejemplos:
- **El caso raro.** Un metal que flota en mercurio, el ascensor con el cable cortado (N = 0), F = 0 con el cable paralelo a B y cargas de signo contrario.
- **Rangos más amplios.** Tiro de 5 a 30 m/s y de 15° a 75°, y v negativa en los rieles.
- **Dos cosas juntas para comparar.** Dos satélites, dos metales con sus dos rectas, el péndulo en la Tierra, Marte y la Luna, y la recta de referencia en el camino libre.
- **Más controles.** La palanca con sus cuatro manijas, el choque con cinco controles y la mezcla con dos masas y dos temperaturas.

Las lecturas en vivo dicen los valores del caso y su resultado, con el número pegado a su unidad. Así un caso guardado se entiende solo. Por ejemplo: «Brecha 24 m, cierra 4 m/s: 6 s, x = 18 m».

## 3. Llaves, separadores y tipografía

- **Llaves.** Hay de 1 a 3 por regla, con notas de 3 palabras o menos, solo en lo que el alumno tiene que nombrar. Ejemplos:
  - «dónde empezó» y «lo que avanzó»;
  - «parte vertical»;
  - «tope estático»;
  - «hacia el centro»;
  - «la del líquido»;
  - «techo de Carnot»;
  - «no importa d».

  Se quitaron las llaves que abrían la ecuación (una nota larga bajo un símbolo de una letra) y las que iban dentro de una raíz.
- **Separadores.** `'   ·   '` va ahora como parte suelta en todas las ecuaciones de las 20 unidades (comprobado con grep). El lector solo parte la regla grande en líneas si va suelto. Pegado a otro texto, como en `'   ·   J = '`, la regla salía partida a la mitad. Se corrigieron también los `' · '` y `'; '` que unían dos igualdades.
- **Exponentes.** Van con `{ sup }` en reglas, «Mira» y soluciones, y no queda ningún «^».
  - Las lecturas en vivo conservan el superíndice Unicode, porque `{ sup }` se cuenta como palabras y pasa el tope de 12.
  - Los valores de control largos, como «4 ×10⁵ m/s» o «300 kg/m³», pasaron la unidad a la etiqueta, porque desbordaban la tarjeta.
- **Regla 1.** En física moderna, varios números que estaban escritos a mano ahora los calcula el código.
- **Correcciones de contenido de paso.** En gravitación, la regla 3 decía `T = (2π/r)/v`; ahora dice `T = 2πr/v`.

## 4. Hallazgo 9 (el juego y «Mira» con dibujos distintos)

No se cambió ningún «Mira». Donde son dos representaciones a propósito, lo explica un comentario sobre la idea:
- en MRU, la pista del juego frente a la gráfica de «Mira», donde cada punto es una marca que el alumno dejó; también en caída libre y en encuentro;
- en estática 3 y 4, dinámica 1 y 4, y trabajo y energía 1 y 3, donde cada punto de la gráfica es un caso ya probado en el juego;
- en impulso, en restitución, en la aceleración del MAS, en fluidos 1 (el vaso recto a propósito), en unidades (el lápiz y la combi con la misma regla), en corriente 6, en inducción 4 y en física moderna 1.

El resto usa la misma pieza en los dos momentos.

## 5. Piezas tocadas

Todo cambio es solo un export o un dato opcional, sin cambiar lo que ya se dibujaba, y cada uno trae su prueba en el `.test.js`.

| Pieza | Qué se agregó |
| --- | --- |
| `ejes`, `flechas`, `fis-lienzo` (comunes o de física) | `Xi`, `Yi` en `geometria`: las inversas de la escala (de píxel a valor) |
| `fis-riel` | `punta(d, k, carro)` y `velocidadDe(d, x, px)` |
| `fis-resorte` | `constantes.BH`, `MESA` y `centroY` (el centro del bloque) |
| `fis-vasos` | `geometria(d)` → `{ Y, Yi, cx, bordes, rama, prensa, tubo }`; la prensa y el tubo se dibujan ahora con esas mismas funciones (mismo SVG) |
| `fis-cuentas` | `geometria(d)` → `{ x(k), Y, Yi, CERO, MEDIA }` |
| `fis-circuito` | Dato `reostato: k` (alambre con cursor; el tramo después del cursor va tenue) y `geometria(d)` con `cursor(k)` y `k(punto)` |
| `fis-espira` | Dato `barra.escalaV` (la flecha de v a escala) y `geometria(d)` con `puntaV` y `vDe` |

Las comunes `torre`, `pista` y `recta` no se tocaron: ya exportaban lo necesario.

## 6. Pedidos al molde (`app/` y `nucleo/`, que esta sesión no toca)

1. **Raíz con fracción o llave adentro.** En `{ raiz: [{ frac }] }` el radicando se monta sobre el trazo de la raíz. Pasa en v = √(T/μ) y en T = 2π√(m/k) y T = 2π√(L/g), y ya pasaba sin llaves. Es el CSS de `ec-raiz` cuando su contenido es más alto que una línea.
2. **Nota de la llave más ancha que su trozo.** Separa los símbolos y a veces parte la ecuación (en Fₑ = k x, P = m g, c, L, Q, 32 o n). Pedido: que la nota pueda sobresalir a los lados sin ensanchar su trozo.
3. **El valor del control no cabe.** `.te-control output` mide 44 px y no se parte. «300 kg/m³», «400 kPa» y «4 ×10⁵ m/s» desbordaban la página. Se resolvió pasando la unidad a la etiqueta; pedido: que la columna crezca con el valor.
4. **Desborde en la ficha con ideas terminadas.** `scrollWidth` llega a 930–1160 px por la fila de chips: el `span.lector` «(terminada)» dentro de cada `a.te-chip`. Pasa en todas las unidades, también en la de referencia.
5. **El tope de la lectura cuenta mal.** Cuenta el espacio no separable (U+00A0) entre número y unidad como si separara palabras. Pedido: que lo cuente como unión.
6. **El ajuste al paso del control.** `Kit.respuesta.ajustar` redondea a múltiplos del paso, no a min + k·paso: con mínimo 100 y paso 60, el arrastre nunca cae en 220. El validador no lo avisa. En corriente se resolvió bajando ese paso a 20.
7. **La lupa tapa la esquina de la figura.** El botón tapa la esquina superior derecha, a veces con un rótulo («80 J») o una manija.
8. **La manija tapa el rótulo de la flecha.** Sobre la punta de una flecha, la manija tapa en parte su rótulo («F = 20 N»). Propuesta: bajar la opacidad de la manija en reposo, o correr el rótulo.
9. **Respuesta manipulable en «Ahora tú».** Sigue pendiente; la piden, por ejemplo, marcar el lugar del encuentro o la altura del rebote.

## 7. No verificado

- El arrastre con el dedo en un celular real y en gama baja: solo se probó con el mouse de Playwright.
- El lector de pantalla real.
- Combinaciones extremas que el validador no prueba (solo prueba el inicio y los extremos de cada control por separado):
  - en `choque-libre`, las flechas de después llegan cerca del borde;
  - en el nudo, a 60° y 50 N, la punta del peso queda a 1 px del borde;
  - en la palanca con todo al máximo, las cajas tocan el piso (ya pasaba antes).
- **Gas ideal.** El arrastre vertical es muy sensible con V grande: unos 4 px por isoterma a 10 L.
- **Cada paso de «Mira» con llaves, uno por uno.** Las reglas sí se miraron en la ficha, con todas las ideas marcadas como hechas.
- **Tema oscuro.** Esta tanda no lo revisó.
- **El servidor de desarrollo de :4173 se cayó varias veces durante la tanda.** Algunas unidades se recorrieron en servidores propios de cada subagente, sobre el mismo árbol. Las cinco de D se volvieron a recorrer al final contra :4173 y dieron «OK».

## Reporte de diseño

```
Ficha de tarea: el alumno de 3.º a 5.º, en un celular de 360 px, agarra el objeto del fenómeno (la fuerza, el peso, la carga, el émbolo, el objeto frente a la lente) y ve responder la variable dependiente; en el laboratorio prueba el caso raro y compara casos guardados.
Sistema: existente (kit, tokens de variable, molde de docs/teoria.md §4b). Decisiones nuevas, escritas aquí: inversas Xi/Yi en la geometría de las piezas; manija en el color del control que mueve; en relaciones no lineales, «el valor cuya manija queda más cerca del dedo»; lecturas de laboratorio que dicen valores y resultado, con número y unidad pegados.
Carácter: acogedora, viva y precisa · firma: el hilo de color, que ahora llega también a la manija.
Movimientos: arrastre — gesto — sigue al dedo 1:1, sin curva — recorrido según la figura — con movimiento reducido igual (lo mueve la persona). No se agregó ninguna animación.
Verificación: problemas() en verde en las 20 unidades (60 semillas); recorrido a 360 × 780 con arrastre real del mouse en las 81 ideas y en las 61 mesas, 2 casos guardados por mesa, sin errores ni desbordes; capturas revisadas por unidad; npm test completo en verde.
No verificado: dedo real, gama baja, lector de pantalla, tema oscuro, alumnos.
Hipótesis: agarrar el objeto en vez de mover un deslizador acorta el «Juega» y sube la cantidad de casos distintos probados. Se mide con los eventos teoria (momento 'juego', casos y ms) contra la ronda 1.
Conflictos: ninguno con CLAUDE.md. Los pedidos de la sección 6 quedan para quien tenga app/ y nucleo/.
```
