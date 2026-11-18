# Propuesta de ideas: «MRU, MRUV y caída libre» (`fisica.movimiento-rectilineo`)

Etapa 4 del plan de calidad, rama «Mecánica» (la de entrada de Física), la unidad que sigue a «Vectores» · fase 1
(`docs/metodo/unidad/1-ideas.md` §A) · 18 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9), cada una con mi recomendación. Las que más pesan son la 1 (partir la
unidad en dos), la 2 (signos con eje o «±» de academia) y la 4 (colores).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md` entero (§3, §4, §5, §5b y §11),
`docs/metodo/unidad/LEEME.md` y `1-ideas.md` §A, `docs/etapa2/decisiones.md` («Cambios posteriores»),
`docs/etapa3/decisiones.md` (las cinco rondas), `docs/etapa3/propuesta-geometria.md` y `propuesta-algebra-exponentes.md`
como modelo, la teoría actual (`contenido/teoria/fisica/movimiento-rectilineo.js`, v0.2.0), su ficha en
`catalogo/cursos/fisica.json`, sus tres plantillas (`plantillas/mruv/`: motor, 18 casos, papel, escena y la lección
POGIL v2; `plantillas/cinematica-medias/` y `plantillas/velocidad-relativa/`: generadores, casos y papel), el informe
`docs/investigacion/cinematica-ideas-erroneas.md` (K1–K4, G1–G4, C1–C2), los códigos PR y U de
`docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md`, las trampas 2, 10, 12 y 32 de
`docs/clasificacion/trampas-admision-unmsm/fisica.md`, el banco Cuzcano (`docs/clasificacion/banco-cuzcano.md`),
`docs/temario-completo.md` (unidad 2), la sección 7.5 de `docs/pogil-v2-rive.md`, la matriz
`docs/teoria/matriz/fisica.json` (unidad 2), los pares fis-01 y fis-02 de `catalogo/pruebas/fisica.json`, las 20
preguntas de la unidad en `docs/datos/admision-unmsm.csv`, las taxonomías de la UNI y San Marcos, y como nivel de lo ya
terminado `vectores.js` y `magnitudes-y-vectores.js` (con su auditoría en `rutinas/auditoria/fisica.vectores.md`) y las
piezas `pista`, `torre`, `fis-combi`, `fis-objeto` y `fis-fuerzas`.

## Qué se pregunta en los exámenes

- **UNI:** semanas 1 y 2 del CEPRE-UNI 2026-2: «Cinemática en 1D: MRU, MRUV, caída libre, gráficas»
  (`docs/taxonomia-uni-2026.md`). En el repo no hay preguntas de la UNI clasificadas.
- **San Marcos la parte en dos temas** del CEPRE-UNMSM 2026-I (`docs/taxonomia-unmsm-2026.md`): tema 2, «MRU, gráficas,
  velocidad relativa» (junto con vectores), y tema 3, «MRUV, gráficas x-t, v-t y a-t, caída libre». Esa partición es la
  que propongo en la sección 1.
- **Banco Cuzcano:** unas 250 fichas, la unidad más grande de física. Caída libre 54; encuentros y alcances 38 (24 en
  cinemática I y 14 en gráficas); velocidad relativa 27; MRUV 23; MRU 21; gráficas de v y a 20; gráficas x–t 16;
  rapidez y velocidad media 13; aceleración media 7; sonido y eco 7; encuentros en caída libre 7; recta y parábola como
  gráficas 7; movimiento con aceleración variable 5.

**En la admisión real de San Marcos (2019-I a 2027-I) hay 20 preguntas de esta unidad**, más que de cualquier otra de
física. Ocho son de gráficas o de ecuación horaria; la caída libre, que es lo que más trae el banco, sale una sola vez.

| # | Periodo (pregunta) | Qué piden | Trampa (de la clave o la alternativa) | Idea |
| --- | --- | --- | --- | --- |
| 1 | 2019-I (107) | Velocidades con signo de dos móviles que van en sentidos opuestos, leídas como pendientes de dos rectas x–t | Leer mal la pendiente o perder el signo | A2 |
| 2 | 2019-II (80, 9 mar) | Distancia de frenado de un auto con desaceleración constante, con la rapidez en km/h | No convertir km/h a m/s (U1) | B2 |
| 3 | 2019-II (104, 10 mar) | Rapidez media de un recorrido en dos tramos de tiempo | Promediar las rapideces (trampa 10) | A3 |
| 4 | 2019-II (105, 10 mar) | Diferencia de tiempos de caída de dos esferas de distinta masa y altura | Creer que la más pesada cae más rápido (C2) | B5 |
| 5 | 2020-I (105, 14 set) | Desplazamiento de una placa tectónica respecto a otra, tomando una tercera como referencia | Sumar o restar en el sentido equivocado (trampa 12) | A5 |
| 6 | 2020-I (105, 15 set) | Rapidez máxima de un tren que acelera y frena igual para cubrir una distancia en el menor tiempo | Suponer un tramo constante que no hace falta | B3 |
| 7 | 2021 (80, 4 set) | Rapidez media de un vehículo que va y vuelve, con las posiciones en una tabla | — | A3 |
| 8 | 2021 (83, 4 set) | Tiempo que tarda un móvil rápido en alcanzar a otro que partió antes | — | A4 |
| 9 | 2021 (86, 4 set) | Rapidez de un nadador que va y vuelve a lo largo de un bote en movimiento, en un tiempo dado | Sumar o restar la del bote al revés (trampa 12) | A5 |
| 10 | 2021 (89, 5 set) | Intervalo de un tramo acelerado, leyendo la velocidad inicial en una gráfica v–t | — | B3 |
| 11 | 2021 (82, 11 set) | Aceleraciones medias de una moto en dos intervalos seguidos | Dividir la rapidez final entre el tiempo total (K4) | B1 |
| 12 | 2021 (86, 12 set) | Aceleración de un ciclista que frena, a partir del área bajo su gráfica v–t | Dar el módulo cuando las alternativas piden el signo | B3 |
| 13 | 2022 (89, 13 mar) | Distancia recorrida desde el reposo, leyendo una gráfica a–t por tramos | Tomar el área de a–t como distancia (G4) | B4 |
| 14 | 2022 (83, 19 mar) | Velocidad media con mitad del recorrido a una rapidez y, del resto, mitad del tiempo a otras dos | Promediar las rapideces (trampa 10) | A3 |
| 15 | 2023-I (79) | Hacia dónde apuntar un bote para que su velocidad resultante siga una línea dada | Apuntar al destino sin mirar la corriente | **Vectores** (pregunta 8) |
| 16 | 2024-II (92, áreas D y E) | Distancia en un tiempo dado, leyendo la pendiente de una recta x–t y extrapolando | Tomar la última posición del gráfico como respuesta (G2) | A2 |
| 17 | 2024-II (80, área A) | Distancia que recorre un móvil uniforme hasta que lo alcanza otro que acelera desde atrás | Dar la distancia del perseguidor | B4 |
| 18 | 2025-II (89, áreas D y E) | Velocidad en un instante, a partir de la ecuación de posición x(t) cuadrática | Tomar el número que acompaña a t² como la aceleración, sin duplicarlo | B2 |
| 19 | 2026-I (81, área A) | Cómo cambia la distancia de frenado si la rapidez inicial se multiplica, con el mismo freno | Creer que crece en proporción a la rapidez (PR1, trampa 2) | B2 |
| 20 | 2026-II (92, área E) | Desplazamiento entre dos instantes, a partir de la ecuación de posición cuadrática | Dar la posición final en vez del desplazamiento | B2 |

Por idea: A1 0, A2 2, A3 3, A4 1, A5 2 · B1 1, B2 4, B3 3, B4 2, B5 1, B6 0. A1 y B6 no tienen pregunta propia en San
Marcos, pero son la base de las demás (A1) y el subtema más grande del banco (B6, con el par fis-02 de la prueba).
Otras tres preguntas de San Marcos, de otras unidades, usan esta como herramienta: 2025-II (91) y 2026-II (89) sacan la
aceleración de una distancia y un tiempo desde el reposo (trabajo y dinámica; la trampa es usar la velocidad media como
aceleración), y 2026-II (82) es el tiempo de caída de un tiro horizontal (parabólico).

---

## 0. Diagnóstico de la teoría actual

`movimiento-rectilineo.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene cinco ideas: `mru`,
`desplazamiento-distancia`, `pendiente-aceleracion`, `caida-libre` y `encuentro`, y cuatro mesas (`pista-libre`,
`ida-vuelta`, `recta-vt`, `encuentro-libre`). Fue la «unidad de referencia» del molde viejo (14 nov) y las otras 18 de
física copiaron su forma, así que sus defectos se repiten en todo el curso.

**Lo que se queda (es bueno):**
- Todo se mueve solo, a velocidad real, y deja una marca cada segundo (Gerson, 15 nov: «física se mueve sola»). El gesto
  directo sobre la figura (arrastrar la marca de los 5 s, la salida de B, la pelota) funciona.
- El motor de `plantillas/mruv/` sirve entero: tramos de aceleración constante, frenado sin retroceso
  (`frena: true`), lanzamiento vertical, `cruces`, `igualVelocidad`, `enesimoSegundo` y `pendiente`, con 18 casos.
- Buenas ideas de contenido: «en la cima, la recta v–t no se quiebra»; el área sobre el eje suma y la de abajo resta; en
  el encuentro «las pendientes son distintas: sus velocidades no son iguales»; la combi que frena «se queda ahí, no
  retrocede».
- Las cinco invitaciones de `pista-libre` con su `logrado` (frenar antes de los 10 m, el acordeón, la misma última
  marca con distinta aceleración).
- La historia de Galileo con su fuente (Museo Galileo).
- Los códigos MRU-X0, MRU-SUMA, MRU-CONTEO, MRU-SIGNO, DX-*, K-*, C-* y VR-*.

**Lo que falla contra el contrato:**
1. **Regla 3: cuatro de las cinco predicciones ya se vieron en su juego.** Idea 1: el juego llega a x₀ = 2 m y v = 4 m/s
   y su lectura da x = 22 m a los 5 s, que es la pregunta. Idea 2: con «retrocede a 4 m/s durante 3 s» la lectura da
   Δx = 0, la respuesta. Idea 3: el control `a` vale −2 y la predicción pregunta si a es −2. Idea 4: la lectura dice
   «g = 10 m/s² hacia abajo» en todo instante, también en la cima, que es lo que se predice. En la idea 5 la brecha es
   otra (24 m contra 18 m), pero la lectura ya dice «se acercan 6 m/s».
2. **Punto 1: ningún objeto reconocible.** El carrito de `pista` es provisional (una caja con dos ruedas) y tres ideas
   abren con ejes. La combi, el mototaxi y la pista atlética no aparecen.
3. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   los controles («Cambia la rapidez y mira cómo se separan las marcas»).
4. **No hay «Lee» ni «Así se resuelve»** en ninguna idea (es una de las 59 unidades que la ronda 6 dejó sin esos
   momentos), **ni ejemplos resueltos** (0 de 75).
5. **Punto 9: el orden falla.** La idea 2 juega con una gráfica v–t y su área antes de que la idea 3 presente la gráfica
   v–t. La regla de la idea 3 trae x = x₀ + v₀t + ½at², que nadie jugó ni predijo, y su «Ahora tú» solo pide v.
6. **Punto 13: ningún ejercicio trae `datos`** (g = 10 m/s² va escrito en la pregunta), tampoco el papel de las tres
   plantillas (25 problemas, ninguno con datos) ni `cinematica-medias` (`datos: ''`).
7. **«Ahora tú» no llega a examen:** un solo paso en las cinco ideas. No hay km/h, rapidez media por tramos, gráfica
   a–t, ecuación horaria, frenado con doble rapidez ni alcance MRU–MRUV, que son 9 de las 20 preguntas de San Marcos.
8. **§5b: colores de la regla vieja.** x turquesa, v naranja, a verde y t carmín. El verde de a va pegado al naranja de
   v en cada ecuación del MRUV y en la pelota de `torre` (protanopía: 0,010); el carmín, que es de los ángulos, marca el
   tiempo, y en el «Mira» de la idea 5 la recta de B va en carmín, el color de t.
9. **Punto 7: las lecturas y las reglas encadenan con «·»** («t = 2,0 s · x = 10,0 m · marcas cada 4 m»; «Δx = A₊ − A₋
   · d = A₊ + A₋»), y la idea 5 muestra «v_A/B» sin decir qué es.
10. **Práctica que se sale de la unidad.** `cinematica-medias` saca en esta unidad tipos de parabólico (par x(t), y(t) y
    la latitud), y `velocidad-relativa` saca el bote que cruza el río con ángulo, que es suma de vectores en el plano
    (es de Vectores). Es el mismo defecto que la auditoría de Vectores marcó como A1.
11. Glosario: 10 términos, ninguno con `simple`, cuatro con un solo ejemplo. La cabecera dice «postulante de 3.º a 5.º»
    y la prueba del curso tiene dos pares de la unidad (fis-01 y fis-02) para once ideas.

---

## 1. Las ideas, en orden

Propongo **once ideas en dos unidades**, como Magnitudes y Vectores y como Exponentes y Productos notables (pregunta 1).
Siete temas del catálogo, 250 fichas y 20 preguntas de San Marcos no caben en seis ideas (el tope de `docs/teoria.md`)
sin que cada una cargue dos reglas. Y San Marcos ya la parte así: tema 2 (MRU) y tema 3 (MRUV y caída libre).

- **A. «Movimiento rectilíneo uniforme»** conserva el id `fisica.movimiento-rectilineo` (el avance se guarda con él) y
  las ideas `mru`, `desplazamiento-distancia` y `encuentro`.
- **B. «MRUV y caída libre»** es una unidad nueva, `fisica.mruv-y-caida-libre`. Recibe `pendiente-aceleracion` y
  `caida-libre`, y `Avance.migrar` le pasa lo que el alumno ya hizo en esas dos ideas y en las mesas `pista-libre`,
  `ida-vuelta` y `recta-vt`, su visita y su «Ya la estudié».

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| **A** | | **Movimiento rectilíneo uniforme** | |
| A1 | `mru` | Velocidad constante: el MRU | En el MRU se avanza lo mismo en cada segundo: x = x₀ + v · t. El signo de v dice hacia dónde va. |
| A2 | `grafica-xt` (nueva) | La gráfica posición–tiempo | En la gráfica x–t, la pendiente Δx/Δt es la velocidad, aunque la recta no pase por el origen; si la recta baja, v es negativa. |
| A3 | `desplazamiento-distancia` | Velocidad media y rapidez media | La velocidad media es el desplazamiento entre el tiempo; la rapidez media, la distancia recorrida entre el tiempo. No es el promedio de las rapideces. |
| A4 | `encuentro` | Encuentros y alcances | Se encuentran si están en el mismo lugar a la vez. De frente, la brecha se cierra con la suma de rapideces; persiguiéndose, con la resta. |
| A5 | `velocidad-relativa` (nueva) | Velocidad relativa | Desde un móvil, el otro se ve con la diferencia de velocidades, v_B/A = v_B − v_A; desde la orilla, el bote suma la del río. |
| **B** | | **MRUV y caída libre** | |
| B1 | `aceleracion` (nueva) | La aceleración | La aceleración es cuánto cambia la velocidad cada segundo: a = Δv/Δt. Al frenar, a tiene signo contrario a v, aunque siga avanzando. |
| B2 | `ecuaciones-mruv` (nueva) | Las ecuaciones del MRUV | Con a constante, Δx = (v₀ + v)/2 · t y v² = v₀² + 2a·Δx: al doble de rapidez, frenar toma cuatro veces la distancia. |
| B3 | `pendiente-aceleracion` | La gráfica velocidad–tiempo | En la gráfica v–t, la pendiente es la aceleración y el área es el desplazamiento: sobre el eje suma y bajo el eje resta. |
| B4 | `graficas-xt-at` (nueva) | Gráficas x–t y a–t | En el MRUV, x–t es una parábola cuya inclinación en cada instante es la velocidad; a–t es horizontal y su área es cuánto cambió v. |
| B5 | `caida-reposo` (nueva) | Caída libre desde el reposo | Sin aire, todo lo que se suelta cae con la misma g, pese lo que pese: v = g·t y h = ½·g·t². |
| B6 | `caida-libre` | Lanzamiento vertical | Al lanzar hacia arriba, g apunta hacia abajo todo el tiempo, también en la cima, donde v = 0; sube y baja en tiempos iguales. |

Los `aprendizaje` caben en el tope de 25 palabras. Los ids de la unidad A y de B3 y B6 se quedan; los controles viejos de
`desplazamiento-distancia` (`v2`, `t2`) y de `pendiente-aceleracion` (`v0`, `a`) viajan con sus mesas (`ida-vuelta` y
`recta-vt`) y los juegos nuevos estrenan los suyos. `mru` conserva `v`, `x0` y `t`; `encuentro`, `va`, `vb` y `t`;
`caida-libre`, `v0` y `t`.

`pregunta` (Resumen): A1 «¿Dónde estará la combi dentro de 5 segundos?» · A2 «¿Qué dice la inclinación de la gráfica
x–t?» · A3 «Si das la vuelta y regresas al mismo sitio, ¿cuál fue tu velocidad media?» · A4 «¿Cuándo se cruzan una
combi y un mototaxi que van de frente?» · A5 «¿Qué tan rápido ves pasar otra combi desde tu ventana?» · B1 «Si una combi
frena mientras avanza, ¿hacia dónde apunta su aceleración?» · B2 «Si vas al doble de rápido, ¿cuánto más necesitas para
frenar?» · B3 «¿Dónde se ve, en la gráfica v–t, cuánto avanzó el atleta?» · B4 «¿Por qué la gráfica x–t de la combi que
acelera es una curva?» · B5 «Si sueltas a la vez una canica y una piedra, ¿cuál llega primero?» · B6 «En el punto más
alto, ¿la pelota tiene aceleración?».

`actividad`: A1 «Elegir de dónde sale la combi y qué tan rápido va.» · A2 «Inclinar la gráfica de la combi para que
pase por el grifo.» · A3 «Correr por la recta de la pista, volver y medir el paseo.» · A4 «Elegir las rapideces de la
combi y del mototaxi para que se crucen.» · A5 «Mirar desde tu combi otra que va por el carril de al lado.» · B1 «Hacer
que la combi arranque del paradero más o menos rápido.» · B2 «Elegir cuánto frena la combi para parar antes del paso de
cebra.» · B3 «Elegir cuánto acelera un atleta en los 100 metros.» · B4 «Hacer que la combi alcance al mototaxi que pasó
por el paradero.» · B5 «Atrapar una regla que suelta tu compañero.» · B6 «Patear una pelota hacia arriba junto al
pabellón del colegio.»

Glosario que estrena cada idea, con `simple` (tope de 30 por unidad; las de Vectores se marcan «Viene de Vectores»):
A1 posición, velocidad, rapidez, MRU · A2 gráfica x–t, pendiente · A3 velocidad media, rapidez media (desplazamiento y
distancia recorrida vienen de Vectores) · A4 encuentro, alcance · A5 velocidad relativa, sistema de referencia ·
B1 aceleración, MRUV, frenar · B2 distancia de frenado, ecuación horaria · B3 gráfica v–t, área bajo la gráfica ·
B4 parábola, gráfica a–t · B5 caída libre, gravedad · B6 lanzamiento vertical, altura máxima.

**Por qué va cada una en su lugar y qué da por sabido**

- **A1. MRU.** La raíz de las dos unidades. «Lee» recuerda de Vectores el eje con signo (+ hacia la derecha, − hacia la
  izquierda) y presenta x₀ como «dónde estaba cuando empezamos a contar». Da por sabido cambiar km/h a m/s (Magnitudes,
  idea 1, que ya usa 54 km/h = 15 m/s). Nivel examen: la combi en km/h (U1) y el eco y el trueno (el sonido a unos
  340 m/s va y vuelve: 7 fichas del banco).
- **A2. Gráfica x–t.** Necesita x = x₀ + v·t. «Lee» presenta la gráfica como la tabla de A1 hecha puntos, y la
  pendiente como «cuánto sube la recta por cada segundo» (la recta en el plano llega en trigonometría, mucho después).
  Va antes de las medias y los encuentros porque A4 usa el cruce de dos rectas. Ataca G1 (la gráfica como foto del
  camino) y G2 (con la recta fuera del origen solo el 21–25 % saca bien la pendiente, Beichner 1994). Nivel examen:
  San Marcos 2019-I y 2024-II.
- **A3. Medias.** Usa desplazamiento y distancia recorrida de Vectores, y el MRU por tramos de A1. Su nivel examen es
  la tabla de posiciones de ida y vuelta (2021) y «la mitad del camino… la mitad del tiempo» (2022).
- **A4. Encuentros.** Usa A1 (dos ecuaciones x = x₀ + v·t) y A2 (el cruce de rectas en «Mira»). Nivel examen: el que
  salió antes (2021), los dos trenes que se cruzan enteros. El alcance de un MRU por un MRUV va en B4.
- **A5. Velocidad relativa.** Al final de A, porque reescribe la brecha de A4 como «lo que ve uno desde el otro». Solo en
  una recta: el bote que cruza el río con ángulo es suma de vectores y ya está en Vectores. Nivel examen: placas (2020-I),
  el nadador a lo largo del bote (2021), la columna de llamas con el pastor (ida y vuelta).
- **B1. Aceleración.** Raíz de B. Necesita v con signo (A1). Ataca K3 (la aceleración va hacia donde se mueve) y K4
  (a = v/t sin restar). Nivel examen: aceleración media en dos tramos (2021) con km/h.
- **B2. Ecuaciones.** Necesita B1. «Mira» saca Δx de la velocidad media (v₀ + v)/2 sin gráfica, para que la regla no
  dependa de B3. La regla trae las cuatro ecuaciones (v = v₀ + at, Δx = (v₀ + v)/2 · t, x = x₀ + v₀t + ½at² y
  v² = v₀² + 2aΔx) y que, después de detenerse, la combi no retrocede. Nivel examen: frenado en km/h (2019-II), doble rapidez (2026-I), la ecuación horaria x = 4 + 6t − t²
  (2025-II y 2026-II) y la distancia en el n-ésimo segundo (hipótesis de academia del informe).
- **B3. Gráfica v–t.** Necesita la pendiente de A2 y Δx = (v₀ + v)/2 · t de B2, que aquí se ve como el área de un
  trapecio. Las áreas de rectángulo, triángulo y trapecio van en `datos` (geometría las da después, en otra rama). Ataca
  G4 (pendiente cuando se pide área). Nivel examen: tiempo mínimo (2020-I), leer v₀ (2021), la aceleración desde el área
  (2021) y el retroceso bajo el eje (papel p8 de `mruv`).
- **B4. Gráficas x–t y a–t.** Necesita las tres anteriores: es la misma combi vista en las tres gráficas. Es el tema
  «La recta y la parábola como gráficas». Ataca G3 (las tres gráficas con la misma forma, 25 %) y K1 con curvas (misma
  velocidad no es encuentro). Nivel examen: a–t por tramos desde el reposo (2022) y el alcance MRU–MRUV (2024-II).
- **B5. Caída desde el reposo.** g es una aceleración (B1) y h = ½gt² es B2 con v₀ = 0. Ataca C2 (el más pesado cae
  primero, San Marcos 2019-II). «Mira» muestra los números de Galileo (5, 15, 25, 35 m en cada segundo con g = 10) y
  conecta con la historia del plano inclinado. Nivel examen: el pozo con eco y las dos esferas de distinta altura.
- **B6. Lanzamiento vertical.** Al final: junta B2, B3 (la recta v–t que cruza el eje en la cima) y B5. Ataca C1 (en la
  moneda lanzada hacia arriba, solo el 5 % acertaba tras un curso tradicional y más del 90 % con demostraciones con
  predicción; Thornton y Sokoloff 1998). Nivel examen: desde un puente (dos raíces, papel p9) y el encuentro en el aire.

**Qué no entra:** el movimiento con aceleración variable (5 fichas), el bote que cruza con ángulo (Vectores) y todo lo de
dos dimensiones (parabólico), la caída con aire (solo una tarjeta de «Lee» en B5: la hoja de papel contra la hoja
arrugada) y las «fórmulas prácticas» de academia como atajo (tₛ = v₀/g, H = v₀²/2g): salen como resultado en «Mira» y
en `datos` va la ecuación general (punto 13: la fórmula, no el atajo).

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| A1 | **La combi en una avenida recta**, con la regla de metros pintada desde el paradero (x = 0) y la combi dibujada en cada segundo | x = la marca donde está; x₀ = donde está al arrancar el reloj; lo que avanza en 1 s = v |
| A2 | **La misma combi y, al lado, su gráfica que se dibuja** un punto por segundo; un grifo marcado más adelante | cada punto = (t; x); la recta = toda la tabla; el grifo = un punto por donde debe pasar |
| A3 | **La recta de la pista atlética del colegio**: corres de la partida hasta una valla y vuelves por el mismo carril | ida y vuelta = los tramos; distancia recorrida = todo el camino; desplazamiento = de la partida al final |
| A4 | **Una combi y un mototaxi en la avenida, entre dos paraderos**, con el colegio marcado en medio | cada vehículo con su rapidez; la brecha entre ellos; el encuentro = donde coinciden |
| A5 | **La ventana de tu combi en la carretera**, con otra combi en el carril de al lado (vista desde arriba y desde tu asiento) | tu velocidad, la de la otra, y lo que ves por la ventana |
| B1 | **La combi que arranca del paradero**, con la flecha de su velocidad que crece cada segundo y sus marcas que se abren | flecha = v; cuánto crece por segundo = a |
| B2 | **La combi que frena frente al colegio**, con el paso de cebra y sus marcas que se juntan | lo que llega = v₀; el freno = a; hasta el paso de cebra = Δx |
| B3 | **Un atleta en los 100 m de la pista**, con su gráfica v–t al lado | lo que acelera al salir = pendiente; la meta a 100 m = el área |
| B4 | **El mototaxi que pasa por el paradero cuando la combi arranca**, con las tres gráficas apiladas debajo | recta (mototaxi) y parábola (combi) en x–t; cruce = alcance |
| B5 | **La regla de 30 cm que tu compañero suelta entre tus dedos** | lo que cae antes de atraparla = h; cuándo cierras los dedos = t (tu tiempo de reacción) |
| B6 | **Una pelota pateada hacia arriba junto al pabellón del colegio**, con su altura marcada en la pared | v₀ = el puntapié; la cima = altura máxima; el techo = la meta |

Piezas: `fis-combi` ya dibuja la combi en una pista con sus metros y su posición en cada segundo (es justo A1);
`fis-objeto` ya tiene el atleta con su cronómetro y `fis-fuerzas` el bote. Propongo opciones nuevas, sin cambiar lo que
ya hacen (riesgo del plan §10): en `fis-combi`, la salida x₀, la velocidad negativa, un segundo vehículo (el mototaxi,
dibujo nuevo de prueba) y marcas con nombre (paradero, grifo, colegio, paso de cebra); en `pista`, la opción
`vehiculo: 'combi' | 'mototaxi' | 'atleta'` en vez del carrito provisional; en `torre`, la regla que cae y la pared del
pabellón, y `g: false` para el juego de B6. Todos `data-prueba`, con su prueba numérica de encuadre y rótulos (molde §6),
y en `docs/encargo-vectores.md` para que decidas cuáles reemplazas (pregunta 9).

---

## 3. Misión de «Juega» (meta que el motor comprueba)

Las lecturas van en ≤ 12 palabras y enuncian una relación, sin «·» entre dos igualdades.

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo | `bien` |
| --- | --- | --- | --- | --- | --- |
| A1 | «La combi va por la avenida con velocidad constante; el paradero es x = 0.» **Haz que pase por la marca de 100 m justo a los 5 s.** | `x0` 0–40 m de 10 en 10; `v` 2–20 m/s de 2 en 2 (arrastre de la marca de los 5 s); `t` automático | `v.x0 + 5 * v.v === 100` (cinco soluciones) | «Sale de 20 m y suma 16 m cada segundo: 100 m.» | «20 m + 16 m/s · 5 s = 100 m. Cada segundo, lo mismo.» |
| A2 | «La gráfica se dibuja sola mientras la combi sale del paradero.» **Inclínala para que pase por el grifo: 60 m a los 4 s.** | `v` −20 a 20 m/s de 5 en 5 (arrastre de la punta de la recta); x₀ = 0 fijo | `v.v === 15` | «La recta sube 15 m por cada segundo: v = 15 m/s.» | «15 m más cada segundo: en 4 s, 60 m. La inclinación es la velocidad.» |
| A3 | «Corres 60 m hasta la valla a 2 m/s y vuelves por el mismo carril, igual de rápido.» **Vuelve hasta que tu rapidez media sea el doble de tu velocidad media.** | `r`, lo que vuelves: 0–60 m de 10 en 10 (arrastre del corredor); `t` automático | `v.r === 20` | «Recorriste 80 m; quedaste a 40 m de la partida.» | «80 m ÷ 40 s = 2 m/s y 40 m ÷ 40 s = 1 m/s: la mitad.» |
| A4 | «La combi sale del paradero y el mototaxi del otro, a 240 m, a la vez y de frente.» **Haz que se crucen justo frente al colegio, a 150 m de la combi.** | `va` (combi) 1–12 m/s; `vb` (mototaxi) 1–12 m/s (arrastre de la marca de 1 s de cada uno) | `150 * (v.va + v.vb) === 240 * v.va` | «Se acercan 10 + 6 = 16 m cada segundo.» | «240 m ÷ 16 m/s = 15 s; en 15 s la combi hizo 150 m.» |
| A5 | «Vas en la combi A a 15 m/s por la carretera; por el carril de al lado va otra.» **Haz que, desde tu ventana, la otra parezca quieta.** | `vb` −20 a 20 m/s de 5 en 5 (negativa: de frente) | `v.vb === 15` | «Desde tu ventana: 15 − 15 = 0 m/s.» | «Van igual de rápido y al mismo lado: una no se aleja de la otra.» |
| B1 | «La combi arranca del paradero; cada segundo su velocidad cambia lo mismo.» **Haz que llegue a 12 m/s justo a los 4 s.** | `v0` 0–8 m/s de 2 en 2; `a` 0,5–3 m/s² de 0,5 en 0,5 (solo acelera); `t` automático | `v.v0 + 4 * v.a === 12` | «Cada segundo, v sube 2 m/s: de 4 a 12 m/s.» | «Subió 8 m/s en 4 s: 2 m/s en cada segundo. Eso es a.» |
| B2 | «La combi llega a 10 m/s y frena parejo frente al colegio.» **Elige cuánto frena para parar justo en el paso de cebra, a 25 m.** | `a` −1 a −5 m/s² de 0,5 en 0,5; v₀ = 10 m/s fijo | `v.a === -2` | «Para en 5 s y 25 m: velocidad media 5 m/s.» | «De 10 a 0 m/s, la media es 5 m/s; 5 m/s · 5 s = 25 m.» |
| B3 | «El atleta acelera unos segundos y después corre parejo hasta la meta.» **Haz que llegue a los 100 m justo a los 12,5 s.** | `ta`, tiempo acelerando: 1–6 s de 0,5 en 0,5; `vt`, rapidez tope: 6–10 m/s | `v.vt === 10 && v.ta === 5` (única) | «Triángulo 25 m + rectángulo 75 m = 100 m.» | «El área bajo la gráfica es lo que avanzó: los 100 m.» |
| B4 | «El mototaxi pasa por el paradero a 10 m/s justo cuando la combi arranca de ahí.» **Elige la aceleración de la combi para que lo alcance a los 10 s.** | `a` 1–4 m/s² de 0,5 en 0,5; `t` automático | `v.a === 2` | «A los 10 s, los dos en 100 m.» (solo posiciones) | «La parábola de la combi corta la recta del mototaxi a los 10 s.» |
| B5 | «Tu compañero suelta la regla de 30 cm y tú cierras los dedos.» **Atrápala justo en la marca de 20 cm.** | `t`, cuándo cierras los dedos: 0,05–0,25 s de 0,05 en 0,05 | `v.t === 0.2` | «En 0,1 s cayó 5 cm; en 0,2 s, 20 cm.» | «El doble de tiempo, cuatro veces lo que cae.» |
| B6 | «Pateas la pelota hacia arriba junto al pabellón; el techo está a 5 m.» **Patéala para que llegue justo al techo.** | `v0` 5–20 m/s de 5 en 5; `t` automático; solo la flecha de v (sin la de g) | `v.v0 === 10` | «Sale a 10 m/s y llega a 5 m.» | «Arriba, v = 0 por un instante, y vuelve a bajar.» |

Para que la predicción quede fuera de lo jugado: A1 solo tiene v positiva; A2 solo rectas que salen del origen; A3 va y
vuelve a la misma rapidez; A4 solo de frente; B1 solo acelera; B2 tiene v₀ fija; B3 solo v positiva; la lectura de B4
solo da posiciones; B6 no muestra la flecha de g ni su valor. Ningún `bien` dice la respuesta de su predicción, y la
leyenda no lleva los números que solo aparecen con la misión cumplida (`docs/teoria.md` 4f).

---

## 4. La predicción de cada idea

La app baraja las opciones; `datos` lleva solo valores y equivalencias, nunca la fórmula. A diferencia de otras unidades,
**aquí sí hay errores medidos**: K1–K4, G1–G4 y C1–C2 (Trowbridge y McDermott 1980 y 1981, McDermott y otros 1987,
Beichner 1994, Thornton y Sokoloff 1998, Viennot 1979). Las trampas 2, 10 y 12 salen de las alternativas de San Marcos;
PR1 y U1 son del informe transversal (hipótesis). Los códigos nuevos van marcados «nuevo» y son hipótesis. Ninguna
predicción repite un código. En la figura de la predicción, lo pedido va con «?» en tinta.

**A1.** «La combi está en x = 80 m y va hacia el paradero a 12 m/s. ¿Dónde está 5 s después?» Datos: el paradero está en
x = 0; hacia el paradero es el sentido negativo.

| Opción | Qué mide |
| --- | --- |
| En x = 20 m | Correcta (80 − 12 · 5) |
| En x = 140 m | Suma lo que avanza aunque vaya hacia atrás (MRU-SIGNO) |
| En x = 60 m | Solo lo que avanzó, sin la salida (MRU-X0) |
| En x = 8 m | Cuenta seis segundos: la marca de t = 0 como un segundo (MRU-CONTEO) |

**A2.** «La gráfica x–t de un ciclista es una recta que pasa por (2 s; 26 m) y (5 s; 38 m). ¿Qué velocidad lleva?»
Datos: x en metros y t en segundos.

| Opción | Qué mide |
| --- | --- |
| 4 m/s | Correcta (12 m en 3 s) |
| 13 m/s | La altura de un punto entre su tiempo, 26 ÷ 2, como si la recta saliera del origen (G2-altura-entre-tiempo) |
| 7,6 m/s | Lo mismo con el otro punto, 38 ÷ 5 (G2-ultimo-punto, nuevo) |
| 38 m/s | Lee el eje: la altura como velocidad (G2-pendiente-es-altura) |

Los números no son los del par fis-01 ni los del papel p6 (`catalogo/pruebas/parecidos.js` lo comprueba).

**A3.** «Subes a un cerro a 2 km/h y bajas por el mismo camino a 6 km/h. ¿Cuál es tu rapidez media en todo el paseo?»
Datos: el camino mide 6 km.

| Opción | Qué mide |
| --- | --- |
| 3 km/h | Correcta (12 km en 3 h + 1 h) |
| 4 km/h | El promedio de las dos rapideces (MED-PROMEDIO, trampa 10; San Marcos 2019-II y 2022) |
| 0 km/h | Confunde rapidez media con velocidad media: volvió al inicio (DX-RAPIDEZ) |
| 8 km/h | Suma las rapideces (MED-SUMA, nuevo) |

**A4.** «Ahora el mototaxi va 60 m delante, a 6 m/s, y la combi lo sigue a 10 m/s. ¿Cuándo lo alcanza?» Datos: los dos
van hacia el mismo lado; salen a la vez.

| Opción | Qué mide |
| --- | --- |
| A los 15 s | Correcta (la brecha se cierra 4 m cada segundo) |
| A los 3,75 s | Suma las rapideces, como si fueran de frente (VR-SUMA) |
| A los 6 s | Como si el mototaxi estuviera quieto (VR-UNO) |
| Cuando los dos tengan la misma velocidad | Misma posición, misma velocidad (K1) |

**A5.** «Un bote va río abajo a 5 m/s respecto al agua; el río corre a 2 m/s. ¿Con qué rapidez lo ve pasar alguien
parado en la orilla?» Datos: río abajo, el bote y la corriente van hacia el mismo lado.

| Opción | Qué mide |
| --- | --- |
| 7 m/s | Correcta (5 + 2) |
| 3 m/s | Resta en el sentido equivocado (REL-SENTIDO, trampa 12) |
| 5 m/s | Ignora la corriente: «el bote va a 5» (REL-SIN-MARCO, nuevo) |
| Unos 5,4 m/s | Pitágoras, como el bote que cruza en Vectores: √(25 + 4) (REL-PITAGORAS, nuevo) |

**B1.** «La combi va a 20 m/s hacia la derecha y frena: a los 4 s va a 8 m/s, todavía hacia la derecha. ¿Cuánto vale su
aceleración?» Datos: + hacia la derecha.

| Opción | Qué mide |
| --- | --- |
| −3 m/s² | Correcta (de 20 a 8 en 4 s) |
| +3 m/s²: apunta hacia adelante, porque avanza | La aceleración va hacia donde se mueve (K3) |
| +2 m/s² | La velocidad final entre el tiempo, 8 ÷ 4, sin restar (K4) |
| 0: sigue yendo hacia la derecha | Cree que sin cambio de sentido no hay aceleración (K-A0) |

**B2.** «Otra combi, con el mismo freno del juego, llega al doble de rápido: 20 m/s. ¿Cuánto recorre hasta parar?» Datos:
en el juego, a 10 m/s paró en 25 m.

| Opción | Qué mide |
| --- | --- |
| 100 m | Correcta (cuatro veces: v² = 2·|a|·Δx; San Marcos 2026-I) |
| 50 m | El doble de rapidez, el doble de distancia (PR1-frenado, trampa 2) |
| 25 m | El mismo freno, la misma distancia (MRUV-FRENO-IGUAL, nuevo) |
| 200 m | v₀ · t sin la mitad: 20 m/s por los 10 s de frenado (MRUV-VT, hipótesis del informe) |

**B3.** «Un mototaxi avanza 3 s a 4 m/s y después retrocede 4 s a 1,5 m/s para estacionarse. ¿A qué distancia de donde
empezó termina?» La figura es su gráfica v–t, sin números en las áreas. Datos: el área de un rectángulo es base por
altura.

| Opción | Qué mide |
| --- | --- |
| 6 m | Correcta (12 m − 6 m) |
| 18 m | Suma las dos áreas: la distancia recorrida (DX-SUMA) |
| 12 m | Solo el tramo de ida (DX-IDA) |
| 5,5 m | Suma las alturas de la gráfica (DX-ALTURA) |

**B4.** «En el juego, la combi alcanza al mototaxi a los 10 s. ¿En qué instante tenían la misma velocidad?» Datos: el
mototaxi va a 10 m/s; la combi arranca con 2 m/s².

| Opción | Qué mide |
| --- | --- |
| A los 5 s | Correcta (2 · 5 = 10 m/s; en x–t, las inclinaciones son iguales ahí) |
| A los 10 s, cuando lo alcanza | Misma posición, misma velocidad (K1-a) |
| Al salir, porque los dos estaban en el paradero | La misma idea en el arranque (K1-b, nuevo) |
| Nunca: una acelera y la otra no | No ve que la combi pasa por todas las rapideces (MRUV-NUNCA, nuevo) |

Propongo partir K1 en K1-a y K1-b, como GE17 en geometría, para que dos opciones no lleven el mismo código.

**B5.** «Desde la ventana del segundo piso sueltas a la vez una canica y una piedra diez veces más pesada. ¿Cuál llega
primero al patio?» Datos: sin resistencia del aire.

| Opción | Qué mide |
| --- | --- |
| Llegan a la vez | Correcta |
| La piedra, en la décima parte del tiempo | Doble masa, mitad de tiempo (C2; Viennot 1979, en Carrascosa y otros 2004) |
| La piedra, un poco antes | La versión suave de C2 (C2-suave, nuevo) |
| La canica, porque es más liviana | Lo liviano «se mueve más fácil» (C2-liviano, nuevo) |

**B6.** «La pelota llega a su punto más alto. Justo ahí, ¿cuánto vale su aceleración?» Datos: la pelota sale a 20 m/s; sin
resistencia del aire. Se queda la de hoy:

| Opción | Qué mide |
| --- | --- |
| 10 m/s², hacia abajo | Correcta |
| 0: está detenida | v = 0, entonces a = 0 (C1) |
| 10 m/s², hacia arriba | Hacia donde iba (K3) |
| Depende de la masa de la pelota | C2 |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en las dos unidades | Aviso |
| --- | --- | --- |
| x, x₀ | Posición sobre la recta, con signo, desde el cero (el paradero, la partida); x₀ es la posición cuando t = 0 | — |
| Δx | Desplazamiento, x − x₀, con signo | El mismo símbolo que el glosario de Vectores |
| d | Distancia recorrida, nunca negativa | **Choca con Vectores**, donde d⃗ con flecha era el desplazamiento en el plano (pregunta 5). La academia escribe d = v·t: sin vuelta, d = \|Δx\| |
| D | Separación entre dos móviles al empezar (A4) | La academia usa d; aquí D para no chocar con la distancia recorrida |
| L | Largo de un tren o de una columna (A4, A5) | — |
| t, Δt | Instante (contado desde que empieza el reloj) e intervalo | En la gráfica, el eje horizontal |
| tₑ, t_alc | Tiempo de encuentro y de alcance | Subíndice de verdad (`{ sub }`) |
| v, v₀ | Velocidad con signo sobre la recta; v₀ al empezar | Sin flecha en una recta (pregunta 3). «Rapidez» es la velocidad sin su signo |
| v_A, v_B | Velocidad de cada móvil (A y B solo nombran móviles, nunca puntos ni paraderos) | Los paraderos se nombran con palabras |
| v_m | Velocidad media | La rapidez media va en palabras, sin letra (la academia escribe v_m para las dos) |
| v_B/A | Velocidad de B vista desde A | La matriz y el papel escriben v_AB; aquí con barra, que se lee «respecto a» |
| u, c | Rapidez del bote respecto al agua y de la corriente (A5) | Son las letras de `velocidad-relativa`. c no es la luz (eso es de ondas EM, otra unidad) |
| a, a_m | Aceleración con signo y aceleración media | — |
| g | Módulo de la aceleración de la gravedad, siempre positivo: 10 m/s² en los problemas, unos 9,8 medido | Con el eje hacia arriba, a = −g |
| h | Lo que cae algo que se suelta, desde donde se soltó (B5), positivo | La academia escribe h = v₀t ± ½gt²; aquí, en B6, el signo lo da el eje |
| y, H | Altura con el eje hacia arriba desde donde se lanza (B6); H, la altura máxima | — |
| dₙ | Distancia recorrida en el n-ésimo segundo (nivel examen de B2 y B5) | Distinta de «en n segundos» (hipótesis del informe) |
| +, − | Sentido sobre la recta: + hacia la derecha (o hacia arriba en B6) | El eje siempre dibujado con su «+» |
| m, s, km, h, m/s, m/s², km/h | Unidades | Todo número lleva la suya. **h es también la hora**: en km/h se lee bien; en B5 nunca va «h» sola como unidad (se escribe «hora») |

---

## 6. Mapa de colores por magnitud (§5b)

Un color fijo por magnitud, el mismo en las dos unidades (el alumno pasa de una a la otra), elegido por su papel más
común, y la respuesta en el color de su magnitud con el recuadro de respuesta.

| Token | Magnitud | Por qué |
| --- | --- | --- |
| `o` naranja | **Velocidad y rapidez:** v, v₀, v_A, v_B, v_m, la rapidez media, v_B/A, u, c, y la flecha de velocidad del dibujo | Es el primer dato casi siempre (x = x₀ + v·t, v = v₀ + a·t). Como en Vectores, «una velocidad dada» es naranja |
| `i` turquesa | **Tiempo:** t, Δt, tₑ, t_alc, el reloj y los rótulos «1 s, 2 s…» de las marcas | Es «el factor» de la tabla del molde: lo que multiplica a la velocidad |
| `f` violeta | **Posición y desplazamiento:** x, x₀, Δx, D, L, h, y, H, la marca en la regla y la recta o la parábola de x–t | Es lo que más se pide (siete de las 20 preguntas). Como en Vectores, el desplazamiento es violeta |
| `h` carmín | **Aceleración:** a, a_m, g y su flecha | En estas dos unidades no hay ángulos. Ver abajo |
| tinta | **Distancia recorrida** d y dₙ; las reglas, el suelo, los ejes y los vehículos | Como en Vectores (allí la distancia ya es tinta) |
| `d` verde | No se usa | Iría junto al naranja de v en casi todo (protanopía: 0,010) |

- **El carmín para la aceleración** es la única elección que sale de la tabla del molde: el verde no puede ir junto a
  la velocidad y el carmín está libre porque aquí no hay ángulos. El par naranja–carmín (v con a) es el más débil que el
  molde acepta (0,062, el de A⃗ con θ), así que a y g llevan siempre su letra y su flecha, que se dibuja con otra punta
  que la de v. La alternativa, con todos los pares ≥ 0,10, está en la pregunta 4.
- **Dos móviles de la misma magnitud llevan el mismo color** (v_A y v_B naranja; las rectas de los dos en x–t,
  violeta). Se distinguen por el dibujo (combi o mototaxi), la letra y el trazo: continuo para A, discontinuo para B,
  con el nombre al final de cada recta. Es la regla de un color por magnitud tal cual (pregunta 4).
- **x₀ y x comparten el violeta** porque son la misma magnitud; el subíndice y la llave de la regla («dónde empezó»)
  los separan.
- En la gráfica v–t, la línea va en naranja (es v), la pendiente se marca con un escalón carmín (es a) y el área se
  pinta en violeta claro (es Δx); en a–t, la línea va en carmín y el área en naranja (es Δv). Así el color dice qué es
  cada cosa de la gráfica, que es justo lo que G3 y G4 confunden.
- Ninguna figura de Predice ni de un ejemplo delata la respuesta por su color: lo pedido va con «?» en tinta.
- Se corrigen también los colores de `cinematica-medias`, `velocidad-relativa` (sus `VAR_*`), la escena `mruv` cuando
  vuelva a usarse, y la paleta de `torre` (`colores: { y: 'f', v: 'o', a: 'h' }`).

| Idea | Naranja | Turquesa | Violeta | Carmín | Tinta |
| --- | --- | --- | --- | --- | --- |
| A1 | v | t, las marcas de cada segundo | x₀, x | — | la avenida, la regla, la combi |
| A2 | v (la lectura) | t, el eje horizontal | la recta x–t, x | — | ejes |
| A3 | velocidad media, rapidez media | Δt | Δx | — | d |
| A4 | v_A, v_B | tₑ, t_alc | D, x del encuentro | — | vehículos |
| A5 | v_A, v_B, v_B/A, u, c | t | L | — | el río, la orilla |
| B1 | v, v₀ y su flecha | t | — | a | — |
| B2 | v₀, v | t | Δx | a | el paso de cebra |
| B3 | la línea v–t | t | el área (Δx) | la pendiente (a) | d |
| B4 | v (inclinación) | t | la parábola y la recta x–t | la línea a–t | — |
| B5 | v | t | h | g | la regla que cae |
| B6 | v₀, v y su flecha | t | y, H | g (aparece en «Mira») | la pared del pabellón |

---

## 7. Práctica: qué existe y qué falta por idea

Lo que hay:
- **`plantillas/mruv/`** (escena, borrador 0.1.0, con la lección POGIL v2 en `v2.html` y `leccion.js`): su **motor** sirve
  para todos los generadores nuevos. Papel de 10 problemas sin `datos`: p1 (A4), p2 y p4 (B2), p3 y p9 (B6), p5 (B2,
  quinto segundo), p6 (A2), p7 (B4, a–t), p8 (B3) y p10 (B4, alcance MRU–MRUV).
- **`plantillas/cinematica-medias/`** (generador): `media` (cuatro subtipos) e `idavuelta` son de A3; `vt` (vmax, tmin,
  tope) de B3; `ecuacion` (velocidad, aceleración, desplazamiento, parada, origen) de B2; `xy` y `latitud` son de
  parabólico. Sin `datos` y sin `tiposPorUnidad`. Papel de 8 (p1–p3 de A3, p4 y p5 de B3, p6 de B2, p7 y p8 de
  parabólico).
- **`plantillas/velocidad-relativa/`** (generador, ya con `datos` y `tiposPorUnidad`): `marco` (combis, placas) e
  `idavuelta` (columna, tren, nadador) son de A5; `cruce` (encuentro, alcance, trenes) de A4; `bote` es 2D (Vectores) y
  `botes` es de Impulso y choques. Papel de 7 (p1, p3, p4 de A5; p2 de A4; p5 y p6 de Vectores; p7 de choques).
- **Mesas:** `pista-libre` (B1 y B2), `ida-vuelta` y `recta-vt` (B3) y `encuentro-libre` (A4).
- **Prueba:** fis-01 (A2) y fis-02 (B6).

| Idea | Hay | Falta |
| --- | --- | --- |
| A1 MRU | el «Ahora tú» de hoy (un paso) | generador: «dónde está» con signo, km/h (U1), eco y trueno; papel; mesa (la combi con salida libre) |
| A2 x–t | prueba fis-01; papel p6 de `mruv` | generador: pendiente fuera del origen (G2), dos móviles con signo (2019-I), extrapolar (2024-II), elegir la gráfica (G1); mesa |
| A3 medias | `cinematica-medias` `media` e `idavuelta`; su papel p1–p3 | `datos` por línea; `tiposPorUnidad` (A3, B2, B3 y parabólico por separado); mesa (la pista) |
| A4 encuentros | `velocidad-relativa` `cruce`; mesa `encuentro-libre`; papel p1 de `mruv`, p2 de `velocidad-relativa` | «uno salió antes» (2021); ítem de prueba |
| A5 relativa | `velocidad-relativa` `marco` e `idavuelta`; papel p1, p3, p4 | tipo nuevo «río en una recta» (a favor y en contra); **sacar `bote` de los tipos de esta unidad**; mesa |
| B1 aceleración | el «Ahora tú» de hoy; mesa `pista-libre` | generador: a = Δv/Δt con signo (K3, K4), aceleración media en dos tramos (2021), km/h; papel |
| B2 ecuaciones | `cinematica-medias` `ecuacion`; papel p2, p4, p5 de `mruv` y p6 de `cinematica-medias` | frenado con proporción (2026-I), frenado en km/h (2019-II), n-ésimo segundo; `datos` |
| B3 v–t | `cinematica-medias` `vt` (2020-I); mesas `ida-vuelta` y `recta-vt`; papel p8 | área bajo el eje, leer v₀ y el intervalo (2021), la aceleración desde el área (2021) |
| B4 x–t y a–t | papel p7 y p10 de `mruv`; `cruces` e `igualVelocidad` del motor | a–t por tramos (2022), alcance MRU–MRUV (2024-II), misma velocidad contra encuentro (K1), elegir la gráfica (G3); mesa |
| B5 desde el reposo | nada | todo: h = ½gt², números de Galileo, pozo con eco, dos esferas (2019-II), tiempo de reacción; papel; mesa (la regla) |
| B6 lanzamiento | prueba fis-02; papel p3 y p9; el «Ahora tú» de hoy (tiempo, altura, velocidad) | desde un puente o una azotea (dos raíces), encuentro en el aire (7 fichas); `datos` |

Propuesta: dos plantillas nuevas de formato `predicciones`, `plantillas/fis-mru/` y `plantillas/fis-mruv/`, con los
tipos separados por idea, que llamen al motor de `mruv` (no lo copian), con `datos` por línea, prueba en 400 semillas,
`casos.json` verificado aparte y papel de 5 a 10 por idea. `cinematica-medias` y `velocidad-relativa` se quedan (sirven a
otras unidades) con `tiposPorUnidad` y `datos`; sus tipos de esta unidad se listan en la práctica de cada idea. Falta
también lo que dejó pendiente la auditoría de Vectores: que `app/practica.js`, `app/app.js` y `app/repaso.js` pasen la
unidad al generador (si no, la práctica de MRU sigue pudiendo sacar botes con ángulo). La escena `mruv` va a «Más mesas
del tema» de B. La prueba del curso necesita al menos un par por unidad nueva (B tendría fis-02; A, fis-01).

---

## 8. Datos del mundo

Casi todo es de problema y tiene que ser posible (punto 10): una combi en avenida a 10–15 m/s, un mototaxi a 6–10 m/s,
una corriente de río de la sierra ≤ 3 m/s (regla de la auditoría de Vectores), un atleta escolar que corre los 100 m en
12–14 s, una pelota pateada a 10–20 m/s.

| Dato | ¿Fuente? |
| --- | --- |
| g: unos 9,8 m/s²; en los problemas, 10 m/s² | Valor de libro: «unos», sin fuente. Va en `datos` como «g = 10 m/s² (convención del examen)», la forma de razones trigonométricas |
| Sonido en el aire: unos 340 m/s; la luz llega casi al instante | Valor de libro, «unos» (eco y trueno en A1 y el pozo en B5) |
| Tiempo de reacción: unos 0,2 s | Valor de libro, «unos» (la regla de B5). No lo presento como medición |
| Una vuelta a la pista atlética: 400 m por el carril 1 | Reglamento de World Athletics. Lo compruebo en la página de sus reglas antes de escribirlo |
| Récord mundial de los 100 m: 9,58 s (Usain Bolt, Berlín, 2009) | World Athletics. Para un ejemplo de rapidez media (unos 10,4 m/s); lo compruebo en su página |
| Velocidad máxima en zona urbana: 30 km/h en calles y jirones y 50 km/h en avenidas | Según fuentes secundarias (búsqueda del 18 nov), el D.S. 025-2021-MTC cambió 40 y 60 km/h por 30 y 50 km/h. **No pude abrir el texto oficial** (gob.pe, El Peruano y Jurispol no están permitidos en la red de esta sesión). No va al alumno hasta confirmarlo (pregunta 10). No encontré un límite propio de zona escolar: el juego de B2 no lo nombra |
| La placa de Nazca avanza unos centímetros por año hacia la Sudamericana | Sin cifra hasta tener fuente (IGP o USGS). San Marcos 2020-I se puede usar tal cual, con su cita (regla 5) |
| Distancia Juliaca–Puno, ancho de un río real | **No usar** sin fuente (MTC, Provías, ANA). La avenida, la carretera y el río del juego no llevan nombre |
| Un piso del colegio mide unos 3 m; el techo del pabellón, a 5 m | Valores aproximados, «unos» |
| Historia: Galileo y el plano inclinado | Ya trae fuente (Museo Galileo); se queda en B5, donde están los números 1, 3, 5, 7 |

## 8b. Orden con otras unidades (`requiere`)

- **A** requiere `fisica.vectores` (desplazamiento, distancia recorrida, sentido con signo), como hoy. Magnitudes (km/h a
  m/s) llega por la cadena. Ningún consejo de otro curso: la pendiente se presenta en «Lee» de A2.
- **B** requiere `fisica.movimiento-rectilineo`. Consejo (otro curso, no cierra): `algebra.ecuaciones-lineales-y-cuadraticas`,
  porque B2, B4 y B6 tienen niveles de examen con ecuación de segundo grado (el alcance MRU–MRUV, la piedra desde el
  puente). Las áreas de rectángulo, triángulo y trapecio de B3 van en `datos`, no como requisito:
  `geometria.areas-poligonales` está muy abajo en su rama (pide relaciones métricas).
- **Hay que mover dos requisitos:** `fisica.movimiento-parabolico-y-circular` y `fisica.dinamica` piden hoy
  `fisica.movimiento-rectilineo`; usan aceleración, caída libre y ecuaciones del MRUV, así que pasan a pedir
  `fisica.mruv-y-caida-libre`. En el mapa: Vectores → MRU → MRUV y caída libre → Parabólico y Dinámica.
- `cinematica-medias` sirve a tres unidades (A, B y parabólico) y `velocidad-relativa` a tres (A, Vectores e Impulso):
  cada una saca solo sus tipos.
- Vectores ya usa «rapidez media» en su ejemplo 13 (nivel 3, con la fórmula en `datos`). El término se estrena aquí, en
  A3; en Vectores el lector lo marca «se explica en Movimiento rectilíneo uniforme».
- El catálogo pasa a 154 unidades: hay que agregar la ficha de B a la rama «Mecánica» (UNI semanas 1 y 2; San Marcos
  tema 3), ajustar la de A (San Marcos tema 2) y pasar el par fis-02 a la unidad B.
- **Costo:** son once ideas con 15 ejemplos cada una (165) y once juegos con objeto. Es lo más grande de la etapa.

---

## 9. Preguntas para Gerson

1. **¿Partimos la unidad en dos?** «Movimiento rectilíneo uniforme» (A1–A5, conserva `fisica.movimiento-rectilineo`) y
   «MRUV y caída libre» (B1–B6, unidad nueva `fisica.mruv-y-caida-libre`, con el avance migrado). Recomiendo que sí: es
   la unidad más preguntada de física (20 de San Marcos, 250 fichas), San Marcos ya la parte en sus temas 2 y 3, y en
   seis ideas cada una cargaría dos reglas. Si prefieres una sola unidad, la dejo en seis ideas: MRU con su gráfica,
   medias, encuentros y relativa, aceleración y ecuaciones, gráficas v–t y a–t, y caída libre; se pierden las
   predicciones de A2, A5, B4 y B5.
2. **Signos: ¿un eje con signo o el «±» de la academia?** La academia escribe d = v₀t ± ½at² («+ si acelera, − si
   frena») y h = v₀t ± ½gt² («+ si baja, − si sube»). La unidad de hoy usa un eje con signo. Recomiendo el eje con signo
   (una sola regla que sirve para frenar, para ir y volver, para la cima, para la ecuación horaria y para las áreas bajo
   el eje, que el «±» no explica), y en «La regla» una línea que lo traduce: «En la academia lo verás como d = v₀t ±
   ½at²: es la misma fórmula». Es criterio, no memoria.
3. **En una recta, ¿v, a y Δx sin flecha?** Recomiendo que sí: son números con signo sobre el eje, como ya dice
   `velocidad-relativa` («en una recta las velocidades son números con signo»). «Lee» de A1 lo dice: «en una recta, la
   flecha se resume en un signo». La flecha se dibuja sobre el vehículo, con su valor, y el eje siempre lleva su «+». La
   unidad declara que no tiene magnitudes vectoriales, con el motivo, para el validador.
4. **Colores (sección 6).** ¿Apruebas velocidad naranja, tiempo turquesa, posición y desplazamiento violeta,
   aceleración y g carmín, y distancia recorrida en tinta, igual en las dos unidades? Recomiendo que sí. El carmín de la
   aceleración es la excepción (aquí no hay ángulos y el verde no puede ir junto a la velocidad); el par v–a queda en
   0,062, el mínimo que el molde acepta, siempre con letra y flecha distinta. La otra opción: tiempo en tinta y
   aceleración en turquesa (todos los pares ≥ 0,10), pero entonces la distancia recorrida y el tiempo quedan los dos en
   tinta en «rapidez media = d ÷ Δt». Y para dos móviles: ¿mismo color con trazo distinto (continuo y discontinuo), como
   pide la regla de un color por magnitud? Recomiendo que sí, en vez de un color por vehículo.
5. **La letra d.** En Vectores, d⃗ con flecha fue el desplazamiento en el plano; aquí d sin flecha sería la distancia
   recorrida, como en la academia (d = v·t), y la separación entre dos móviles, D. Recomiendo d para la distancia, con un
   aviso en «Lee» de A3 («sin flecha, d es todo el camino; el desplazamiento en una recta es Δx»), y no tocar Vectores.
6. **¿La caída libre en dos ideas (B5 soltar y B6 lanzar)?** Recomiendo que sí: es el subtema más grande del banco (54
   fichas) y son dos errores distintos con datos (C2 en B5 y C1 en B6). Si se junta, B5 se vuelve una tarjeta de «Lee» y
   se pierde la predicción de las masas (San Marcos 2019-II).
7. **¿B4 (gráficas x–t y a–t) como idea propia?** Recomiendo que sí: es el tema «La recta y la parábola como gráficas»
   del catálogo, junta dos preguntas de San Marcos (2022 y 2024-II) y G4 en a–t es el objetivo más difícil del test de
   Beichner (23 %). La otra opción es repartirla en el nivel examen de B2 y B3, con lo que B queda en cinco ideas.
8. **San Marcos 2023-I (79), el bote con ángulo,** está clasificada en esta unidad pero es suma de vectores en el plano.
   Recomiendo reclasificarla a `fisica.vectores` (su ejemplo «Cruzar un río de la sierra» ya es eso), sacar el tipo `bote`
   de la práctica de MRU y agregar el río en una recta (a favor y en contra) en A5.
9. **Objetos.** ¿Te sirven la combi en la avenida, la gráfica que se dibuja junto a la combi, la recta de la pista
   atlética, la combi y el mototaxi entre paraderos, la ventana de la combi, la combi que arranca y la que frena frente al
   colegio, el atleta de los 100 m, el mototaxi que pasa por el paradero, la regla que se atrapa y la pelota junto al
   pabellón? Los dibuja la sesión como prueba (opciones nuevas en `fis-combi`, `pista` y `torre`, y el mototaxi como
   dibujo nuevo), y tú decides cuáles reemplazas. El «Carrito» de Rive de `docs/pogil-v2-rive.md` no hace falta por ahora.
10. **Límites de velocidad del reglamento.** ¿Los usamos («en una avenida, 50 km/h como máximo»)? Le dan sentido real a
    los km/h de A1 y B2, pero no pude abrir el texto oficial desde esta sesión. Recomiendo usarlos solo si se confirman
    en el D.S. 025-2021-MTC (o si me permites `www.gob.pe` en la red de la sesión para leerlo); si no, quedan fuera y los
    juegos usan rapideces de problema.
11. **Códigos.** ¿Agrego como hipótesis G2-ultimo-punto, MED-SUMA, REL-SIN-MARCO, REL-PITAGORAS, MRUV-FRENO-IGUAL,
    MRUV-NUNCA, C2-suave y C2-liviano, uso MED-PROMEDIO (trampa 10), REL-SENTIDO (trampa 12) y PR1-frenado (trampa 2), y
    parto K1 en K1-a (al cruzarse) y K1-b (al salir juntos)? Recomiendo que sí, anotados en el informe de cinemática.
12. **Nombres.** Recomiendo «Movimiento rectilíneo uniforme» para A y «MRUV y caída libre» para B, y títulos de idea con
    el nombre del tema (sección 1), como pide `docs/teoria.md` 4f. Los `id` no cambian. Si prefieres conservar alguno de
    los de hoy («Encontrarse es estar juntos», «En la cima, g sigue»), dime cuál.
