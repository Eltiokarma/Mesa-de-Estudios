# Ronda 5, química animada (parte B): reporte

**Rama:** `teoria5/quimica-b` · **Fecha:** 15 nov 2026 · **Encargo:** `rutinas/encargos/teoria5-quimica-b.md`.

Diez unidades: cada idea se anima sola al abrir (control con `auto`), la lectura muestra los números del momento, «⏸ Pausa» la congela, arrastrar o tocar el control pausa, y con movimiento reducido arranca quieta. La primera mesa de cada laboratorio quedó animada. No se cambió ninguna pregunta de «Predice», ni «Mira», «La regla» ni «Ahora tú».

**Cómo se trabajó:** soluciones la hice directo; las otras nueve, cinco subagentes en worktrees aislados (agrupados por las piezas que comparten), con un commit por unidad que después integré aquí con `cherry-pick` y volví a comprobar todo junto.

**Cómo se comprobó:** `npm run catalogo`, `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` y `npm test` en verde; recorrido con `rutinas/teoria5-quimica-b/pw-anim.js` (Playwright, 360 × 780, swiftshader) en cada idea y en la primera mesa: hay pausa, la lectura y la figura cambian solas en 700 ms, la pausa congela, con `reducedMotion: 'reduce'` arranca quieta, sin desborde. Alumno de prueba en `lab-v1`: `uni: 'unmsm'`, `grado: '5'`. Capturas miradas.

## Piezas tocadas

### `quim-particulas`

- Campo opcional nuevo `agita: t` (y `agitaAmp`, px): cada partícula tiembla alrededor de su casilla con fase y frecuencia propias sacadas del hash (puro de los datos, sin reloj). Sin el campo, el dibujo es idéntico al de antes. Prueba nueva en `quim-particulas.test.js` (mismo número de partículas, pura, alto igual, amplitud acotada).
- **Aviso a la sesión A:** si en `gases` o `liquidos-y-solidos` agregaste un campo parecido, son independientes; `agita` solo se activa si la unidad lo pasa.

### `quim-celda` (solo la usa electroquímica)
- `flujo: s` (opcional): puntos de electrones sobre el alambre, en su sentido, y cationes (naranja) y aniones (verde) en el puente o el líquido, en posiciones que dependen de s.
- `grosor: { izq, der }` (opcional): ancho de cada electrodo (la mesa nueva lo usa para que el ánodo adelgace y el cátodo engorde).
- Sin esos campos, el dibujo es el de antes. Prueba nueva en `quim-celda.test.js`.

### `quim-molecula-3d` (compartida con la sesión A) — **importante para integrar**
- Mientras trabajábamos, `teoria5/quimica-a` (c3fde0e) le agregó su `forma`/`mover` (pivote con `datos.giro` para girar la molécula entera, para enlace químico).
- Aquí se partió de esa versión, idéntica en lo que ellos tocaron, y se le sumó: `forma` ya no depende de las posiciones de los átomos; `mover` corre esferas, barras y rótulos cuando gira un enlace (conformaciones); si hay pares libres o dipolos a la vista y las posiciones cambian, pide rearmar. Se agregó `spec` a la API para probarla en Node.
- Prueba nueva con three.js real en Node: `mover` deja la escena igual que rearmarla; con pares, un giro va por la ruta rápida y mover átomos pide rearmar. La prueba de la sesión A sigue en verde.
- **Al fusionar `quimica-a` y `quimica-b`, `quim-molecula-3d.js` y su prueba chocan: toma la versión de `quimica-b`, que contiene entera la de `quimica-a`** (commit «quim-molecula-3d: forma y mover juntos con los de quimica-a»). Conviene recorrer después la mesa de enlace químico con esta versión: aquí no está esa unidad animada.

### Sin tocar
`quim-molecula`, `quim-cadena`, `quim-composicion`, `barra-porcentaje`, `ejes`, `recta`: todo se resolvió en las unidades (por ejemplo, la curva que se dibuja hasta t se arma cortando los puntos en la unidad).

## Por unidad

### soluciones (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| Solución, coloide o suspensión | Una hora de reposo en 6 s: los grumos de la suspensión caen a rapidez constante y tocan fondo a los 30 min; iones y coloide solo tiemblan | `t` (0–60 min, `auto` 10 min/s); reemplaza al botón «Reposo», que el tiempo volvía redundante |
| Cuánto cabe en el agua | La temperatura sube y baja sola; el punto cruza la curva del KNO₃ y una raya roja marca lo que sobra | `T` con `auto` `rebota` |
| Concentración | El volumen sube y baja con las mismas bolitas; c cambia en la lectura | `v` con `auto` `rebota` |
| Diluir no es retirar | El agua entra sola de 100 a 250 mL, una y otra vez | `v` con `auto` |
| Reaccionar en solución | La base cae sola; cada par H⁺–OH⁻ se vuelve agua cuando se completa | `v` (mL de NaOH) con `auto` |

- **Mesa «Mezcla dos soluciones»** (primera): control `t` nuevo. Las bolitas de A empiezan en su lado del tercer vaso y las de B en el otro, y se mezclan solas (fracción 1 − e^(−t/1,2), modelo cualitativo de difusión). Reto nuevo de pausa: «Pausa la mezcla cuando ya esté casi pareja: más del 95 % mezclado», comprobado con la misma función que mueve las bolitas.
- Modelos cualitativos declarados en comentarios: los 30 min de asentamiento y la curva de mezcla.

### cinetica-quimica (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| La rapidez es una pendiente | La ventana de 2 min avanza sobre la curva de [A], que se dibuja hasta ahí; la cuerda se aplana | `a` («Desde») con `auto` |
| El perfil de energía | La cima (Eₐ) sube y baja sin mover reactivos ni productos | `ea` con `auto` `rebota` |
| Qué acelera una reacción | La temperatura sube y baja (300–390 K) y crece el área sobre Eₐ | `T` pasó de opciones (baja/alta) a numérico con el mismo id y `auto` `rebota`; 300 y 390 K son los dos casos de «Mira» |
| El orden de reacción | [A] sube y baja; los puntos en [A] y 2[A] corren por la curva y la lectura da 2ᵐ | `a` (rotulado [A]) con `auto` `rebota` |
| La vida media | El punto baja por la curva (12 min en 6 s) y cada «mitad» aparece al pasarla; manija nueva `instante` | `t` nuevo |

- **Mesa animada:** «La curva con todo» (`curva-con-todo`) pasó a primer lugar con `auto` en su `t` (curva dibujada hasta t). «El perfil con catalizador» queda segunda y sin animar: un `auto` en Eₐ la dejaría fuera de la grilla de sus retos.

### equilibrio-quimico (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| El equilibrio es dinámico | Las curvas de A y B se dibujan hasta t; la r directa y la inversa se igualan | `t` con `auto` (10 min en 5 s) |
| Kc y Kp | Cada mezcla parte solo de NO₂ y llega sola al equilibrio; Q sube hasta 10 | `t` nuevo (12 min en 5 s) |
| Grado de reacción | α sube y baja con las bolitas | `a` (α) con `auto` `rebota` |
| Le Chatelier | Tras el cambio, Q viaja por la recta hasta K; al llegar, «Q = K» | `t` nuevo (5 min en 5 s) |

- Cuenta del camino al equilibrio: d[N₂O₄]/dt = k·(K·[NO₂]² − [N₂O₄]) integrada con RK4 de paso fijo (función pura de t). k = 0,1/min es ilustrativa (comentario en el código). Las bolitas se redondean sin perder átomos de N y al final llegan exactamente a las mezclas de antes, que «Mira» sigue usando.
- **Mesa «Arma la mezcla y compara»** (primera): `t` nuevo; un punto lleno y la flecha viajan desde la mezcla armada hasta K. El inicio de [NO₂] pasó de 0,3 a 0,5 para arrancar fuera del equilibrio (Q = 3,6). El reto «Guarda dos mezclas en equilibrio en frío» ganó un `testigo` (0,2 y 0,4; 0,3 y 0,9 mol/L) porque con la grilla nueva la muestra de pares no lo hallaba. La segunda mesa, «Desde cualquier lado», también se anima.

### acidos-y-bases (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| El ácido da un protón | En cámara lenta, el H⁺ sale del ácido y se une a la base; en BF₃ + NH₃, el NH₃ se acerca con su par libre | `t` nuevo (0–4 s) |
| Fuerte no es concentrado | La concentración va y viene entre 0,01 y 0,1 M; la lupa cuenta los iones, la lectura da % ionizado y pH | `c` pasó de opciones a numérico con el mismo id y `auto` `rebota` |
| El pH al diluir | Una dilución ×10 por segundo; el pH se frena antes de 7 | `n` con `auto` |
| Neutralización | La base cae a 5 mL/s y la curva de titulación se dibuja hasta ese volumen | `v` con `auto` |

- **Mesa «El ácido que se diluye»** (primera): el vaso se llena solo de 0,5 a 1 L en 5 s; las moléculas tiemblan.

### electroquimica (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| La pila galvánica | Electrones por el alambre e iones por el puente, con rapidez de dibujo proporcional a la fem (resistencia fija; la consigna lo dice) | `t` nuevo |
| Espontaneidad | La flecha mide sola del metal al ion en 3 s y da el E° y el veredicto | `t` nuevo |
| Electrólisis y Faraday | Una hora en 6 s; la recta m–t llena hasta t y punteada después | `t` (min 10→0, inicio 30→0) con `auto` |
| Pourbaix | El potencial va y viene; el punto pierde su rótulo (chocaba con «O₂/H₂O») y gana guías | `e` con `auto` `rebota` |

- **Mesa nueva, primera: «La pila que trabaja»** (`pila-que-trabaja`, 2D): controles a, b, I y t (una hora en 6 s). Con Faraday, el ánodo pierde masa y el cátodo la gana (ancho ∝ √masa, 10 g al inicio). Cuatro retos comprobados con el motor, uno de pausa: «Pausa la pila cuando el cátodo ya ganó más de 1 g». Las mesas existentes no cambiaron de id; bajaron un lugar.

### hidrocarburos (0.2.0)
Las ideas son estructuras discretas: animar estados intermedios inventados rompería la regla 1, y en aromáticos animar dobles que «saltan» enseñaría el error EN6. Por eso, en cada idea un control **«Conteo»** (`r`, violeta c-f, `auto` 1,5/s) recorre la estructura como lo haría el dedo: un resalto violeta y la lectura dicen qué se cuenta, y el último paso muestra la lectura de siempre. Todo sale de la misma estructura (vecinos, rótulos, coeficientes).

| Idea | Qué cuenta el recorrido |
| --- | --- |
| El carbono hace cuatro enlaces | Los enlaces de cada C: siempre llega a 4 |
| Fórmulas y cadenas | Los H, carbono por carbono |
| Aromáticos | La vuelta al anillo, enlace por enlace (los dobles no se mueven) |
| Isómeros estructurales | La fila de carbonos más larga, que crece |
| Cis-trans y óptica | Los dos grupos de cada C del doble y dónde quedan los CH₃ |
| Reacciones orgánicas | Inventario por elemento a cada lado y luego las moléculas |

- **Mesa 3D «El enlace que gira»** (primera): `phi` con `auto` `rebota` (30°/s, cámara lenta); se anima con `forma`/`mover` de `quim-molecula-3d` (en el navegador, el butano: 1 armado y unos 110 `mover`). En cis/trans la lectura dice «el doble no gira». Ids y rango 0–330 intactos.

### funciones-organicas (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| Alcohol, fenol, éter | El O y cada vecino (de cadena o de anillo) | «Conteo» `r` |
| Aldehído y cetona · Ácido y éster | El C=O y lo demás que tiene su carbono | «Conteo» `r` |
| Amina, amida, nitrilo | El N, su carbono y si ese carbono lleva C=O | «Conteo» `r` |
| Isomería de función | Inventario por elemento de las dos, y al final los grupos | «Conteo» `r` |
| Nombrar | El OH va y vuelve por la cadena; el nombre usa el localizador menor | `p` con `auto` `rebota` (redondeado: salta de C en C) |

- **Mesa «El grupo que recorre la cadena»** (primera): `p` con `auto` `rebota`. Arrastrar el último carbono ya no pausa el recorrido salvo que el grupo quede fuera de la cadena.

### biomoleculas-y-productos-naturales (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| Unir azúcares | En cámara lenta cada glucosa baja y se une; con cada enlace baja un H₂O; masa del momento 180n − 18u | `t` nuevo; n arranca en 3 |
| Grasas | Los tres ácidos llegan uno por uno; al tocar el glicerol aparece el éster y sale «+ H₂O» | `t` nuevo |
| Péptidos | La cadena se arma con aminoácidos | `t` nuevo; n arranca en 4 |
| Vitaminas y solubilidad | Agitada con aceite y agua, la vitamina cruza a la capa que la disuelve, una molécula a la vez (modelo cualitativo, comentado) | `t` nuevo; el juego pasó a `quim-particulas` («Predice» y «Mira» siguen con `quim-cadena`) |
| Productos naturales | La molécula gira en el plano: la orientación no la cambia | `giro` nuevo (24°/s) — **la más floja**: la idea es de clasificación, sin proceso en el tiempo |

- **Mesa «Cadena o anillo de bloques»** (`polimero`, primera): `t` nuevo; en cadena los bloques bajan y se unen, en anillo los enlaces aparecen en orden y el último cierra la vuelta, con «u H₂O» al centro. Reto nuevo de pausa: «Pausa una cadena justo cuando ya salieron dos aguas y falta al menos otra», comprobado con `polimero()`.
- Los `t` nuevos van sin color: c-h ya es el agua en esta unidad.

### recursos-naturales (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| Destilar separa | La temperatura de la torre sube y baja (0–400 °C) | `t` (ya existía, es la temperatura) con `auto` `rebota` |
| Octanaje | Cada 5 octanos un heptano pasa a isooctano; las moléculas tiemblan | `o` con `auto` `rebota` |
| Combustión | En cámara lenta se queman las dos moléculas; «Sin reaccionar» y «Productos» con conteos de `quemar()`; el O₂ que sobra queda | `t` nuevo |
| Mena, ley y metal | La ley sube y baja (1–8 %); el juego pasó a las barras de `quim-composicion` (las de la mesa 2) con sus bordes arrastrables | `ley` con `auto` `rebota` |

- **Mesa «Dos platos de la torre»** (`dos-platos`, primera): el plato 2 recorre la torre solo. Sin reto de pausa (no hubo uno limpio).

### ambiente-y-quimica-aplicada (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| Cadenas del aire | La cadena se arma sola, un eslabón por segundo; lo que falta, tenue | `t` nuevo |
| Filtrar no desinfecta | El agua avanza y retrocede por la planta, ~2 s por etapa | `e` con `auto` `rebota` |
| Eutrofización | La cadena del lago se arma eslabón por eslabón (cámara rápida) | `t` nuevo |
| Reciclaje | Lo recolectado va de 30 a 90 % (redondeado a enteros) | `a` con `auto` `rebota` |
| Polímeros de adición | Un etileno sube con su doble enlace y al engancharse queda simple en la cadena | `n` con `auto` |
| Superficie, nano y corrosión | Los cortes suben y bajan; la recta, firme hasta el punto y punteada después | `k` con `auto` `rebota` |

- **Mesa «Tres filtros sobre 100 kg»** (primera): `t` nuevo; los 100 kg pasan por los filtros, uno por segundo. Reto nuevo: «Pausa justo cuando la carga ya cruzó los tres filtros» (`t ≥ 3`).
- Texto cambiado: en la lectura de la planta, la etapa 2 dice «nada aún» (antes «aún no quita nada», que quedaba mal en la frase).

## Lo que no se animó y por qué
- `npm test` completo: 8771 de 8771 en verde. pw-anim: soluciones 36, cinética 36, equilibrio 30, ácidos 30, electroquímica 30, hidrocarburos 42, funciones orgánicas 42, biomoléculas 36, recursos 30, ambiente 42 ✓; 0 ✗, sin errores de consola (recorrido final con todo integrado).
- Todas las ideas de las diez unidades y la primera mesa de cada laboratorio se animan.
- Cinética, mesa «El perfil con catalizador» (segunda): un `auto` en Eₐ rompería sus retos (valores fuera de la grilla).
- Las otras mesas (no primeras) quedan como estaban, salvo «Desde cualquier lado» de equilibrio.
- Débil a propósito: «Productos naturales» (biomoléculas) solo gira la molécula, y en hidrocarburos y funciones orgánicas la animación es un recorrido de conteo, no un proceso: son ideas de estructura. Si Gerson quiere otra cosa ahí, hay que decidir qué proceso mostrar.

## Cambios de forma que conviene revisar
- Controles de opciones que pasaron a numéricos con el mismo id: cinética idea 3 (`T`), ácidos idea 2 (`c`). Soluciones idea 1: «Reposo» (`r`) se reemplazó por `t`.
- Juegos que cambiaron de pieza: vitaminas (a `quim-particulas`) y mena (a `quim-composicion`).
- Mesas reordenadas: cinética («La curva con todo» primero) y electroquímica (mesa nueva primero). Ningún id cambió.
- Inicios cambiados: biomoléculas n = 3 y 4, equilibrio [NO₂] = 0,5, electrólisis t = 0.

## Pedidos a la base o a la app
Ninguno.

## Lo no verificado
- Nada en un celular real (Redmi 15C): solo emulación a 360 × 780 con swiftshader.
- El arrastre a mano mientras corre la animación (el validador comprueba los arrastres en toda la grilla, no el gesto en vivo).
- La mesa de enlace químico de la sesión A con la versión unida de `quim-molecula-3d`.
- En varias capturas el botón fijo «Siguiente» tapa la parte baja de la figura (pasaba antes también); lo tapado se revisó aparte.
- Equilibrio, mezcla 3 de la idea 2 en t = 0 (21 NO₂ en la caja): por la cuenta de casillas cabe, no se vio en captura.
- Lector de pantalla.
