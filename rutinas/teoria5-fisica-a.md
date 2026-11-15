# Ronda 5, física A: física animada (15 nov 2026, noche)

Encargo: `rutinas/encargos/teoria5-fisica-a.md`. Rama `teoria5/fisica-a`. Molde: `docs/3d.md` §6 y `fisica/oscilaciones.js`.

**Cómo se trabajó.**
- Oscilaciones y la pieza 3D las hizo la sesión principal.
- Las otras nueve unidades las animó cada una un subagente, en una copia aparte del repo y tocando solo el archivo de su unidad.
- La sesión principal revisó capturas, corrió pruebas y recorrido, e hizo un commit por unidad.

**Cómo se comprobó cada unidad**
- `npm run catalogo` y `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` en verde (754 de 754).
- **Recorrido** `node rutinas/teoria5-fisica-a/pw-anim.js <unidad> [salida] [ideas]` (con `npm run dev` corriendo):
  - a 360 × 780 con swiftshader, con un alumno `{ uni: 'unmsm', grado: '5' }` en `lab-v1`;
  - en cada idea y en la primera mesa comprueba:
    - que hay control animado («⏸ Pausa»);
    - que la lectura cambia sola entre dos momentos (700 ms);
    - que «⏸ Pausa» la congela;
    - que con `reducedMotion: 'reduce'` arranca quieta;
    - sin errores de consola.
  - Las diez unidades pasaron en la rama integrada.
- Capturas (dos momentos por pantalla) miradas a mano.
- `npm test` completo en verde antes del último push.

## Por unidad

Notación: `ctrl a–b @v/s, modo`. «Barre» = parámetro con `modo: 'rebota'`; «t» = tiempo con `modo: 'repite'`.

### fisica.magnitudes-y-vectores
- **unidades:**
  - control nuevo `L` (largo del lápiz, c-o), 0,5–3 m @0,5, barre; el de opciones `un` sigue igual;
  - la lectura da L en dos unidades.
- **homogeneidad:**
  - el exponente `t` de T barre de −3 a 1 @1,8, y la lectura nombra la magnitud (longitud, velocidad, aceleración…);
  - va rápido (≈ 0,55 s por magnitud): a menor velocidad, la lectura a veces no cambiaba en 700 ms. Para leer una magnitud, se pausa. *Revisar en el celular si conviene más lento.*
- **resultante:** θ 0–180° @30, barre. R se estira hasta A + B y se encoge hasta A − B.
- **componentes:**
  - Aₓ −4–4 @1,5, barre: û gira y siempre mide 1;
  - la mesa «componentes» hereda el juego.
- **productos:** θ 0–180° @30, barre. Se ven la sombra (producto escalar) y el paralelogramo (producto vectorial).
- **Primera mesa `flechas-espacio` (3D):**
  - `az` −2–2 @1, barre, sobre `fis-espacio-3d` con `forma`/`mover`;
  - `F.vectores` quita la flecha Az solo si vale exactamente 0, así que casi nunca rearma;
  - mismos cinco retos.

### fisica.movimiento-rectilineo
Todo a velocidad real. Cada `t` dura medio segundo más que el movimiento, para que el final se vea quieto.
- **mru:** `t` 0–5,5 s. El carrito avanza y deja una marca cada segundo; siguen sus manijas.
- **desplazamiento-distancia:**
  - `t` 0–7 s: el punto recorre la v–t y las dos áreas se llenan hasta t;
  - la mesa `ida-vuelta` hereda el juego.
- **pendiente-aceleracion:**
  - `t` 0–4,5 s: la recta se pinta hasta t y el área se llena;
  - si frena hasta v = 0, se queda ahí («se detuvo»);
  - el eje v pasó a 0–20 m/s para que la recta no se salga;
  - la mesa `recta-vt` hereda el juego.
- **caida-libre:** `auto` en el `t` que ya existía (0–4 s).
- **encuentro:**
  - `t` 0–6,5 s: A y B avanzan con sus marcas;
  - la línea del encuentro aparece en tₑ.
- **Primera mesa `pista-libre`:**
  - `t` 0–5,5 s;
  - reto nuevo «Pausa el carrito justo sobre la marca de 20 m».
- **Prueba común tocada:** `nucleo/teoria-retos.test.js` usa `pista-libre` como ejemplo. Sus testigos llevan ahora `t: 0`, porque la mesa tiene `t`.

### fisica.movimiento-parabolico-y-circular
- **un-reloj-dos-ejes:**
  - `t` 0–4,5 s, real: la pelota sale una y otra vez;
  - la curva se dibuja hasta t, con marcas cada 0,5 s y sus dos sombras.
- **arco-y-radian:**
  - `auto` en `deg` (30–360° @60, repite): la rueda gira;
  - la mesa `rueda` hereda el juego. Su reto «menor giro» exige el valor de la grilla.
- **rapidez-constante-acelera:**
  - `t` 0–60 s: el cuerpo da vueltas con v y a_c;
  - las manijas recalculan t para que no salte;
  - la mesa `giro` hereda el juego.
- **dos-aceleraciones:** `auto` en el `t` existente (@0,5, cámara lenta). El punto avanza θ = ½(aT/r)t² y deja un arco.
- **Primera mesa `dos-sombras-3d`:**
  - `auto` en `t` (real);
  - `F.tiro` conserva la forma (ver piezas), así que la escena solo se mueve.

### fisica.estatica
Ninguna idea tiene tiempo real; todas barren un parámetro.
- **diagrama-y-parejas:** F 0–20 N @6. La normal sigue a la mano.
- **nudo-en-equilibrio:**
  - `ang` 30–60° @6: las tensiones crecen al aplanarse;
  - **`ang` pasó de botones (30, 37, 53, 60) a deslizador de paso 1 con el mismo `id`**, porque la animación no funciona con botones;
  - 37° y 53° siguen dando los valores de examen (sen 37° = 0,6);
  - el reto de `nudo-libre` usa `valoresDe(...)`.
- **rozamiento-se-ajusta:**
  - F 0–30 N @5: el roce copia a F hasta el tope μs N y luego cae a μk N;
  - la lectura usaba un número escrito a mano; ahora lo calcula `roceDe` (regla 1).
- **resorte-proporcional:** m 0,5–2 kg @0,4. El estiramiento crece en proporción.
- **torque-y-brazo:** d2 0,5–2 m @0,3. La barra se nivela al pasar por 1,5 m.
- **polea-movil:** control nuevo `h` («sube», 0–0,4 m). La mano recorre h con la polea fija y 2h con la móvil.
- **Primera mesa `palanca-libre`:**
  - d2 @0,3, barre;
  - reto nuevo «Pausa la barra justo cuando quede horizontal».

### fisica.dinamica
Movimientos en cámara lenta con fórmulas cerradas (`recorrido`). Una «cámara» sigue al cuerpo cuando pasa de 0,9 m, así la pista no se acaba. `t` va en tinta, porque `c-h` es la aceleración en esta unidad.
- **fuerza-neta-acelera:** `t` 0–1,5 s @0,4. Las marcas cada 0,25 s se separan cada vez más.
- **masa-y-peso:** m barre @20 kg/s; la flecha P = m·g la sigue.
- **rozamiento-en-movimiento:** `t` 0–1,5 s @0,4. Según F y el roce, acelera, va parejo o frena hasta «se detuvo».
- **plano-y-polea:** `t` 0–1 s @0,25. El bloque baja con s = ½ g senθ t² y deja marcas.
- **centripeta-es-resultante:**
  - v barre 0–10 m/s @2,5, y N = m(g − v²/r) baja y sube;
  - el auto no recorre la loma: hacerlo pedía fuerzas tangenciales y el despegue.
- **ascensor-y-marcos:** `t` 0–2 s @0,5. v cambia de signo y la balanza marca lo mismo.
- **Mesas:**
  - primera, `bloque-libre`: `t` 0–1,5 s, con el reto nuevo «páusalo justo cuando se detiene»;
  - `ascensor-libre`: `t` agregado;
  - `loma`: hereda la rapidez animada.

### fisica.gravitacion
- **cuadrado-inverso:**
  - r 1–4 R @0,75, barre: F cae como 1/r²;
  - la mesa `atraccion` hereda el juego.
- **campo-gravitatorio:** m 1–100 kg @25, barre. La flecha g no cambia y F sí.
- **orbita-circular:**
  - `t` 0–24 h @1,5 h/s (acelerado, lo dice la consigna);
  - usa el modelo redondeado de la unidad (V0 = 8 km/s, T = 1,4·r^1,5 h), para que la figura y la lectura den los mismos números.
- **leyes-de-kepler:**
  - `t` 0–12 meses @2: un año en 6 s;
  - Kepler resuelto con Newton, 40 iteraciones fijas, y v por vis viva;
  - se ve el área barrida.
- **Primera mesa `orbita-plano-3d` (3D):**
  - `auto` en `t` @1,5;
  - forma fija, así que solo mueve;
  - se ajustaron consigna, lectura y la pista de un reto.

### fisica.trabajo-y-energia
- **trabajo-y-angulo:**
  - `ang` 0–180° @30, barre;
  - la componente de F a lo largo del camino cambia de sentido en 90°;
  - **se arregló un error previo:** la flecha punteada nunca se dibujaba porque `o.comp` valía 0.
- **trabajo-energia-cinetica:**
  - control nuevo `s` (recorrido, c-i) 0–4 m @1, punto a punto;
  - W y K crecen juntas hasta d.
- **energia-potencial:** x 0,05–0,4 m @0,1, barre. El triángulo de energía crece.
- **conservacion-energia:**
  - `frac` 0–1 @0,25, repite, con posición continua (`enRampa`);
  - la lectura da U, K y U + K.
- **potencia-y-eficiencia:**
  - el tiempo de subida `t` 10–40 s @6, barre: v = 10/t y P útil del momento;
  - la carga no sube en pantalla, lo que se anima es el tiempo de subida.
- **Mesas:**
  - primera, `cuerda-libre`: `ang` @30, barre, con el reto nuevo «Pausa la cuerda justo cuando deja de hacer trabajo»;
  - `rampa` y `empujon`: heredan los juegos animados.

### fisica.impulso-y-choques
`t` va en c-d (verde), porque F ya es c-h; así lo dice la cabecera de la unidad.
- **impulso:** `t` 0–0,6 s, cámara lenta. El área F–t se llena y la lectura da J(t) y v.
- **conservacion:** `t` 0–0,8 s, cámara lenta. Los carritos se separan y p total sigue en 0.
- **elastico-inelastico:** `t` 0–1 s, cámara lenta. Chocan en tc ≈ 0,43 s, p = 8 no cambia y K cae.
- **restitucion:** `t` 0–8 s, real. La pelota rebota con eⁿ·20 m/s, en tramos cerrados.
- **centro-masa:**
  - m2 1–5 kg @1, barre;
  - no se movieron los cuerpos con el centro parejo, porque eso adelantaba la respuesta de «Predice» (regla 3).
- **Primera mesa `golpe-libre`:**
  - `t` 0–0,6 s;
  - reto nuevo «Pausa el golpe justo cuando lleva la mitad de su impulso».

### fisica.oscilaciones
Las ideas 1 y 2 y la mesa `resorte-vivo` ya estaban animadas.
- **periodo-resorte:** m 0,25–2 kg @0,35, barre: el punto recorre T–m.
- **pendulo:** L 0,25–2 m @0,35, barre: el punto recorre T–L.
- **energia-mas:**
  - `x` se cambió por `t` (como la idea 1), en cámara lenta, con el bloque de la idea 1 (0,5 kg, ω = 10 rad/s);
  - U y K corren sobre sus curvas;
  - arrastrar convierte x en t.

### fisica.ondas-mecanicas
- **la-cresta-avanza:** `auto` en el `t` existente, cámara lenta ×4.
- **funcion-de-onda:**
  - `t` 0–2 s, cámara lenta ×4: la onda avanza y P sube y baja sin avanzar;
  - el arrastre sigue a la cresta.
- **rapidez-cuerda:**
  - `t` 0–1 s, cámara lenta: el juego pasó a una «carrera» de dos pulsos (delgada contra gruesa, misma T);
  - el arrastre `tension` es la meta en 1 s;
  - «Predice», «Mira» y «La regla» siguen con la gráfica v–T.
- **ondas-estacionarias:** `t` 0–20 ms, cámara lenta ×200. Nodos quietos y vientre que oscila.
- **intensidad-decibeles:** r 1–10 m @2,25, barre sobre la curva β–r.
- **Primera mesa `guitarra`:**
  - `t` 0–40 ms, cámara lenta ×200;
  - reto nuevo «Pausa la cuerda justo cuando P esté en lo más alto».

## Mesas animadas
- **Primera mesa de cada unidad:**
  - flechas-espacio (3D), pista-libre, dos-sombras-3d (3D), palanca-libre, bloque-libre, orbita-plano-3d (3D), cuerda-libre, golpe-libre, resorte-vivo (ya estaba) y guitarra.
- **Animadas además por heredar el juego de una idea:**
  - componentes, ida-vuelta, recta-vt, rueda, giro, nudo-libre, ascensor-libre, loma, atraccion, rampa y empujon.

## Piezas y núcleo tocados
- **`nucleo/kit/piezas/fis-espacio-3d.js`:**
  - `forma(d)`: qué objetos hay (cuántos, color, rótulo, puntos por trazo);
  - `mover(T, grupo, d, e, h)`: mueve flechas (posición, giro y escala del cuerpo y la punta), bolas, trazos y caras, y los rótulos con `h.moverEtiqueta`;
  - campo opcional `oculta` en `bolas`: armada pero sin verse;
  - prueba nueva en `fis-espacio-3d.test.js`;
  - nada de lo que ya dibujaba cambió.
- **`nucleo/fisica3d.js`, `tiro`:**
  - el camino lleva siempre 61 puntos (los que faltan esperan sobre la pelota);
  - las 12 marcas de medio segundo están siempre, con `oculta` hasta que pasa su instante;
  - se ve igual que antes.
- **`nucleo/teoria-retos.test.js`:** testigos con `t: 0` (ver rectilíneo).
- **Aviso a física B:** también usa `fis-espacio-3d` (magnetismo, inducción y ondas EM). Aquí solo se agregaron campos y funciones; si allá también agregaron `forma`/`mover`, al integrar hay que juntar las dos versiones a mano.

## Lo que no se animó o se animó distinto
- No quedó ninguna idea sin animar.
- Se animó un parámetro y no el tiempo en:
  - loma (dinámica): el recorrido exigía fuerzas tangenciales y el despegue;
  - centro de masa (impulso): animarlo en el tiempo adelantaba la respuesta de «Predice»;
  - potencia (trabajo): se anima el tiempo de subida, no la carga.

## Pedidos a la base o a la app
- El lector anima solo el primer control con `auto`. Algunas ideas querrían dos (por ejemplo, un parámetro que barre y el tiempo); hoy se elige uno.
- **Mesa 3D del tiro:** el rótulo «y», con fondo sólido, tapa las marcas de medio segundo de la pared, que quedan apretadas cerca del suelo. Ya pasaba antes.
  - Arreglo posible: correr el rótulo a un lado o agrandar la escala vertical de la escena.
- La escena 3D de la órbita se ve chica a 360 px con r = 2 R (ya era así).

## No verificado
- Celular real (Redmi 15C), lector de pantalla y sin conexión.
- El arrastre con el dedo mientras corre la animación: solo lo comprueban el validador y pruebas en Node.
- Las mesas que no son la primera, salvo por herencia.
- **Roces de rótulos conocidos:**
  - resultante cerca de 170°;
  - plano con P cerca de las marcas;
  - cota de la mano en la polea móvil;
  - «P» con «λ» en la guitarra;
  - «gruesa» con «en 1 s» en la carrera de pulsos;
  - rótulos de A y B pegados justo tras el choque.
- **Lecturas en dos líneas a 360 px:** mru, polea, potencia y tiro.
- El parpadeo de los postes de la «cámara» de dinámica a la aceleración máxima (12 m/s²).
