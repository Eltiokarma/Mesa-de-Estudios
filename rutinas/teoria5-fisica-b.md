# Ronda 5, física B: física animada (15 nov 2026, noche)

Encargo: `rutinas/encargos/teoria5-fisica-b.md`. Rama `teoria5/fisica-b`, un commit por unidad («Animación en …»).
Molde: `docs/3d.md` §6 y `fisica/oscilaciones.js`. Recorrido: `rutinas/teoria5-fisica-b/pw.js`.

**Resultado:** las 10 unidades quedaron animadas, con **57 de 57 ideas**. En cada idea, el juego se mueve solo apenas se abre la pantalla, y la primera mesa de cada laboratorio también. Ninguna idea quedó sin animar.

**Lo que no cambió:**
- «Predice», sus opciones correctas, «Mira», «La regla» y «Ahora tú»;
- los `id` de mesas y controles. Solo se agregaron controles (`t`, `s`, `u`).

## Cómo se anima

Dos formas, según la idea:
- **Hay un tiempo:** un control `t` con `auto`. `dibujo` y `lectura` leen `valores.t` y cada cuadro sale del mismo cálculo que ya usaba la idea (regla 1).
- **No hay tiempo:** un parámetro que barre su rango con `auto` y modo `'rebota'`. Se eligió el que deja ver la relación central de la idea.

En ambos casos la consigna dice qué mirar (25 palabras o menos) y, si la velocidad no es la real, dice «cámara lenta». Si un número no debe mostrar decimales que nadie eligió (fuerzas en N, C₁ en μF, vueltas del transformador), el cuadro lo redondea a su unidad.

### Por unidad e idea

| Unidad | Idea | Qué se mueve | Control |
| --- | --- | --- | --- |
| fluidos | presion-profundidad | el punto baja y sube en los tres vasos; la presión cambia igual en los tres | `h` rebota |
| | vasos-comunicantes | entra y sale aceite; el agua del otro lado sube | `ha` rebota |
| | prensa-hidraulica | F₁ sube y baja, y F₂ la sigue (k veces) | `F1` rebota |
| | empuje | una mano hunde el bloque y lo saca; E crece con lo sumergido y W no cambia; «aquí flota» donde E = W | `s` nuevo (% sumergido) rebota |
| | tension-superficial | el alambre se alarga y se acorta; F = 2γL | `L` rebota |
| | bernoulli | el tubo se angosta y se ensancha; v₂ y los tubitos cambian | `k` rebota |
| temperatura-y-calor | escalas | la temperatura recorre de −40 °C a 100 °C sobre la recta °C–°F | `c` rebota |
| | equilibrio-mezcla | el reloj corre: las dos curvas se dibujan hasta t, con T₁, T₂ y el calor que pasó | `t` nuevo (min) |
| | calor-especifico | entra calor y el punto sube por la recta | `q` |
| | cambio-de-fase | el fuego parejo avanza el calor por la curva del hielo, con sus mesetas | `q` |
| | dilatacion | la varilla se calienta y se enfría | `dt` rebota |
| | transferencia | la pared se engrosa y adelgaza; lo que cruza por segundo | `e` rebota |
| termodinamica | gas-ideal | el gas se comprime y se expande sobre su isoterma | `v` rebota |
| | primera-ley | el calor cambia y la barra ΔU lo sigue | `q` rebota |
| | trabajo-area | el gas recorre el camino de 1 a 2 y el área se pinta hasta donde llegó | `s` nuevo (recorrido) |
| | cuatro-procesos | las barras Q, −W y ΔU crecen mientras ocurre el proceso | `s` nuevo (avance %) |
| | cp-cv | sube la temperatura a volumen fijo y la barra de Q la sigue | `dt` rebota |
| | maquina-termica | el foco caliente sube y baja; η y W | `tc` rebota |
| electrostatica | electrizacion | las esferas se acercan, se tocan y se separan en cámara lenta; la carga se reparte al tocarse | `t` nuevo |
| | coulomb | la carga de la derecha se acerca y se aleja | `r` rebota |
| | campo-potencial | P va y viene entre las cargas | `x` rebota |
| | campo-uniforme | la partícula cruza las placas en cámara lenta (lo recorrido crece con t²) | `u` nuevo (fracción del cruce) |
| | serie-paralelo | C₁ crece y se achica; la carga de cada condensador | `c1` rebota |
| | energia-condensador | las placas se separan y se juntan; los factores de C, Q, V y U | `k` rebota |
| corriente-y-circuitos | no-se-gasta | puntos de carga recorren el circuito; la carga que pasó en t | `t` nuevo |
| | ohm-resistividad | la fuente sube y baja; el punto recorre la recta V–I | `i` nuevo (fracción de la corriente máxima) rebota |
| | fem-y-medidores | el cursor del reóstato se mueve; el amperímetro y el voltímetro | `r` rebota |
| | serie-paralelo | puntos de carga, más lentos con más focos | `t` nuevo |
| | kirchhoff | la carga que llega al nudo se reparte entre las dos ramas | `t` nuevo |
| | potencia-joule | la carga en cada rama; la energía que convierte cada foco | `t` nuevo |
| magnetismo | oersted | la corriente sube y baja, y la brújula gira | `i` rebota |
| | espira-solenoide | el solenoide se estira y se encoge; el campo de adentro | `L` rebota |
| | fuerza-carga | el protón da vueltas en cámara lenta, con v tangente y F al centro; la manija sigue a la punta de v | `t` nuevo (ns) |
| | fuerza-cable | la corriente sube y baja; la fuerza | `i` rebota |
| | cables-paralelos | los cables se acercan y se alejan | `d` rebota |
| induccion-electromagnetica | flujo | la espira gira y su sombra cambia | `th` rebota |
| | faraday | el reloj recorre la gráfica Φ–t; Φ y ε del tramo | `t` nuevo |
| | lenz | el imán se acerca o se aleja de verdad; la distancia en la lectura | `t` nuevo |
| | barra-movil | la barra avanza y barre área; Φ crece y ε se mantiene | `t` nuevo |
| | generador | el punto recorre la fem alterna; ε del momento y la eficaz | `t` nuevo |
| | transformador | el secundario cambia de vueltas; Vs | `ns` rebota |
| ondas-electromagneticas | campos-cruzados | la onda avanza con E y B en fase, en cámara lenta; E en el borde | `t` nuevo (ns) |
| | todas-a-c | el pulso viaja por la recta d = ct hasta su destino (se abre en la Luna) | `t` nuevo |
| | espectro | el punto λ recorre la banda elegida; f = c/λ | `u` nuevo rebota |
| | cambio-de-medio | el índice sube y baja; las crestas se aprietan | `n` rebota |
| optica-geometrica | snell | el rayo gira al entrar | `a` rebota |
| | reflexion-total | el rayo sube hasta pasar el ángulo crítico | `a` rebota |
| | espejo-plano | la vela se acerca y se aleja | `d` rebota |
| | espejo-concavo | el objeto se acerca y se aleja; la imagen | `d` rebota |
| | lente-delgada | el objeto se acerca y se aleja; la imagen | `d` rebota |
| | fabricante | el radio de las caras cambia el foco | `R` rebota |
| fisica-moderna | fotoelectrico | la frecuencia cruza el umbral del sodio; bajo el umbral, «no salen electrones» | `f` rebota |
| | fotones | los paquetes corren al detector en cámara lenta; los que llegaron en t | `t` nuevo |
| | cuerpo-negro | la temperatura mueve el pico | `T` rebota |
| | rayos-x-laser | el voltaje mueve el borde λ mínima | `V` rebota |
| | relatividad | la nave acelera; γ | `b` rebota |
| | incertidumbre | la caja se achica y se agranda; Δv mínima | `x` rebota |

### Las mesas animadas

**La primera mesa de cada unidad:**
- **2D:**
  - fluidos: `presion-total` (`h`);
  - temperatura-y-calor: `mezcla-libre` (reloj `t` nuevo, curvas hasta t);
  - termodinamica: `camino-libre` (la esquina `pk`);
  - electrostatica: `coulomb-libre` (`r`);
  - corriente-y-circuitos: `pila-reostato` (el cursor `r`);
  - optica-geometrica: `frontera-libre` (`a`);
  - fisica-moderna: `dos-metales` (`f`).
- **3D, sin rearmar la escena** (`forma` y `mover` de `fis-espacio-3d`):
  - magnetismo: `mano-derecha-3d` (`th` rebota);
  - induccion-electromagnetica: `espira-sombra-3d` (`th` rebota);
  - ondas-electromagneticas: `onda-3d`: su `t` ya existía y ahora lleva `auto`; la lectura suma E en el origen.

**Otras mesas que heredan el juego de una idea** (`Object.assign(..., idea.juega)`) y por eso también se animan:
- `prensa`;
- `curva-calentamiento`: su reto «Detén el calor cuando la mitad del hielo ya esté fundida» queda como reto de pausa;
- `varilla`, `primera-ley`, `gas-ideal`;
- `placas`, `recta-vi`, `brujula`;
- `espira-gira`, `flujo-tiempo`, `cambio-medio`, `fabricante`.

**Los retos:**
- Siguen comprobados por el motor. El validador los encuentra en la grilla, ahora con los controles nuevos.
- Los cuadros de la animación no cuentan como retos.
- Ya existen retos de «pausa en el momento justo»: `frontera-libre` («a menos de un grado del ángulo crítico»), `onda-3d` («Detén la onda cuando…») y `curva-calentamiento`.

## Piezas tocadas

Solo se agregaron datos opcionales: sin ellos, cada pieza dibuja lo mismo que antes, y las pruebas lo comprueban.

| Pieza | Qué se agregó | Prueba |
| --- | --- | --- |
| `fis-circuito` | `flujo: { fase, ramas, color }`: puntos de carga cada 20 px por el lazo principal y por cada rama, en el sentido convencional. Con circuito abierto no circula. Quien llama pone `fase = I·t·12 px`. | `fis-circuito.test.js`: «flujo» |
| `fis-onda-em` | `fase` (en largos de onda): corre E, B, la primera cresta y la cota λ. Con 0 o 1, la figura de siempre. | `fis-onda-em.test.js`: «fase» |
| `fis-fotones` | `avance` (px): los paquetes corren hacia la placa y vuelven a salir de la lámpara. Con un múltiplo de 128, la figura de siempre. | `fis-fotones.test.js`: «avance» |
| `fis-espacio-3d` (`forma` y `mover`), su prueba y `nucleo/fisica3d.js` | **No los escribí:** son copia idéntica de los de `teoria5/fisica-a` (commit 77db6003), traídos con `git checkout`. Las dos ramas tienen el mismo contenido y la integración no debería chocar. | la de fisica-a |

**Aviso a la sesión de física A y a quien integre:**
- `fis-espacio-3d.js`, `fis-espacio-3d.test.js` y `nucleo/fisica3d.js` quedaron iguales a los de `origin/teoria5/fisica-a` del momento en que los traje.
- En `fisica3d.js` no toqué `lorentz`, `espira` ni `ondaEM`: su forma ya no cambia mientras corre el control animado.
- Si fisica-a cambió esos archivos después, al integrar gana su versión.

## Otros cambios de contenido (sin tocar Predice, Mira, La regla ni Ahora tú)

- **temperatura-y-calor, idea 2 (mezcla).**
  - Antes, cada curva tenía su propia constante de tiempo, 2m/(m₁+m₂). Así, a mitad de camino, el calor que perdía una no era el que ganaba la otra.
  - Ahora las dos comparten τ = m₁m₂/(50(m₁+m₂)) min (1 min con 100 g y 100 g), y en cada instante m₁ΔT₁ = m₂ΔT₂.
  - Las curvas de «Predice» (revelar), «Mira» y «Mezcla libre» cambian un poco de forma; sus textos y números no cambian.
- **ondas-electromagneticas, idea 2.** El destino se abre en «Luna»: a la Luna el pulso se ve viajar 1,28 s. Al GPS llega en 0,07 s. Las opciones no cambian.
- **ondas-electromagneticas, idea 1.** La manija de la cresta sigue a la cresta mientras la onda avanza. Al arrastrarla, se busca la λ que deja la cresta bajo el dedo en ese instante. Así pasa la prueba de ida y vuelta del validador.
- **magnetismo, idea 3.** El protón ya no está quieto al entrar: da vueltas. El período, 2πm/(qB), no depende de v. La manija de v va en la punta de la flecha, donde esté el protón.

## Lo que no se animó y por qué

Nada: las 57 ideas y las 10 primeras mesas se mueven solas.

**Una decisión de diseño:** en `fotoelectrico` se barre la frecuencia y no se hacen correr los fotones.
- El lector admite un solo control con `auto` por pantalla.
- El umbral (hf contra φ) es la relación central de la idea.
- El flujo de paquetes sí corre en `fotones`.

## Pedidos a la base o a la app

1. **Más de un control animado por pantalla.** Que `t` pueda mover a la vez el flujo de fotones y el barrido de frecuencia, o un `auto` secundario.
2. **El ícono de «⏸ Pausa».** En el Chromium del recorrido sale como «∎ Pausa», porque la fuente no trae ⏸. Conviene mirarlo en el Redmi 15C; si falla, poner un ícono SVG.
3. **Glosario y comas.** En la consigna, un término del glosario seguido de una coma deja la coma sola al comienzo de la línea siguiente («cargas / , en microcoulombs»). Ya pasaba antes de esta ronda.
4. **El reloj `repite` salta al volver a empezar** cuando la fase no es múltiplo del período, porque el lector vuelve a `min`. Pasa en `onda-3d` con λ = 4,5 m y en los puntos de carga cada 20 s.
   - Lo evité donde pude: en `campos-cruzados`, 200 ns es múltiplo de todos los períodos; en `fotones`, 512 px son 4 vueltas.
   - Un modo `'continuo'` (t sin tope) lo resolvería.

## Cómo se comprobó

- **Pruebas:**
  - después de cada unidad: `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'`, en verde;
  - antes del último push: `npm test` completo, en verde (8771 de 8771).
- **Recorrido con Playwright** (`node rutinas/teoria5-fisica-b/pw.js 4173 <salida> fisica.<unidad>`):
  - a 360 × 780, con swiftshader;
  - alumno en `lab-v1` con `uni: 'unmsm'` y `grado: '5'`;
  - en cada idea y en la primera mesa: la lectura cambia sola entre dos momentos (700 ms), «⏸ Pausa» la congela y, con `reducedMotion: 'reduce'`, arranca quieta («▶ Seguir»);
  - resultado: las 57 ideas y las 10 mesas pasaron, también las tres 3D;
  - miré capturas de cada unidad. Corregí lo que se veía mal: dos rótulos encimados en la mezcla, decimales de más en la prensa y en C₁, y la lectura de idea 1 de termodinámica, que no cambiaba en el primer tramo vertical.
- **Una nota sobre las pruebas:**
  - el validador de arrastres prueba toda la grilla, ahora con `t`;
  - `teoria.test.js` tarda unos 25 s;
  - la búsqueda de λ de la cresta de ondas es cuenta pura y barata.

## No verificado

- Rendimiento y batería en el Redmi 15C, sobre todo las tres mesas 3D y los circuitos con 30 o más puntos de carga por cuadro.
- Lector de pantalla mientras corre la animación (la base apaga `aria-live`; no lo escuché).
- Sin conexión: el service worker ya guarda las unidades y las piezas; no lo probé con la red cortada.
- Arrastrar a mano en un teléfono real mientras corre: lo cubre la prueba de ida y vuelta del validador, no un dedo.
- Las mesas que heredan el juego (lista de arriba), salvo la primera de cada unidad: pasan el validador, pero no las recorrí en el navegador.
