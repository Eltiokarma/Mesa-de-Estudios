# Propuesta de ideas: «Movimiento parabólico y circular» (`fisica.movimiento-parabolico-y-circular`)

Etapa 5 del plan de calidad, rama «Mecánica» de Física, la unidad que sigue a «MRUV y caída libre» · fases 1 y 2
(`docs/metodo/unidad/1-ideas.md` §A y §B) · 19 nov 2026

Gerson delegó el criterio: esta propuesta ya se ejecutó en su fase 2 (la unidad partida y la idea 1 completa) sin
esperar el visto bueno. Lo que conviene que mires primero está al final, en «Decisiones tomadas (Gerson revisa
después)»: cada duda con la opción elegida, su motivo y la alternativa descartada. No hay ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §4, `docs/molde-unidad.md` entero, `docs/metodo/unidad/LEEME.md`,
`1-ideas.md` y `2-ejemplos.md`, `docs/teoria.md` (4d a 4i y §5), las decisiones de las etapas 2, 3 y 4,
`docs/etapa4/propuesta-fisica.md` como modelo, la teoría actual (`contenido/teoria/fisica/movimiento-parabolico-y-circular.js`,
v0.2.0), su ficha en `catalogo/cursos/fisica.json`, sus doce plantillas (`tiro-parabolico` y `movimiento-circular`,
escenas con motor, casos y papel; los nueve generadores `circular-*` y `cinematica-medias`), el informe
`docs/investigacion/cinematica-ideas-erroneas.md` (P1–P5, C1, C2, K3), `docs/clasificacion/compendio-movimiento-circunferencial.md`
(tipos C1–C13), las trampas 30 y 31 de `docs/clasificacion/trampas-admision-unmsm/fisica.md`, el banco Cuzcano
(`docs/clasificacion/banco-cuzcano.md`), `docs/temario-completo.md` (unidad 3), la matriz `docs/teoria/matriz/fisica.json`
(unidad 3), `catalogo/pruebas/fisica.json` (no hay ningún par de esta unidad), las 10 preguntas de la unidad en
`docs/datos/admision-unmsm.csv`, las taxonomías de la UNI y de San Marcos, y como nivel de lo ya terminado las unidades
`mruv-y-caida-libre.js` y `movimiento-rectilineo.js` con sus piezas (`fis-combi`, `fis-mruv`), sus pruebas, su auditoría
(`rutinas/auditoria/fisica.mruv-y-caida-libre.md`) y su lector en frío (`rutinas/frio/`), para no repetir lo que ahí se
corrigió.

## Qué se pregunta en los exámenes

- **UNI:** semana 3 del CEPRE-UNI 2026-2: «Cinemática en 2D: proyectiles, MCU, MCUV, aceleración centrípeta»
  (`docs/taxonomia-uni-2026.md`). El compendio de movimiento circunferencial (280 problemas, 80 % con marca del
  CEPRE-UNI) dice qué pesa en la UNI: la aceleración total y sus componentes (54) y el MCUV «como su análogo lineal» (50)
  son más de un tercio; después la forma vectorial (24), la transmisión (23) y el MCU con conversiones (20).
- **San Marcos:** tema 4 del CEPRE-UNMSM 2026-I, «Movimiento parabólico, MCU y MCUV».
- **Banco Cuzcano:** 127 fichas. Tiro parabólico 29, movimiento en dos dimensiones 19, MCUV 18, aceleración tangencial
  y centrípeta 13, magnitudes angulares 11; el resto es MCU, transmisión y tiro sobre planos.

**En la admisión real de San Marcos (2019-I a 2027-I) hay 10 preguntas de esta unidad:** 4 de movimiento parabólico,
1 conceptual que cruza los dos temas y 5 de movimiento circular, de las cuales 4 son de MCUV.

| # | Periodo (pregunta) | Qué piden | Trampa (de la clave o la alternativa) | Idea |
| --- | --- | --- | --- | --- |
| 1 | 2020-I (102) | Verdadero o falso sobre la dirección y la constancia de la velocidad instantánea en varios movimientos | Creer que en el MCU la velocidad es constante (trampa 30) | B4 (y A2: la velocidad es tangente) |
| 2 | 2022 (85, 19 mar) | Tiempo de vuelo de un lanzamiento con ángulo, usando solo el avance horizontal | Usar la rapidez total en vez de su componente horizontal | A3 |
| 3 | 2023-II (82) | Distancia que avanza una bicicleta en MCUV, leyendo α en una gráfica θ–t | Olvidar que el ángulo inicial no es cero | B5 |
| 4 | 2024-I (79, área A) | Rapidez de un punto de la Tierra a cierta latitud, por la rotación diaria | Usar el radio de la Tierra en vez del radio del paralelo | B3 |
| 5 | 2024-II (82, área A) | Tiempo de frenado de un ventilador, con ω inicial y las vueltas que da | No pasar las vueltas a radianes | B5 (y B1) |
| 6 | 2025-I (81, área A) | Distancia al origen de una partícula con x(t) e y(t) | Sumar las coordenadas en vez de usar Pitágoras | A5 |
| 7 | 2025-II (81, área A) | Ángulo girado a los 5 s por un ventilador en MCUV, conocido el primer segundo | Tomar la posición angular inicial como desplazamiento | B5 |
| 8 | 2026-I (89, áreas D y E) | Rapidez de lanzamiento con el ángulo de alcance máximo, conocido el tiempo de vuelo | No reconocer que el alcance máximo pide 45° | A4 |
| 9 | 2026-I (82, áreas B y C) | Aceleración angular, con el aumento de ω en un intervalo | Dividir la ω final en vez del cambio (K4 en versión angular) | B5 |
| 10 | 2026-II (82, área C) | Tiempo de caída de una esfera que sale horizontal de un carril | Creer que la rapidez horizontal cambia el tiempo de caída (P2, trampa 31) | A1 |

Por idea: A1 1, A2 0 (más la mitad de la conceptual), A3 1, A4 1, A5 1 · B1 0, B2 0, B3 1, B4 1, B5 4, B6 0. B1, B2 y B6
no tienen pregunta propia en San Marcos: B1 y B2 son la base de las demás (radianes, vueltas, rpm: la trampa de la
pregunta 5 es de B1) y B6 es el tipo más grande del compendio de la UNI (54 de 280).

---

## 0. Diagnóstico de la teoría actual

`movimiento-parabolico-y-circular.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene cuatro ideas:
`un-reloj-dos-ejes` (tiro parabólico), `arco-y-radian` (magnitudes angulares), `rapidez-constante-acelera` (MCU) y
`dos-aceleraciones` (MCUV), y cuatro mesas (`dos-sombras-3d`, `tiro-libre`, `rueda` y `giro`).

**Lo que se queda (es bueno):**
- Las dos sombras: la pelota deja una marca cada medio segundo y sus sombras en el piso (parejas) y en el eje vertical
  (que se juntan arriba). Es la imagen que ataca P1 a P3 y es lo que pide el informe de cinemática.
- La predicción de la soltada contra la lanzada (P1 con 40–71 % de error medido, P2 con 43 %, C2): es la mejor de la
  unidad y pasa tal cual a la idea A1, con sus mismos ids de opción.
- En el MCU, llevar las dos flechas de v a un mismo origen para ver que Δv apunta al centro («Mira» de la idea 3).
- Los cuatro retos de `tiro-libre` (30° y 60° caen en el mismo sitio, 45° gana, 3 s en el aire, más alto no es más
  lejos) y la mesa 3D con el motor de `plantillas/tiro-parabolico` (regla 1).
- Los nueve generadores `circular-*` (45 casos verificados a ciegas) y la escena `movimiento-circular`.
- La historia de Galileo con su fuente (Museo Galileo) y los códigos TP-, AN- y MC-.

**Lo que falla contra el contrato:**
1. **Punto 1: ningún objeto reconocible.** Las cuatro ideas abren con unos ejes o con un círculo y flechas. No hay
   piedra, pelota, rueda, ventilador ni carrusel.
2. **Regla 3: tres de las cuatro predicciones ya se vieron en su juego.** Idea 2: el juego muestra el arco s para
   cualquier radio y ángulo, y la predicción pide un arco. Idea 3: el juego dibuja la flecha de la aceleración hacia el
   centro y la predicción pregunta si hay aceleración y hacia dónde. Idea 4: el juego muestra a_c creciendo con el
   tiempo y la predicción pregunta si la aceleración total es constante.
3. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   lo que se ve («Mira sus sombras: la del piso avanza pareja; la del eje y, no»): dicen la respuesta en vez de pedir algo.
4. **Las ideas 3 y 4 no tienen «Lee» ni «Así se resuelve»**, y ninguna tiene ejemplos resueltos (0 de 60).
5. **Punto 9: la idea 1 carga tres reglas** (partir v₀ con seno y coseno, MRU de lado y lanzamiento vertical hacia
   arriba, y altura, vuelo y alcance) en un solo juego, y su predicción es de tiro horizontal, que el juego no trata. La
   idea 2 junta el radián, el arco, ω y v = ω·r. El período y la frecuencia solo aparecen en la «condición» de la idea 3.
6. **Punto 13: ningún ejercicio trae `datos`** (g = 10 m/s² y «sin aire» van en la pregunta; sen 37° y cos 37° no se
   dan), y «Ahora tú» repite en todas las ideas la misma cuenta de un paso. Nada llega a examen: no hay tiro
   horizontal, tiro desde una altura, 45°, ecuaciones x(t) e y(t), rpm, vueltas a radianes, transmisión, latitud ni
   ninguna de las ecuaciones del MCUV (4 preguntas de San Marcos).
7. **§5b: colores de la regla vieja.** Posiciones turquesa, v naranja, toda aceleración verde y t carmín: el verde de g
   va pegado al naranja de v en cada flecha y cada ecuación (protanopía: 0,010), y son otros colores que los de MRU y
   MRUV, las dos unidades de las que el alumno acaba de salir.
8. **Punto 7: lecturas con «·» entre igualdades** («x = 20,0 m · y = 15,0 m · vₓ = 14,1 m/s») y reglas que encadenan
   tres fórmulas con «·».
9. **Notación:** «y_máx» aquí y H en MRUV para la misma altura máxima (auditoría de MRUV, B5); «vᵧ» con gamma en dos
   ejemplos del glosario (molde §5); v, a y Δv sin flecha en el plano, donde sí son vectores.
10. Glosario: 14 términos, ninguno con `simple` y todos con un solo ejemplo. La cabecera dice «postulante de 4.º».
11. **Práctica repartida sin orden:** la escena `tiro-parabolico` mezcla el tiro con una pestaña «Ruedas»; su papel
    alterna problemas de los dos temas; `cinematica-medias` saca aquí `xy` (parabólico) y `latitud` (circular).

---

## 1. Las ideas, en orden

Propongo **once ideas en dos unidades**, como se hizo con MRU y MRUV (decisión 1). Seis temas del catálogo, 127 fichas
del banco, 280 problemas del compendio y 10 preguntas de San Marcos no caben en seis ideas sin que cada una cargue dos
o tres reglas, que es justo el defecto de hoy. Y son dos familias de problemas que no se pisan: la primera usa la caída
libre y las componentes (lo que viene de MRUV y de Vectores); la segunda, ángulos, vueltas y π.

- **A. «Movimiento parabólico»** conserva el id `fisica.movimiento-parabolico-y-circular` (el avance se guarda con él),
  la idea `un-reloj-dos-ejes` y las mesas `dos-sombras-3d` y `tiro-libre`.
- **B. «Movimiento circular»** es una unidad nueva, `fisica.movimiento-circular`. Recibe `arco-y-radian`,
  `rapidez-constante-acelera` y `dos-aceleraciones`, las mesas `rueda` y `giro` y once palabras del glosario;
  `Avance.migrar` (partición `partidoPC`) le pasa lo que el alumno ya hizo ahí, su visita y su «Ya la estudié».

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| **A** | | **Movimiento parabólico** | |
| A1 | `un-reloj-dos-ejes` | Tiro horizontal: dos movimientos | Lanzada de lado, la piedra avanza parejo y cae como si la soltaran: el tiempo de caída solo depende de la altura. |
| A2 | `velocidad-en-vuelo` (nueva) | La velocidad en cada instante | En el aire, vₓ no cambia y vᵧ gana 10 m/s cada segundo; juntas arman la velocidad, que es tangente a la trayectoria. |
| A3 | `tiro-oblicuo` (nueva) | Lanzar con ángulo | Con ángulo, v₀ se parte en v₀ₓ = v₀·cos θ y v₀ᵧ = v₀·sen θ: de lado es un MRU y hacia arriba, un lanzamiento vertical, con el mismo reloj. |
| A4 | `altura-y-alcance` (nueva) | Altura máxima y alcance | En la cima vᵧ = 0 y queda vₓ. La altura máxima sale de v₀ᵧ; el alcance, de v₀ₓ por el tiempo de vuelo: es máximo a 45°. |
| A5 | `ecuaciones-en-el-plano` (nueva) | Ecuaciones del movimiento en el plano | Con x(t) e y(t) se sabe dónde está en cada instante; la distancia al origen sale con Pitágoras, no sumando las coordenadas. |
| **B** | | **Movimiento circular** | |
| B1 | `arco-y-radian` | El ángulo girado y el arco | Un radián es el ángulo cuyo arco mide igual que el radio; una vuelta son 2π rad y el arco es s = θ·r, con θ en radianes. |
| B2 | `periodo-y-frecuencia` (nueva) | Período, frecuencia y velocidad angular | En el MCU cada vuelta tarda lo mismo, el período T; la frecuencia es f = 1/T y la velocidad angular, ω = θ/t = 2π/T. |
| B3 | `velocidad-tangencial` (nueva) | Velocidad tangencial y transmisión | En un mismo disco todos giran con la misma ω, pero el de más afuera va más rápido: v = ω·r. Una faja o una cadena iguala v. |
| B4 | `rapidez-constante-acelera` | Aceleración centrípeta | En el MCU la rapidez no cambia, pero la velocidad sí, porque gira: hay una aceleración hacia el centro, a_c = v²/r = ω²·r. |
| B5 | `mcuv` (nueva) | MCUV: el giro que acelera | Si ω cambia lo mismo cada segundo, α = Δω/Δt, ω = ω₀ + α·t y θ = ω₀·t + ½·α·t²: las del MRUV con otras letras. |
| B6 | `dos-aceleraciones` | Aceleración tangencial y total | En el MCUV hay dos aceleraciones perpendiculares: a_T = α·r cambia la rapidez y a_c = v²/r, la dirección; la total sale con Pitágoras. |

Los `aprendizaje` caben en el tope de 25 palabras (contadas con `Kit.palabras`, que parte «v₀·t» en sus letras). Los ids
de A1, B1, B4 y B6 se quedan; sus controles viejos viajan con las mesas (`tiro-libre`, `rueda`, `giro`) y los juegos
nuevos estrenan los suyos.

`pregunta` (Resumen): A1 «Si lanzas una piedra de lado, ¿tarda más en caer que si la sueltas?» · A2 «¿Con qué rapidez
llega al agua una piedra lanzada de lado?» · A3 «¿Qué parte de la rapidez de una pelota la hace subir?» · A4 «¿Con qué
ángulo llega más lejos el chorro de una manguera?» · A5 «¿Cómo se sabe dónde está un dron con dos ecuaciones?» ·
B1 «¿Cuántos radianes tiene una vuelta completa?» · B2 «Si un ventilador da 120 vueltas por minuto, ¿cuánto tarda en
cada una?» · B3 «En un carrusel, ¿quién va más rápido: el caballo de adentro o el de afuera?» · B4 «Si una moto da
vueltas siempre con la misma rapidez, ¿tiene aceleración?» · B5 «¿Cuánto gira un ventilador mientras arranca?» ·
B6 «¿Hacia dónde apunta la aceleración de algo que gira cada vez más rápido?».

`actividad`: A1 «Lanzar una piedra de lado desde una peña, sobre el lago.» · A2 «Elegir con qué rapidez sale la piedra
y mirar sus dos flechas al caer.» · A3 «Patear una pelota con distinto ángulo en la cancha del colegio.» · A4 «Inclinar
la manguera para regar una planta lejana.» · A5 «Programar el vuelo de un dron sobre las calles, con dos velocidades.» ·
B1 «Girar la rueda de la fortuna y medir el camino de tu cabina.» · B2 «Elegir cuánto tarda cada vuelta de la rueda de
la fortuna.» · B3 «Sentar a dos amigos en caballos distintos del carrusel.» · B4 «Dar vueltas al óvalo en moto y mirar
la flecha de la velocidad.» · B5 «Prender el ventilador del aula y contar cuánto gira.» · B6 «Arrancar el carrusel y
mirar las dos flechas de la aceleración.»

Glosario que estrena cada idea, con `simple` (tope de 30 por unidad): A1 tiro horizontal, trayectoria, alcance
horizontal, tiempo de vuelo · A2 velocidad horizontal, velocidad vertical, tangente (local: en trigonometría es otra
cosa) · A3 tiro parabólico, ángulo de lanzamiento, proyectil · A4 alcance máximo, ángulos complementarios, tiempo de
subida · A5 ecuación de la trayectoria, coordenada · B1 radián, desplazamiento angular, arco · B2 MCU, período,
frecuencia, velocidad angular · B3 velocidad tangencial, transmisión · B4 aceleración centrípeta, centrípeta ·
B5 MCUV, aceleración angular · B6 aceleración tangencial, aceleración total. «Parábola», «caída libre», «gravedad» y
«altura máxima» vienen de MRUV; «componente», de Vectores; «velocidad», «rapidez» y «MRU», de MRU: el lector las marca
«Lo viste en…».

**Por qué va cada una en su lugar y qué da por sabido**

- **A1. Tiro horizontal.** Es la raíz: separa los dos movimientos sin seno ni coseno, porque la velocidad de salida ya
  es toda «de lado». Usa el MRU (x = v·t, de A1 de MRU) y la caída desde el reposo (h = ½·g·t², B5 de MRUV, con la misma
  letra h, medida hacia abajo). Ataca P1 (71 % cree que la bala disparada tarda más que la soltada), P2 y P3 (Prescott
  y Mitchelmore 2005). Nivel examen: San Marcos 2026-II (82), el paquete que suelta una avioneta (P4) y la pared de
  enfrente.
- **A2. La velocidad en vuelo.** Necesita A1. Trae de Vectores las componentes y el módulo con Pitágoras: aquí la
  velocidad sí es un vector (v⃗, con flecha) y vₓ y vᵧ son sus componentes con signo. Ataca K3 y C1 llevados al plano
  (la aceleración es g hacia abajo en todo punto, no «hacia donde va»). Va antes del tiro con ángulo porque partir v₀
  en dos es la misma operación al revés. Nivel examen: rapidez y ángulo de llegada (37°, 45°, 53°), el instante en que
  la velocidad forma 45° y la mitad parabólica de San Marcos 2020-I (102).
- **A3. Lanzar con ángulo.** Necesita A2 (partir un vector) y el lanzamiento vertical (B6 de MRUV). sen y cos de 30°,
  37°, 45°, 53° y 60° van en `datos` como «convención del examen» (decisión de la etapa 2). La regla lleva la línea que
  traduce el eje al «±» de la academia. Nivel examen: San Marcos 2022 (85), el lanzamiento desde una azotea (ecuación de
  segundo grado, con la fórmula general en `datos`) y pasar el travesaño o la red.
- **A4. Altura máxima y alcance.** Necesita A3. Las «fórmulas prácticas» (H = v₀²·sen²θ/2g, R = v₀²·sen 2θ/g,
  tan θ = 4H/R) salen como resultado en «Mira»; en `datos` va la ecuación general (punto 13: la fórmula, no el atajo).
  Nivel examen: San Marcos 2026-I (89), ángulos complementarios (37° y 53°) y «al doble de rapidez, cuatro veces el
  alcance» (PR1, trampa 2).
- **A5. Ecuaciones en el plano.** Al final de A: es el tema «Movimiento en dos dimensiones» del catálogo (19 fichas) y
  reescribe todo lo anterior como x(t) e y(t). Usa la ecuación horaria de B2 de MRUV. Nivel examen: San Marcos 2025-I
  (81), leer v₀ₓ, v₀ᵧ y g de las dos ecuaciones y la ecuación de la trayectoria.
- **B1. Ángulo y arco.** Raíz de B. No pide `trigonometria.angulo-trigonometrico`: «Lee» presenta el radián desde cero
  (el arco que mide igual que el radio). Nivel examen: vueltas a radianes (la trampa de San Marcos 2024-II) y la rueda
  que rueda sin resbalar (lo que avanza es el arco).
- **B2. Período y frecuencia.** Necesita B1. Nivel examen: rpm a rad/s, las agujas del reloj y los encuentros en una
  pista circular (tipo C4 del compendio, 15 problemas).
- **B3. Velocidad tangencial.** Necesita B2. La transmisión entra aquí y no como idea aparte (decisión 5): es la misma
  regla, v = ω·r, mirando qué se iguala. Nivel examen: San Marcos 2024-I (79), con cos de la latitud en `datos`, y
  cadenas de tres ruedas (tipo C3, 23 problemas).
- **B4. Aceleración centrípeta.** Necesita B3 y la resta de vectores (Vectores). Ataca MC-A0 («rapidez constante,
  aceleración cero»), D9 (hacia afuera) y K3 (hacia adelante). Nivel examen: San Marcos 2020-I (102).
- **B5. MCUV.** Necesita B2 y las ecuaciones del MRUV. Es la idea con más preguntas de San Marcos (4). Nivel examen:
  las cuatro, más el n-ésimo segundo y la gráfica ω–t (el área es el ángulo girado).
- **B6. Aceleración total.** Al final: junta B4 y B5. Nivel examen: el tipo C9 del compendio (el instante o el ángulo
  girado en que a_T y a_c cumplen una razón; desde el reposo, a_c/a_T = 2θ, que sale como resultado y no como dato).

**Qué no entra:** el tiro sobre planos inclinados y los rebotes (8 fichas: solo un caso de nivel examen en A3, sin
idea propia); la resistencia del aire (una tarjeta de «Lee» en A1); la dinámica circular (fuerza centrípeta, peralte y
péndulo cónico son de `fisica.dinamica`); el centro instantáneo de rotación y las poleas móviles (tipo C7, 10
problemas, solo de la UNI: quedan como mesa); el giro combinado con el tiro (C5) se queda en su generador
`circular-giro-combinado`, que pide las dos unidades; y la forma vectorial con î y ĵ del MCU (C6) entra solo como
nivel examen de B4.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| A1 | **Una piedra lanzada de lado desde una peña, a orillas del lago**, con una balsa de totora en el agua | la flecha de salida = v₀; las piedras tenues = dónde estaba cada medio segundo; la regla del agua = x; la de la peña = h |
| A2 | **La misma piedra, con sus dos flechas** (de lado y hacia abajo) y la flecha que arman | flecha de lado = vₓ; flecha hacia abajo = vᵧ; la inclinada = la velocidad |
| A3 | **La pelota que patea el arquero en la cancha del colegio**, con el arco al fondo | el ángulo de la patada = θ; la flecha partida en dos = v₀ₓ y v₀ᵧ |
| A4 | **La manguera del jardinero de la plaza**, que riega una planta lejana | el chorro = la trayectoria; lo más alto = H; hasta donde cae = el alcance |
| A5 | **Un dron sobre las calles, visto desde arriba** (la pieza `fis-dron` de Vectores) | las calles cada 10 m = la cuadrícula; lo que avanza hacia el este y hacia el norte = x e y |
| B1 | **La rueda de la fortuna de la feria**, con tu cabina pintada | el camino de la cabina = el arco s; lo que giró = θ; del eje a la cabina = r |
| B2 | **La misma rueda con un reloj** | lo que tarda una vuelta = T; vueltas por minuto = la frecuencia |
| B3 | **El carrusel de la plaza, visto desde arriba**, con dos caballos | cada caballo con su radio y su flecha de velocidad |
| B4 | **Una moto que da la vuelta al óvalo** | la flecha de la moto = su velocidad, que gira con ella |
| B5 | **El ventilador de techo del aula**, que arranca | lo que gira cada segundo = ω; cuánto aumenta = α |
| B6 | **El carrusel que arranca**, con las dos flechas de la aceleración de un caballo | la flecha a lo largo del giro = a_T; la que va al centro = a_c |

Piezas: una pieza nueva `fis-tiro` para la unidad A (peña con lago y balsa, mesa, azotea, muro con caño, avioneta,
cancha y manguera), con la trayectoria, las marcas de cada medio segundo, sus dos sombras y las flechas; y en la fase 3
una pieza `fis-giro` para la unidad B (rueda de la fortuna, carrusel, ventilador, óvalo). Todo `data-prueba`, con su
prueba numérica de encuadre y rótulos (molde §6), para que decidas después cuáles reemplazas. La pieza `ejes` y
`fis-lienzo` quedan para las mesas viejas del laboratorio.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

Las lecturas van en ≤ 12 palabras y enuncian una relación, sin «·» entre dos igualdades.

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo | `bien` |
| --- | --- | --- | --- | --- | --- |
| A1 | «Lanzas una piedra de lado desde una peña de 45 m, a orillas del lago.» **Haz que caiga justo en la balsa, a 30 m de la peña.** | `v0` 5–15 m/s de 1 en 1; `t` automático | `v.v0 === 10` (10 m/s durante los 3 s de caída) | «Avanza 10 m cada segundo: cae al agua a 30 m.» | «¡En la balsa! De lado avanzó 10 m en cada segundo, sin frenarse.» |
| A2 | «La piedra sale de lado desde una peña de 20 m; mira sus dos flechas.» **Haz que llegue al agua bajando justo a 45°.** | `v0` 5–25 m/s de 5 en 5; `t` automático | `v.v0 === 20` | «De lado, 20 m/s; hacia abajo, 20 m/s.» (sin la rapidez total) | «Las dos flechas miden igual: por eso baja a 45°.» |
| A3 | «El arquero patea la pelota desde el piso; tú eliges la rapidez y el ángulo.» **Haz que la pelota tarde justo 4 s en volver al piso.** | `v0` 10–25 m/s de 5 en 5; `ang` 30°, 37°, 45°, 53°, 60°; `t` automático; sin flechas en vuelo | `v.v0 === 25 && v.ang === 53` (única) | «Sube con 20 m/s y avanza con 15 m/s.» | «Lo que sube es 20 m/s: 2 s de subida y 2 s de bajada.» |
| A4 | «La manguera lanza el agua a 10 m/s; a 30° riega justo una planta.» **Encuentra otro ángulo que riegue la misma planta.** | `ang` 15°–75° de 15 en 15 (inicio 30°); rapidez fija | `v.ang === 60` | «A 60° sube 3,75 m y cae a 8,66 m.» | «30° y 60° suman 90°: caen en el mismo sitio.» |
| A5 | «El dron sale de la plaza; cada segundo avanza lo mismo hacia el este y hacia el norte.» **Haz que pase justo sobre la antena, 30 m al este y 40 m al norte.** | `vx` 1–8 m/s; `vy` 1–8 m/s; `t` automático (0–10 s) | `v.vx * 4 === v.vy * 3` (dos soluciones: 3 y 4, 6 y 8) | «A los 5 s: 15 m al este y 20 m al norte.» (sin la distancia) | «x e y crecen a la vez: cada una con su velocidad.» |
| B1 | «La rueda de la fortuna tiene 8 m de radio; tu cabina parte de abajo.» **Gira la rueda hasta que el camino de tu cabina mida igual que el radio.** | `th` 0,25–6 rad de 0,25 en 0,25 | `v.th === 1` | «Giró 1 rad: el arco mide 1 radio, 8 m.» | «Ese ángulo es 1 radián: unos 57°.» |
| B2 | «La rueda de la fortuna gira pareja; tú eliges cuánto tarda cada vuelta.» **Haz que dé justo 3 vueltas en un minuto.** | `T` 10–60 s de 5 en 5; `t` automático | `v.T === 20` | «Una vuelta cada 20 s: 3 vueltas por minuto.» | «60 s ÷ 20 s = 3: más período, menos vueltas.» |
| B3 | «El carrusel da una vuelta cada 12 s; tus dos amigos eligen caballo.» **Haz que Ana vaya justo al doble de rápido que Beto.** | `ra` y `rb` 1–4 m de 0,5 en 0,5; `t` automático | `v.ra === 2 * v.rb` | «Ana, a 4 m del eje, recorre el doble que Beto, a 2 m.» | «Giran juntos, pero el de afuera hace un círculo más grande.» |
| B4 | «La moto da vueltas al óvalo, siempre a 10 m/s.» **Detén el reloj cuando su velocidad apunte justo hacia el norte.** | `t` 0–T de un octavo de vuelta (sin la flecha de la aceleración) | la moto en el punto este del óvalo | «Va a 10 m/s hacia el noreste.» | «La rapidez es la misma; la flecha ya giró un cuarto de vuelta.» |
| B5 | «El ventilador del aula se prende; cada segundo gira más rápido que el anterior.» **Haz que llegue a 12 rad/s justo a los 4 s.** | `w0` 0–8 rad/s de 2 en 2; `alfa` 0,5–3 rad/s² de 0,5 en 0,5; `t` automático | `v.w0 + 4 * v.alfa === 12` (cinco soluciones, como en B1 de MRUV) | «Gana 2 rad/s cada segundo: de 4 a 12 rad/s.» | «Subió 8 rad/s en 4 s: eso es α.» |
| B6 | «El carrusel arranca: un caballo a 2 m del eje gana 2 m/s cada segundo.» **Detén el reloj cuando sus dos aceleraciones midan lo mismo.** | `t` 0–2 s de 0,25 en 0,25 | `v.t === 1` | «A lo largo, 2 m/s²; hacia el centro, 2 m/s².» | «La de adentro crece con la rapidez; la otra no cambia.» |

Para que la predicción quede fuera de lo jugado: A1 tiene una sola piedra y la lectura no dice cuánto tarda; A2 no
muestra la rapidez total; A3 no dibuja flechas en vuelo; A4 tiene la rapidez fija; la lectura de A5 no da la distancia;
B1 no llega a la vuelta completa (6 rad); B3 no tiene cadena; B4 no dibuja la aceleración; B5 solo muestra ω, no el
ángulo girado; B6 solo muestra el arranque, no el giro parejo. Ningún `bien` dice la respuesta de su predicción, y la
leyenda no lleva los números que solo aparecen con la misión cumplida (`docs/teoria.md` 4f).

---

## 4. La predicción de cada idea

La app baraja las opciones; `datos` lleva solo valores y equivalencias, nunca la fórmula. Con datos medidos: P1 a P4
(Prescott y Mitchelmore 2005), C1 (Thornton y Sokoloff 1998), C2 (Viennot 1979) y K3 (Trowbridge y McDermott 1981). Las
trampas 2, 30 y 31 salen de las alternativas de San Marcos. Los códigos TP-, AN- y MC- ya estaban en la unidad como
hipótesis; los marcados «nuevo» también lo son. En la figura de la predicción, lo pedido va con «?» en tinta.

**A1.** «A la vez que lanzas tu piedra de lado, tu amiga suelta otra desde la misma peña. ¿Cuál llega primero al
agua?» Datos: las dos salen a la vez, desde 45 m de altura; sin resistencia del aire. Es la de hoy, con sus mismos ids.

| Opción | Qué mide |
| --- | --- |
| Llegan a la vez | Correcta |
| La que se soltó: recorre menos camino | Lo soltado cae antes que lo lanzado (P1; 40–71 %) |
| La lanzada: va más rápido | La rapidez de lado cambia el tiempo de caída (P2; 43 %; San Marcos 2026-II) |
| Depende de cuál pese más | El más pesado cae primero (C2) |

**A2.** «La piedra sale de lado a 15 m/s y tarda 2 s en llegar al agua. ¿Con qué rapidez llega?» Datos: g = 10 m/s²
(convención del examen): lo que cae gana 10 m/s cada segundo; sin resistencia del aire.

| Opción | Qué mide |
| --- | --- |
| 25 m/s | Correcta (15 de lado y 20 hacia abajo: 3-4-5) |
| 35 m/s | Suma las dos componentes como números (TP-SUMA, nuevo; es V1 de Vectores) |
| 20 m/s | Solo lo que ganó cayendo (TP-SOLO-VY, nuevo) |
| 15 m/s | «Sin aire, la rapidez no cambia» (TP-V-CONSTANTE, nuevo) |

**A3.** «La pelota sale a 25 m/s con 53°. En su punto más alto, ¿con qué rapidez se mueve?» Datos: sen 53° = 4/5 y
cos 53° = 3/5 (convención del examen); sin resistencia del aire.

| Opción | Qué mide |
| --- | --- |
| 15 m/s | Correcta (arriba queda la parte de lado) |
| 0: arriba se detiene un instante | Lleva la cima del lanzamiento vertical al plano (TP-CIMA-0, nuevo) |
| 25 m/s | La rapidez no cambia en el vuelo (TP-V-CONSTANTE) |
| 20 m/s | Toma la parte que sube (TP-COMPONENTE, nuevo) |

**A4.** «Si el agua sale de la manguera al doble de rapidez, con el mismo ángulo, ¿cuánto más lejos llega?» Datos: en
el juego, a 10 m/s y 30° llegó a 8,66 m; sin resistencia del aire.

| Opción | Qué mide |
| --- | --- |
| Cuatro veces más lejos | Correcta (el doble de vuelo y el doble de avance por segundo) |
| El doble | Doble rapidez, doble alcance (PR1-alcance, trampa 2, nuevo) |
| Igual: el ángulo no cambió | El ángulo decide solo dónde cae (TP-SOLO-ANGULO, nuevo) |
| Ocho veces | Eleva de más (PR-CUBO, nuevo) |

**A5.** «El dron sale de la plaza con x = 6t e y = 8t (en metros y segundos). ¿A qué distancia de la plaza está a los
5 s?» Datos: x es lo que avanzó hacia el este; y, hacia el norte; el este y el norte forman 90°.

| Opción | Qué mide |
| --- | --- |
| 50 m | Correcta (30 m y 40 m: Pitágoras) |
| 70 m | Suma las coordenadas (V1; San Marcos 2025-I) |
| 40 m | Da solo la coordenada mayor (2D-UNA, nuevo) |
| 14 m | Suma las dos velocidades y olvida el tiempo (2D-SIN-T, nuevo) |

**B1.** «La rueda da una vuelta completa. ¿Cuántos radianes giró?» Datos: en el juego, la rueda llegó hasta 6 rad sin
completar la vuelta.

| Opción | Qué mide |
| --- | --- |
| 2π rad, unos 6,28 | Correcta |
| 360 rad | Usa los grados como radianes (AN-GRADOS) |
| π rad, unos 3,14 | Media vuelta (AN-MEDIA, nuevo) |
| 1 rad | «Una vuelta, un radián» (AN-VUELTA; es la trampa de San Marcos 2024-II) |

**B2.** «Un ventilador da 120 vueltas por minuto. ¿Cuánto tarda en dar una vuelta?» Datos: 1 min = 60 s.

| Opción | Qué mide |
| --- | --- |
| 0,5 s | Correcta |
| 2 s | Da las vueltas por segundo como si fueran el período (MC-T-F, nuevo) |
| 120 s | Lee el número del enunciado (MC-LEE, nuevo) |
| 1/120 s | No pasa el minuto a segundos (U-MIN, nuevo) |

**B3.** «En una bicicleta, la cadena une el plato con el piñón; el plato tiene el doble de radio. Cuando el plato da
una vuelta, ¿cuántas da el piñón?» Datos: la cadena no resbala: avanza lo mismo sobre las dos ruedas.

| Opción | Qué mide |
| --- | --- |
| Dos vueltas | Correcta (la misma v en el borde: menos radio, más ω) |
| Una vuelta | Las dos giran igual, como los caballos del carrusel (MC-TR-W, nuevo) |
| Media vuelta | La proporción al revés (MC-TR-INV, nuevo) |
| Cuatro vueltas | Eleva al cuadrado (PR-CUADRADO, nuevo) |

**B4.** «La moto da vueltas al óvalo, siempre a 10 m/s. ¿Tiene aceleración?» Datos: su velocímetro marca siempre lo
mismo. Es la de hoy, con sus mismos ids; ahora el juego ya no dibuja la respuesta.

| Opción | Qué mide |
| --- | --- |
| Sí, hacia el centro del óvalo | Correcta |
| No: su rapidez no cambia | Rapidez constante, aceleración cero (MC-A0; trampa 30, San Marcos 2020-I) |
| Sí, hacia afuera del óvalo | Lo que siente quien va dentro (D9) |
| Sí, hacia adelante, como su velocidad | La aceleración va hacia donde se mueve (K3) |

**B5.** «El ventilador arranca del reposo y acelera parejo: en el primer segundo gira 2 rad. ¿Cuánto gira en los
primeros 3 s?» Datos: cada segundo, su velocidad angular aumenta lo mismo.

| Opción | Qué mide |
| --- | --- |
| 18 rad | Correcta (nueve veces: θ crece con t²; San Marcos 2025-II) |
| 6 rad | Triple de tiempo, triple de giro (PR1-giro, trampa 2, nuevo) |
| 10 rad | Suma lo del tercer segundo y olvida el segundo (MC-ENESIMO, nuevo) |
| 12 rad | Suma 2 + 4 + 6: toma ω como ángulo (MC-W-ANGULO, nuevo) |

**B6.** «Después de arrancar, el carrusel gira parejo, sin ir más rápido ni más lento. ¿Qué aceleración le queda a un
caballo?» Datos: su rapidez ya no cambia; sigue dando vueltas.

| Opción | Qué mide |
| --- | --- |
| Solo la que va hacia el centro | Correcta |
| Solo la que va a lo largo del giro | Confunde cuál cambia la rapidez (MC-SOLO-AT) |
| Las dos, como al arrancar | No ve que a_T mide el cambio de rapidez (MC-DOS, nuevo) |
| Ninguna: va parejo | Rapidez constante, aceleración cero (MC-A0-b: se parte MC-A0 para que dos predicciones no lleven el mismo código) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en las dos unidades | Aviso |
| --- | --- | --- |
| x, y | Posición de lado (desde el pie de donde sale) y altura (hacia arriba, desde el piso) | En A1 y A2 no se usa y: lo que cae es h |
| h | Lo que ha caído algo, medido hacia abajo desde donde salió (A1, A2), positivo | La misma h de B5 de MRUV. La altura de la peña o de la azotea va en palabras |
| H | Altura máxima (A3, A4) | La misma de B6 de MRUV; se va «y_máx» |
| R | Alcance horizontal al volver a la altura de salida (A4) | En A1 a A3 el alcance va en palabras (es la x donde cae). **R no es un radio:** el radio es r |
| t | Tiempo desde que sale; t_v, tiempo de vuelo; t_s, tiempo de subida | Subíndices de verdad |
| v⃗ | La velocidad, con flecha: en el plano sí es un vector (A2 en adelante) | En MRU y MRUV iba sin flecha porque era una recta; «Lee» de A2 lo avisa |
| v, v₀ | Rapidez (el módulo de v⃗) y rapidez de salida | — |
| vₓ, vᵧ, v₀ₓ, v₀ᵧ | Componentes con signo de la velocidad (sin flecha); vᵧ positiva hacia arriba | Con `{ sub }`, nunca «ᵧ» en texto plano |
| g | Módulo de la aceleración de la gravedad: 10 m/s² en los problemas | Con el eje hacia arriba, a_y = −g |
| θ | Ángulo de lanzamiento, sobre la horizontal (A3, A4); ángulo girado, en radianes (unidad B) | Dos unidades distintas; en cada una, un solo significado |
| s | Arco que recorre un punto (B1) | — |
| r | Radio del giro, del eje al punto | R queda libre para el radio de la Tierra en el caso de la latitud (B3), con aviso |
| ω, ω₀ | Velocidad angular, en rad/s | La academia escribe también «rpm» y «rev/s»: se pasan a rad/s |
| T | Período | **Choca con la T de «tangencial»:** por eso la aceleración tangencial es a_T con subíndice, nunca T sola |
| f | Frecuencia, en Hz o vueltas por segundo | — |
| N | Número de vueltas (B1, B5) | La academia usa n; aquí N para no chocar con el n-ésimo segundo |
| α | Aceleración angular, en rad/s² | En A3 el ángulo es θ, nunca α |
| a_c, a_T, a | Aceleración centrípeta, tangencial y total | La academia escribe a_cp y a_t; se queda a_c (la de hoy) y la T mayúscula, para que no se lea «a por t» |
| î, ĵ | Vectores unitarios (nivel examen de A2, A5 y B4) | Vienen de Vectores |
| m, s, m/s, m/s², km/h, rad, rad/s, rad/s², rpm, Hz, ° | Unidades | Todo número lleva la suya; los ángulos en grados llevan «°» |

---

## 6. Mapa de colores por magnitud (§5b)

Los mismos de MRU y MRUV (el alumno viene de ahí), y los mismos en las dos unidades nuevas.

| Token | Magnitud | Por qué |
| --- | --- | --- |
| `o` naranja | **Velocidad y rapidez:** v⃗, v, v₀, vₓ, vᵧ y sus flechas; en la unidad B, también ω | Como en MRU y MRUV. ω es la velocidad del giro |
| `i` turquesa | **Tiempo:** t, t_v, t_s, T, los rótulos «0,5 s, 1 s…» y el reloj | Como en MRU y MRUV |
| `f` violeta | **Posición y lo que se mide en metros o en radianes de giro:** x, y, h, H, R, el alcance, las marcas de las sombras; en B, s y θ | Es lo que más se pide. θ girado es la «posición» del giro |
| `h` carmín | **Aceleración:** g, a_c, a_T, a, α y sus flechas (de punta abierta, como en MRUV) | Como en MRU y MRUV |
| tinta | El **ángulo de lanzamiento** θ con su arco y su «°», el radio r, la frecuencia f, N, la piedra, la peña, el agua, los ejes y lo que se pide en una figura («?») | Ver abajo |
| `d` verde | No se usa | Iría junto al naranja de v (protanopía: 0,010) |

- **El ángulo de lanzamiento va en tinta, no en carmín.** El molde reserva el carmín para los ángulos, pero las dos
  unidades hermanas ya lo usan para la aceleración, y en esta unidad g aparece en todos los ejercicios. Un ángulo
  siempre lleva su arco, su letra y su «°», así que no necesita color para distinguirse (decisión 3).
- **vₓ y vᵧ comparten el naranja** (son la misma magnitud). Las separan el subíndice y la dirección de su flecha, que
  además va discontinua cuando es una componente y continua cuando es la velocidad entera.
- **x, y y h comparten el violeta.** Las separan la letra y la regla donde se leen (la del piso o la de la pared).
- Ninguna figura de Predice ni de un ejemplo delata la respuesta por su color: lo pedido va con «?» en tinta.
- Se corrigen también los colores de las mesas viejas que se quedan (`tiro-libre`: posiciones en violeta y t en
  turquesa) cuando se rehagan sus ideas; hasta entonces las ideas sin rehacer conservan los suyos, como pasó con MRUV.

| Idea | Naranja | Turquesa | Violeta | Carmín | Tinta |
| --- | --- | --- | --- | --- | --- |
| A1 | v₀ y su flecha | t, «0,5 s…» | x, h, la altura de la peña, el alcance | g (solo en fórmulas) | piedra, peña, balsa |
| A2 | vₓ, vᵧ, v⃗ | t | h | g y su flecha | el ángulo de llegada |
| A3 | v₀, v₀ₓ, v₀ᵧ | t, t_v | x, y | g | θ |
| A4 | v₀ | t_v, t_s | H, R | g | θ, la manguera |
| A5 | vₓ, vᵧ | t | x, y, la distancia | a (si la hay) | las calles |
| B1 | — | — | s, θ | — | r, la rueda |
| B2 | ω | T, t | θ | — | f, N |
| B3 | v, ω | T | s | — | r |
| B4 | v⃗ | t | — | a_c | r |
| B5 | ω, ω₀ | t | θ | α | N |
| B6 | v | t | — | a_T, a_c, a | r |

---

## 7. Práctica: qué existe y qué falta por idea

Lo que hay:
- **`plantillas/tiro-parabolico/`** (escena, 0.2.0): el motor `proyectil` sirve para todo generador nuevo de A. Su
  pestaña «Ruedas» es de B. Papel de 10: p2 (A1), p3 y p4 (A3 y A4), p5 (A4), p6 (A1, la avioneta), p9 (A3, desde la
  azotea); p1, p7, p8 y p10 son de B.
- **`plantillas/movimiento-circular/`** (escena, 0.2.0, cinco pestañas, 45 casos): entera de B.
- **Nueve generadores `circular-*`**, todos de B: `circular-mcu` (B1, B2 y B4: rpm, radianes, a_c y puntos del mismo
  disco), `circular-encuentros` (B2), `circular-transmision` (B3), `circular-mcuv`, `circular-enesimo-segundo`,
  `circular-horaria` y `circular-grafica` (B5), `circular-aceleracion-total` (B6) y `circular-giro-combinado` (B6: el
  giro con un tiro). Traen `datos`, pero ninguno separa sus tipos por idea.
- **`plantillas/cinematica-medias/`**: `xy` es de A5 y `latitud` de B3.
- **Mesas:** `dos-sombras-3d` y `tiro-libre` (A1 hoy; `tiro-libre` pasará a A4), `rueda` (B1) y `giro` (B4).
- **Prueba del curso:** ningún par de estas dos unidades.

| Idea | Hay | Falta |
| --- | --- | --- |
| A1 tiro horizontal | papel p2 y p6 de `tiro-parabolico`; mesa `dos-sombras-3d` | generador: tiempo de caída (P2), alcance, v₀, altura, la pared, la avioneta; papel con `datos` |
| A2 velocidad | nada | generador: rapidez y ángulo de llegada, instante de 45°, V/F de la velocidad (2020-I) |
| A3 con ángulo | papel p3, p4 y p9; el «Ahora tú» de hoy (vuelo, altura, alcance) | generador: componentes, vuelo con el avance (2022), desde una azotea, pasar el travesaño |
| A4 altura y alcance | papel p5; mesa `tiro-libre` | generador: 45° (2026-I), complementarios, doble rapidez (PR1) |
| A5 ecuaciones | `cinematica-medias` `xy` y su papel p7 | `datos` por línea; ecuación de la trayectoria; ítem de prueba |
| B1 ángulo y arco | `circular-mcu` (vueltas); mesa `rueda` | tipos por idea; vueltas a radianes; la rueda que rueda |
| B2 período | `circular-mcu` (omega), `circular-encuentros` | tipos por idea; rpm, el reloj |
| B3 tangencial | `circular-mcu` (v, rigido), `circular-transmision`, `cinematica-medias` `latitud` | tipos por idea |
| B4 centrípeta | `circular-mcu` (acp); mesa `giro` | V/F de la velocidad (2020-I); forma vectorial |
| B5 MCUV | `circular-mcuv`, `-enesimo-segundo`, `-horaria`, `-grafica` | tipos por idea; frenado con vueltas (2024-II) ya está en `circular-mcuv` |
| B6 total | `circular-aceleracion-total`, `circular-giro-combinado` | tipos por idea |

Propuesta: un generador nuevo `plantillas/fis-parabolico/`, de formato `predicciones`, con los tipos separados por idea
(A1 a A5) y nivel 1 a 3, que llame al motor de `tiro-parabolico` (no lo copia), con `datos` por línea, prueba en 400
semillas, `casos.json` verificado aparte y papel de 2 por idea. Para B no hace falta generador nuevo: los nueve
`circular-*` se quedan, con un índice `TIPOS_POR_IDEA` en cada uno y sus colores pasados a los de la unidad. Las dos
escenas van a «Más mesas del tema» (`"rehacer": true`); `tiro-parabolico` sirve a las dos unidades hasta que se parta
su pestaña «Ruedas». La prueba del curso necesita un par por unidad nueva.

En la fase 2 se hizo solo lo que la partición exige: las diez plantillas del giro (también `circular-giro-combinado`)
apuntan a `fisica.movimiento-circular`; la escena `tiro-parabolico` sirve a las dos y ya va a «Más mesas del tema»
(`"rehacer": true`); `cinematica-medias` separa `xy` (A) de `latitud` (B), y `nucleo/repaso-tipos.js` reparte el papel de
`tiro-parabolico` (p2 a p6 y p9 para A; p1, p7, p8 y p10 para B).

---

## 8. Datos del mundo

Casi todo es de problema y tiene que ser posible (punto 10): una piedra lanzada a mano entre 5 y 20 m/s; una pelota
pateada entre 10 y 25 m/s («se lanza» por encima de eso, regla de la auditoría de MRUV); peñas y azoteas de 20, 45 u
80 m; una avioneta a unos 180 km/h; el agua de una manguera a unos 10 m/s; una rueda de la fortuna de 8 m de radio que
da una vuelta en 20 a 60 s; un carrusel de 4 m de radio con una vuelta cada 12 s; un ventilador de techo a 120–300 rpm.

| Dato | ¿Fuente? |
| --- | --- |
| g: unos 9,8 m/s²; en los problemas, 10 m/s² | Valor de libro. En `datos`: «g = 10 m/s² (convención del examen)», como en MRUV |
| sen y cos de 37° y 53° (3/5 y 4/5) | «Convención del examen», como en Razones trigonométricas y en Vectores |
| El lago, la peña y la balsa de totora del juego | Sin medidas reales: «una peña de 45 m a orillas del lago». No se nombra un lugar |
| Arco de fútbol: 2,44 m de alto y 7,32 m de ancho; punto penal a 11 m | IFAB, Reglas de Juego, regla 1. Se comprueba en la fuente antes de escribirlo (para A3) |
| Red de vóley: 2,43 m (varones) y 2,24 m (damas) | FIVB, Reglas Oficiales de Voleibol. Igual: se comprueba antes de usarlo |
| La Tierra da una vuelta en 24 h; su radio mide unos 6400 km | Valores de libro, con «unos» (B2 y B3) |
| Latitud de Juliaca: unos 15,5° sur | **No usar** sin fuente (IGN o SENAMHI); el caso de la latitud usa 37°, 53° y 60°, como el examen |
| Segundero, minutero y horario: una vuelta en 60 s, 60 min y 12 h | Definición; sin fuente |
| Historia: Galileo y la trayectoria parabólica (1638) | Ya trae fuente (Museo Galileo); se queda en A. La frase de Huygens se va con B y necesita su propia fuente antes de mostrarse (MacTutor la tiene en la matriz) |

## 8b. Orden con otras unidades (`requiere`)

- **A** requiere `fisica.mruv-y-caida-libre`, como hoy (caída libre, lanzamiento vertical, ecuación horaria). Vectores
  (componentes, Pitágoras) y Razones trigonométricas (sen y cos de un ángulo) llegan por la cadena.
- **B** requiere `fisica.mruv-y-caida-libre` (el MCUV es su análogo). **No** requiere A: quien quiere ir directo a
  ruedas y ventiladores puede. Consejo de otro curso, que no cierra: `trigonometria.angulo-trigonometrico` (radianes);
  B1 los presenta igual.
- **Hay que mover tres requisitos:** `fisica.gravitacion` (órbitas), `fisica.oscilaciones` (el círculo de referencia
  del MAS) y `fisica.magnetismo` (la carga que gira en un campo) piden hoy `fisica.movimiento-parabolico-y-circular` y
  lo que usan es el movimiento circular: pasan a pedir `fisica.movimiento-circular`. `fisica.dinamica` no pide ninguna
  de las dos y enseña dinámica circular: se le agrega B como consejo cuando se rehaga.
- En el mapa: MRUV y caída libre → Movimiento parabólico y Movimiento circular (en paralelo) → Estática…
- El catálogo gana una unidad (Física pasa de 22 a 23). A queda con los temas «Movimiento en dos dimensiones» y «Tiro parabólico»; B,
  con «Magnitudes angulares», «MCU», «MCUV» y «Aceleración tangencial y centrípeta». UNI: las dos en la semana 3. San
  Marcos: las dos en el tema 4.
- **Costo:** once ideas con 15 ejemplos cada una (165), once juegos con objeto y dos piezas nuevas.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **La unidad se parte en dos:** «Movimiento parabólico» (A1–A5, conserva `fisica.movimiento-parabolico-y-circular`)
   y «Movimiento circular» (B1–B6, unidad nueva `fisica.movimiento-circular`, con el avance migrado por la partición
   `partidoPC`). *Motivo:* 10 preguntas de San Marcos y dos familias de problemas que no comparten ni letras ni
   herramientas; con seis ideas cada una cargaba dos reglas. *Descartada:* una sola unidad de siete ideas con
   `septimaIdea` (tiro horizontal, tiro con ángulo, altura y alcance, ángulo y arco, MCU, MCUV y aceleraciones): se
   perdían A2, A5, B2 y B3, y B5, la más preguntada, quedaba sin sitio para sus cuatro tipos.
2. **A1 es el tiro horizontal y se queda con el id `un-reloj-dos-ejes`.** *Motivo:* separa los dos movimientos sin
   seno ni coseno, y la predicción de hoy (la soltada contra la lanzada) ya era de tiro horizontal: se conserva con sus
   mismos ids de opción, así que la predicción guardada de quien ya la respondió sigue valiendo. *Descartada:* empezar
   por el tiro con ángulo, como hoy, que obliga a partir v₀ antes de entender por qué se parte.
3. **Colores: los de MRU y MRUV, con el ángulo de lanzamiento en tinta.** Velocidad naranja, tiempo turquesa,
   posición (x, y, h, H, R, s y θ girado) violeta, aceleración (g, a_c, a_T, α) carmín, sin verde. *Motivo:* el alumno
   viene de dos unidades con esos colores. *Descartada:* θ en carmín como pide la tabla del molde, que lo dejaba con el
   mismo color que g en la misma figura.
4. **En el plano, la velocidad lleva flecha (v⃗) y sus componentes no.** *Motivo:* aquí sí es un vector (molde §5);
   vₓ y vᵧ son números con signo, como en Vectores. «Lee» de A2 avisa el cambio respecto de MRU y MRUV. *Descartada:*
   seguir sin flechas, que deja sin nombre a la suma vₓ con vᵧ.
5. **La transmisión (fajas, cadenas, engranajes) va dentro de B3, no como idea aparte.** *Motivo:* es v = ω·r mirando
   qué se iguala, y B ya tiene seis ideas. *Descartada:* séptima idea con `septimaIdea` (23 problemas del compendio la
   justificarían si en la fase 3 la regla de B3 no cabe en 30 palabras).
6. **Las fórmulas prácticas (tiempo de vuelo, H, R = v₀²·sen 2θ/g, tan θ = 4H/R, a_c/a_T = 2θ) no van en `datos`.**
   Salen como resultado en «Mira»; en `datos` va la ecuación general. *Motivo:* punto 13 y la misma decisión de MRUV.
   *Descartada:* darlas como dato, que vuelve el ejercicio un reemplazo.
7. **Letras:** h es lo que cae (como en B5 de MRUV), H la altura máxima (se va «y_máx»), R el alcance y r el radio; la
   aceleración tangencial es a_T y el período T; el número de vueltas es N. *Descartada:* a_t y a_cp de la academia
   (a_t se lee «a por t»).
8. **Objetos de prueba:** la peña con el lago y la balsa de totora, la cancha, la manguera de la plaza, el dron, la
   rueda de la fortuna de la feria, el carrusel, la moto en el óvalo y el ventilador del aula. Los dibuja la sesión en
   `fis-tiro` (hecha en la fase 2) y `fis-giro` (fase 3); tú decides cuáles reemplazas. *Descartada:* seguir con el
   pabellón del colegio de MRUV (5 m de techo dan 1 s de vuelo: muy poco para ver cuatro marcas).
9. **Tres predicciones cambian porque su juego las mostraba** (B1, B4 en su juego, B6) y dos se conservan con sus ids
   (A1 y B4). Las ideas que conservan id con otra predicción (`arco-y-radian` y `dos-aceleraciones`) vuelven a
   preguntarla: la partición borra una vez las predicciones guardadas sin huella, como se hizo con MRU. Eso se activa
   en la fase 3, cuando esas ideas se reescriban; hoy siguen con su predicción vieja.
10. **Práctica:** generador nuevo `fis-parabolico` para A; para B se quedan los nueve `circular-*` con sus tipos
    separados por idea. Las dos escenas van a «Más mesas del tema». *Descartada:* un generador `fis-circular` nuevo
    que duplicaría 45 casos ya verificados.
11. **Requisitos:** Gravitación, Oscilaciones y Magnetismo pasan a pedir Movimiento circular en vez de la unidad
    vieja (hecho en la fase 2, en `catalogo/cursos/fisica.json`). B no pide A.
12. **Códigos nuevos como hipótesis** (TP-SUMA, TP-SOLO-VY, TP-V-CONSTANTE, TP-CIMA-0, TP-COMPONENTE, PR1-alcance,
    TP-SOLO-ANGULO, 2D-UNA, 2D-SIN-T, AN-MEDIA, MC-T-F, MC-TR-W, MC-TR-INV, MC-ENESIMO, MC-W-ANGULO, MC-DOS y los de
    «Ahora tú» de A1: TP-SIN-MEDIO, TP-RAIZ, TP-VT, TP-ALTURA, TP-POR, TP-VY, TP-CAIDA, TP-PISO y TP-RESTA), y MC-A0
    partido en MC-A0 y MC-A0-b. Se anotan en el informe de
    cinemática al cerrar la unidad.

**Lo que se hizo en la fase 2 (19 nov):** la unidad partida con su migración y su prueba; la unidad B con el contenido
viejo movido tal cual; la unidad A con la idea A1 completa (Lee, Juega con misión, Predice, Mira, La regla, Así se
resuelve, Ahora tú, glosario y 15 ejemplos) y, a la espera de la fase 3, el contenido viejo del tiro con ángulo
reacomodado como idea `tiro-oblicuo` (con la predicción de A3 de esta propuesta); la pieza `fis-tiro` con su prueba; y
las cuentas de A1 rehechas aparte (una simulación paso a paso, sin las fórmulas).

**Lo que queda para la fase 3:** las ideas A2 a A5 y B1 a B6 con el método, la pieza `fis-giro`, el generador
`fis-parabolico`, los tipos por idea de los `circular-*`, un par de la prueba del curso por unidad, el lector en frío,
la auditoría y `calidad: 2`. Y un arreglo de datos que no se tocó por ser un archivo compartido: reclasificar en
`docs/datos/admision-unmsm.csv` (y rehacer sus tablas) las cinco preguntas de movimiento circular y la conceptual de
2020-I a `fisica.movimiento-circular`.

**Lo que se hizo en la fase 3, parte A (19 nov):** las ideas A2 a A5 con el método (Lee, Juega con misión, Predice,
Mira, La regla, Así se resuelve, Ahora tú, glosario y 15 ejemplos cada una), con los objetos, misiones y predicciones de
§2 a §4; la idea A3 reemplaza el contenido viejo del tiro con ángulo. La pieza `fis-tiro` creció para A2 a A5 (flechas
de la velocidad, el ángulo, la manguera, el reloj y el dron visto desde arriba). La práctica nueva es
`plantillas/fis-parabolico/` (17 tipos repartidos por idea, del nivel 1 al de examen, 19 casos verificados aparte y 8
problemas de papel); `tiro-parabolico` queda en «Más mesas del tema». Dos pares nuevos para la prueba del curso
(`fis-23` tiempo de caída con la rapidez de lado de sobra, `fis-24` distancia al origen con x(t) e y(t)) van a la
reserva: las formas ya tienen 10 pares. Los códigos nuevos están en `docs/investigacion/cinematica-ideas-erroneas.md`,
«Movimiento parabólico (19 nov)».

Decisiones nuevas de la fase 3 (Gerson revisa después):

13. **En A2 la velocidad vertical se mide hacia abajo; desde A3, hacia arriba.** *Motivo:* A2 sigue al tiro horizontal,
    donde lo que cae (h) ya se mide hacia abajo; con ángulo, sube y baja, y el eje hacia arriba es el de MRUV. Cada
    regla lo dice en su condición. *Descartada:* el eje hacia arriba desde A2, con vᵧ negativa en todo el tiro horizontal.
14. **Rapideces de problema:** las piedras lanzadas a más de 20 m/s se lanzan con una huaraca (honda); las pelotas
    pateadas no pasan de 25 m/s. *Descartada:* pelotas «lanzadas» a 40 m/s, imposibles a mano.
15. **El código de «sumar las coordenadas» es 2D-SUMA**, no V1: no hay informe de Vectores con ese código. Queda como
    hipótesis en el informe de cinemática.
16. **La rapidez del dron se elige con dos controles «Al este» y «Al norte» (m/s)**, sin «vᵧ» en la etiqueta: los
    controles son texto plano y no tienen subíndice de verdad.

## Cambios de la parte B (19 nov)

Lo que cambió respecto de la parte B al escribir las seis ideas de «Movimiento circular» (fase 3; Gerson revisa
después). El guion de arriba no se tocó.

1. **N (las vueltas) va en violeta, como θ**, y no en tinta (tabla del §6). *Motivo:* es el mismo ángulo girado
   contado en vueltas; con otro color, «10 vueltas» y «20π rad» parecían dos magnitudes. La frecuencia f, el radio r,
   R y la latitud siguen en tinta.
2. **El radián se presenta como herramienta**, en una tarjeta de «Lee» de B1 que recuerda la pita de Trigonometría.
   El glosario de Física conserva «radián» (el glosario es por curso y el avance viejo lo trae con esa clave), sin
   decir cuántos radianes tiene una vuelta (es la predicción de B1).
3. **Cuatro palabras nuevas en el glosario:** arco (B1), transmisión (B3), cambio de velocidad (B4, para que B4 estrene
   dos palabras: «centrípeta» es una forma de «aceleración centrípeta») y aceleración total (B6). Quedan 15 de 30. Sus
   claves se agregaron a la lista de `partidoPC` en `nucleo/avance.js` (inofensivo: la unidad vieja no las tenía).
   «Aceleración centrípeta» se define sin decir hacia dónde apunta (es la predicción de B4).
4. **B4 conserva su pregunta y sus ids de opción** (c, cero, afuera, adelante), con la moto en el óvalo en lugar del
   carrito: la predicción guardada sigue valiendo. Su juego ya no dibuja la aceleración.
5. **B5: la actividad es «ver cómo sube su ω»**, no «contar cuánto gira»: el juego muestra ω y no el ángulo (así queda
   fuera de lo jugado la predicción de los 18 rad). El distractor «10 rad» es lo del tercer segundo solo y «12 rad»,
   la suma 2 + 4 + 6.
6. **B6: la flecha de la velocidad no se dibuja junto a a_T** (van en la misma línea y se tapaban); la rapidez va
   escrita arriba. En los ejemplos, las flechas de la aceleración no van a escala: muestran qué partes hay y lo pedido
   va con «?».
7. **Las mesas `rueda` y `giro` se rehicieron con `fis-giro`** (antes eran `fis-lienzo`), con los mismos ids, controles
   y retos, y con los colores de la unidad.
8. **Tipos por idea de los nueve `circular-*`** (`TIPOS_POR_IDEA`, `generar(semilla, { idea })`): `circular-mcu` reparte
   vueltas (B1), ω (B2), rapidez, puntos de un disco y latitud (B3) y a_c (B4); `circular-encuentros` es de B2 salvo su
   tipo `mcuv` (B5); `circular-transmision`, de B3 salvo `alfa` (B5); `circular-horaria`, de B5 salvo `acp` (B6).
   **`circular-giro-combinado` va a B2 y no a B6** como decía el §7: sus balas y plataformas se resuelven con θ = ω·t,
   no con aceleraciones. Además, los nueve generadores dan ahora sus `datos` por tipo (fórmulas y equivalencias, sin
   el paso hecho) y su papel se regeneró con ellos; antes no traían ninguno.
9. **La latitud (`cinematica-medias`, lado B)** usa los colores de la unidad (la rapidez en naranja; R, r y λ en tinta)
   y su papel p8 trae `datos`. Las latitudes de Juliaca, Arequipa, el Cusco, Tacna y Lima se quedan redondeadas al grado
   como valores aproximados («a unos 16°»): el §8 pedía no usar la de Juliaca sin fuente; con «unos» y el redondeo
   (15° 30′ S) es un valor de libro, no un dato puntual.
10. **Prueba del curso:** las formas ya tienen 10 pares, así que los dos de esta unidad van a la reserva: `fis-25` (el
    frenado con vueltas, San Marcos 2024-II) y `fis-26` (a_c al doble de rapidez en la misma pista), los dos de la
    plantilla `movimiento-circular`, con su verificador.
