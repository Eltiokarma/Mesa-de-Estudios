# Propuesta de ideas: «Trabajo, energía y potencia» (`fisica.trabajo-y-energia`)

Etapa 8 del plan de calidad, rama «Mecánica» de Física: la novena unidad, después de «Dinámica» y antes de «Impulso,
cantidad de movimiento y choques», «Gravitación» y «Oscilaciones» · fases 1 a 5 en un solo agente
(`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta se ejecutó sin esperar su visto bueno. Lo que conviene mirar primero está al
final, en «Decisiones tomadas (Gerson revisa después)». No hay ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4 a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y este encargo), las decisiones de las
etapas 2 a 7, `docs/etapa7/propuesta-fisica.md` como modelo, `dinamica.js` (calidad 2) con su auditoría y su lector en
frío (lo que se corrigió ahí y no se repite aquí: DCL con fuerzas en la dirección equivocada o a medias, «a_c» con guion
bajo en texto plano, lecturas que mezclan el valor animado con el redondeado, distractores cuya explicación no da su
valor, casos que repiten un ejemplo, la misión o la predicción, objetos increíbles como una caja a 180 km/h, ítems de la
prueba que son ejemplos resueltos, rótulos pegados), `estatica.js`, `mruv-y-caida-libre.js` y
`movimiento-circular.js` (calidad 2: no se contradicen), la teoría actual (`contenido/teoria/fisica/trabajo-y-energia.js`,
v0.2.0, sin `calidad`), su ficha en `catalogo/cursos/fisica.json`, sus plantillas (`energia`, escena con motor, casos y
papel; `energia-potencia`, generador sin datos), `docs/investigacion/estatica-energia-ideas-erroneas.md` (W1 a W15, con
el EMCS de Singh y Rosengrant), `docs/teoria/matriz/fisica.json` (unidad 7), `docs/temario-completo.md` (unas 74 fichas
en el banco Cuzcano), `catalogo/pruebas/fisica.json` (fis-05 y fis-10 son de esta unidad) y las 24 preguntas de la unidad
en `docs/datos/admision-unmsm.csv`. Vecinas: Estática (la fuerza elástica, k y x, la normal, el rozamiento y la tercera
ley: se usan, no se repiten), Dinámica (ΣF = m · a, la normal con una fuerza oblicua, el plano inclinado, f_k = μ_k · N),
MRUV y caída libre (v² = v₀² + 2 · a · d y d = a · t²/2 van como datos) e Impulso y choques, que sigue: aquí no aparece
la cantidad de movimiento, ni el impulso, ni un choque (la pelota que rebota se mira solo por su energía). Gravitación se
queda con la energía potencial de las órbitas (aquí, m · g · h cerca del suelo) y Oscilaciones, con la energía del MAS.

## Qué se pregunta en los exámenes

- **UNI:** semana 6 del CEPRE-UNI (trabajo, energía, potencia).
- **San Marcos:** tema 7 del CEPRE-UNMSM.
- **Banco Cuzcano (unas 74 fichas):** trabajo de fuerzas constantes y variables 23, conservación de la energía mecánica
  18, teorema trabajo-energía cinética 10, energía con fuerzas no conservativas 7, potencia y eficiencia 6.

**En la admisión real de San Marcos (2019-I a 2027-I) hay 24 preguntas de esta unidad:**

| # | Periodo (pregunta) | Qué piden | Trampa | Idea |
| --- | --- | --- | --- | --- |
| 1 | 2019-I (106) | Profundidad de un pozo con el trabajo para subir a una persona | — | 3 |
| 2 | 2019-II (106) | Energía que disipa el rozamiento al arrastrar con fuerza oblicua | La normal igual al peso | 1 |
| 3 | 2021 (82, examen) | Potencia de un motor que sube una carga | — (sin clave oficial) | 6 |
| 4 | 2021 (91, examen) | Trabajo de un ascensor que deja carga en cada piso | Usar la carga inicial en todo el recorrido | 1 |
| 5 | 2021 (82) | μ de un segundo tramo rugoso para que el cuerpo se detenga | Olvidar el primer tramo | 5 |
| 6 | 2021 (85) | Potencia para arrastrar un auto a rapidez constante | No pasar km/h a m/s | 6 |
| 7 | 2022 (84) | Potencia de una bomba con el caudal y la altura | No pasar L/min a kg/s | 6 |
| 8 | 2023-I (92) | Potencia de un motor que vence peso y rozamiento | Olvidar el rozamiento | 6 |
| 9 | 2023-I (80) | Rapidez de un tractor en una cuesta con rozamiento | Olvidar el peso a lo largo de la cuesta | 6 |
| 10 | 2023-II (89) | Fuerza del motor con potencia y rendimiento | Rapidez media en P = F · v | 6 |
| 11 | 2023-II (82) | Rapidez de un proyectil de resorte con masa efectiva | Ignorar la masa efectiva | — (queda en `energia-potencia`) |
| 12 | 2024-I (89) | μ_k con la distancia de frenado | Olvidar el 2 del teorema | 2 |
| 13 | 2024-I (88) | Rapidez final en un camino liso con desnivel y v₀ | Creer que la forma del camino importa | 4 |
| 14 | 2024-I (81) | Potencia que consume una bomba con pérdidas | Multiplicar por la eficiencia | 6 |
| 15 | 2024-II (80) | Altura tras dos rebotes que pierden un porcentaje | Una pérdida por rebote y no por tramo | 5 |
| 16 | 2025-I (91) | Trabajo neto como cambio de energía cinética | Dar la energía final | 2 |
| 17 | 2025-II (91) | Trabajo neto sobre un bloque que recorre d en t | La velocidad media como aceleración | 2 |
| 18 | 2025-II (84) | Estiramiento máximo de un resorte vertical | El estiramiento de equilibrio | 4 |
| 19 | 2026-II (90) | V/F de fuerza, trabajo y potencia de un montacargas | Sumar trabajo de más | 1 y 6 |
| 20 | 2026-II (88) | Altura sobre el suelo con una energía cinética dada | Medir desde la azotea | 4 |
| 21 | 2026-II (81) | Rapidez de un collarín jalado por una cuerda y una polea | El desplazamiento del collarín | 1 y 2 |
| 22 | 2027-I (89) | Energía elástica con la fuerza y la deformación | F · x sin el medio | 3 |
| 23 | 2027-I (84) | Rapidez al pie de una pendiente lisa | La inclinación cambia la rapidez | 4 |
| 24 | 2027-I (83) | Rapidez de un collarín que estira un resorte | Medir la deformación desde cero | 4 |

Por idea: 1 · 4 · 2 · 6 · 2 · 7 (las de dos ideas cuentan en las dos).

---

## 0. Diagnóstico de la teoría actual

`trabajo-y-energia.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene cinco ideas: `trabajo-y-angulo`,
`trabajo-energia-cinetica`, `energia-potencial`, `conservacion-energia` y `potencia-y-eficiencia`, y tres mesas
(`cuerda-libre`, `rampa`, `empujon`).

**Lo que se queda:** los cinco temas del catálogo, los cinco ids (el avance se guarda con ellos), la gráfica F–x para la
fuerza variable, las barras de energía, la rapidez abajo que no depende del camino, el resorte como área de un
triángulo, el motor que sube una carga, la historia de Joule con su fuente y las tres mesas con sus ids.

**Lo que falla contra el contrato:**
1. **Punto 1:** las cinco ideas abren con un rectángulo sobre una línea o con una gráfica (`fis-lienzo`, `ejes`): no hay
   maleta, carrito, edificio, tobogán ni montacargas.
2. **Regla 3:** tres predicciones ya se vieron jugando: el juego de la idea 1 gira la fuerza y pasa por 90° (Predice
   pregunta por la fuerza vertical), el de la idea 5 muestra la barra útil fija mientras cambia el tiempo (Predice
   pregunta si cambia el trabajo) y el de la idea 2 deja ver K con v y 2v.
3. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad`, `pregunta` ni ejemplos (0 de 75).
4. **Punto 13:** ningún ejercicio trae `datos`; «Con g = 10 m/s²» va dentro de la pregunta.
5. **Colores y regla 4:** la fuerza en naranja, pero la energía cinética en carmín (el color del peso en Estática y
   Dinámica) y la potencial en verde, junto al naranja (0,010 en protanopía).
6. **Letras:** K y U (la academia y el examen escriben E_C, E_PG, E_PE y E_M); P de potencia junto al P⃗ de peso de las
   dos unidades anteriores, sin aviso.
7. **Rodar:** la «bolita» que baja por la rampa rueda (la energía de giro queda fuera del modelo: matriz, condiciones).
8. Glosario de 10 términos sin `simple` y con un solo ejemplo; «postulante de 4.º» en la cabecera; lecturas con números
   sueltos («t = 20 s · P útil = 250 W · consume 313 W»).
9. **Práctica:** la escena vieja mezcla los temas sin datos; `energia-potencia` no da datos (`datos: ''`) ni separa por
   idea.
10. **Falta un tema que el banco y el examen piden:** la energía con rozamiento (7 fichas del banco, el error objetivo
   de la matriz «energía conservada implica energía mecánica constante», dos preguntas de San Marcos): hoy es una línea
   de la idea 4.

---

## 1. Las ideas, en orden

Cinco temas del catálogo en **seis ideas** (no se parte la unidad: decisión 1).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `trabajo-y-angulo` | Trabajo de una fuerza | Una fuerza trabaja solo con su parte a lo largo del camino: W = F · d · cos θ; de lado, cero; en contra, negativo. Si cambia, es el área bajo F–x. |
| 2 | `trabajo-energia-cinetica` | Trabajo neto y energía cinética | El trabajo de todas las fuerzas juntas es lo que gana la energía cinética, ½ · m · v²: el doble de rapidez pide cuatro veces el trabajo. |
| 3 | `energia-potencial` | Energía potencial | La energía potencial gravitatoria es m · g · h desde una referencia que se elige; sus cambios no dependen de ella. Un resorte guarda ½ · k · x². |
| 4 | `conservacion-energia` | Conservación de la energía mecánica | Sin rozamiento, la cinética más la potencial no cambia: la rapidez abajo depende de la altura, no del camino ni de la masa. |
| 5 | `energia-y-rozamiento` | Energía con rozamiento | Con rozamiento, la energía mecánica baja lo que vale el trabajo del rozamiento, que se vuelve calor y sí depende del camino. |
| 6 | `potencia-y-eficiencia` | Potencia y eficiencia | La potencia es el trabajo en cada segundo, P = W/t = F · v; la eficiencia es lo útil entre lo consumido, nunca más de 1. |

Los cinco ids se quedan; todos estrenan otra Predice y otro juego. La idea 5 es nueva (decisión 2).

`pregunta` (Resumen): 1 «¿Cuánto trabaja tu mano cuando jalas una maleta?» · 2 «¿Qué le hace el trabajo neto a la rapidez
de un cuerpo?» · 3 «¿Desde dónde se mide la energía de una maceta en el balcón?» · 4 «¿De qué depende la rapidez al
final del tobogán?» · 5 «¿Adónde va la energía que se lleva el rozamiento?» · 6 «¿Cuánto consume un motor que entrega
500 W?»

`actividad`: 1 «Jalar una maleta de rueditas por el asa, con más o menos fuerza y más o menos inclinada.» · 2 «Empujar
desde el reposo un carrito de ladrillos, con más o menos fuerza y distancia.» · 3 «Poner una maceta en un balcón y elegir
desde dónde se mide su altura.» · 4 «Soltar a un niño desde lo alto de un tobogán más o menos alto.» · 5 «Soltar una
caja por una rampa de tablones, más o menos áspera.» · 6 «Subir una carga con el montacargas de la obra, más o menos
rápido.»

Glosario que estrena cada idea (con `simple`, 15 términos): 1 trabajo, joule, gráfica F–x · 2 energía cinética, trabajo
neto · 3 energía potencial gravitatoria, nivel de referencia, energía potencial elástica · 4 energía mecánica, fuerza
conservativa · 5 fuerza no conservativa, energía disipada · 6 potencia, watt, eficiencia. «Fuerza», «peso», «normal»,
«rozamiento», «fuerza elástica», «constante elástica» y «deformación» vienen de Estática; «fuerza neta», de Dinámica;
«distancia de frenado» y «área bajo la gráfica», de MRUV; «calor» se define en Temperatura y calor.

**Por qué va cada una en su lugar y qué da por sabido**

- **1. Trabajo de una fuerza.** La raíz: una fuerza, un camino y el ángulo entre los dos. Usa la descomposición de una
  fuerza oblicua de Dinámica. Ataca W4 (trabajo es esfuerzo), TR-PERP (fuerza por distancia sin mirar el ángulo) y W3 (el
  signo). Entra la fuerza variable como área bajo F–x (el tema del catálogo es uno solo: «fuerzas constantes y
  variables»). Nivel examen: el rozamiento con fuerza oblicua (San Marcos 2019-II, N ≠ m · g), el montacargas que deja
  carga (2021) y el collarín de la polea (2026-II).
- **2. Trabajo neto y energía cinética.** Necesita la 1. Ataca TE-LINEAL y W7 (el doble de rapidez, el doble de trabajo)
  y W6. Nivel examen: μ_k con la frenada (2024-I), el trabajo neto con d y t (2025-II), la energía final como trabajo
  (2025-I) y la gráfica F–x con rapidez final.
- **3. Energía potencial.** Necesita la 1 (el trabajo del peso es ± m · g · h) y, de Estática, k y x. Ataca EP-REF (la
  energía «está» en la altura desde el suelo) y W12. El resorte vuelve a la gráfica F–x de la idea 1: su área es un
  triángulo. Nivel examen: la profundidad del pozo (2019-I), ½ · F · x (2027-I) y estirar de x₁ a x₂.
- **4. Conservación.** Necesita 2 y 3. Ataca W1 y CE-CAMINO (la forma del tobogán, dos preguntas de San Marcos) y W9 (el
  más pesado llega antes). Nivel examen: la altura con una E_C dada (2026-II), el resorte vertical (2025-II), el
  desnivel con v₀ (2024-I).
- **5. Energía con rozamiento.** Necesita 2, 4 y el rozamiento de Dinámica. Ataca CE-ROCE (aplicar la conservación con
  rozamiento), W14 (la energía «se gasta») y, en la predicción, el exceso de la idea 4: con rozamiento el camino sí
  importa. Nivel examen: los rebotes (2024-II), las dos zonas rugosas (2021) y lo que sube por una rampa áspera.
- **6. Potencia y eficiencia.** Al final: el tiempo entra recién aquí. Ataca W15 (potencia como fuerza o energía),
  PO-EFIC (multiplicar por η, 2024-I) y la rapidez media en P = F · v (2023-II). Nivel examen: el tractor en la cuesta
  (2023-I), la bomba con caudal (2022), el motor del auto (2023-II).

**Qué no entra:** la cantidad de movimiento, el impulso y los choques (Impulso y choques: la pelota que rebota solo
pierde un porcentaje de energía, sin choque que calcular); la energía potencial gravitatoria de las órbitas (Gravitación);
la energía del MAS (Oscilaciones); la masa efectiva del resorte (2023-II, queda en `energia-potencia`); lo que rueda (todo
desliza: niño, caja, collarín); la energía interna y el calor como tema (Temperatura y calor: aquí «se vuelve calor» y
nada más).

---

## 2. Objeto de la primera pantalla

La pieza `fis-estatica` se reusa (con sus flechas, cotas, rótulos y los objetos de Estática y Dinámica) y crece con un
bloque propio de Energía (decisión 10): `maleta`, `barra-e` (una barra de energía), `tobogan`, `sentado` (un niño
sentado), `maceta`, `edificio` y `motor`. Dibujos de prueba (`data-prueba`), con su prueba numérica de encuadre y de
rótulos.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **La maleta de rueditas** jalada por el asa en el pasillo del terminal | la flecha del asa = F⃗; la punteada, su parte a lo largo del piso; la cota = d |
| 2 | **El carrito de ladrillos** de la obra, empujado desde el reposo | la mano = F⃗; las barras = W y E_C |
| 3 | **La maceta en un balcón** de un edificio de tres pisos | la línea de la referencia = desde dónde se mide h; la barra = E_PG |
| 4 | **El niño en el tobogán** del parque | las barras = E_PG y E_C; su suma, E_M |
| 5 | **La caja en la rampa de tablones** del almacén | las barras = E_PG arriba; E_C y lo que se vuelve calor abajo |
| 6 | **El montacargas** de la obra | el motor, el cable y la carga; la lectura, los watts |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (relación) |
| --- | --- | --- | --- | --- |
| 1 | «En el terminal jalas tu maleta 5 m por el piso, tomada del asa.» **Haz que el asa haga 160 J de trabajo.** | `F` 10–50 N de 10 en 10; `θ` 0°, 37°, 53° | 40 N a 37° (un solo caso) | «40 N a 37°: 32 N van por el piso; W = 160 J» |
| 2 | «En la obra empujas desde el reposo un carrito de 20 kg; el piso casi no frena.» **Haz que el carrito salga a 3 m/s.** | `F` 10–40 N; `d` 1–4 m | 30 N por 3 m (un solo caso) | «30 N por 3 m: W = 90 J; sale a 3 m/s» |
| 3 | «Una maceta de 2 kg en un balcón; tú eliges desde dónde se mide la altura.» **Haz que su energía potencial valga −60 J.** | balcón 1.º, 2.º, 3.º (3, 6, 9 m); referencia vereda, 1.er piso, azotea (0, 3, 12 m) | 3.er piso desde la azotea | «Desde la vereda está 6 m arriba: E_PG = 120 J» |
| 4 | «Un niño de 30 kg se suelta desde lo alto del tobogán liso.» **Elige la altura para que llegue abajo a 6 m/s.** | `h` 1,25; 1,8; 3,2; 5 m; avance (▶) | h = 1,8 m | «Arriba 540 J; aquí, 270 J de E_PG y 270 J de E_C» |
| 5 | «Sueltas una caja de 2 kg por una rampa de tablones a 37°.» **Haz que el rozamiento convierta justo 40 J en calor.** | `h` 2–5 m; `μ_k` 0; 0,15; 0,3; 0,45 | h = 5 m con μ_k = 0,3 | «Arriba 100 J; abajo 60 J de E_C y 40 J de calor» |
| 6 | «El montacargas sube 50 kg de cemento 10 m.» **Haz que el motor desarrolle 125 W.** | `t` 10, 20, 25, 40, 50 s; avance (▶) | t = 40 s | «5000 J en 40 s: 125 J cada segundo» |

Para que la predicción quede fuera de lo jugado: 1 el asa no pasa de 53° (Predice: la mano que sostiene, a 90°); 2 el
carrito no pasa de 4 m/s (Predice: de 3 a 6 m/s); 3 el juego muestra cada balcón por separado (Predice: el cambio al caer
de un balcón a otro, con dos referencias); 4 hay un solo tobogán, recto (Predice: recto contra curvo); 5 una sola rampa,
de 37° (Predice: 37° contra 53° con el mismo piso); 6 el motor no pierde nada (Predice: el que aprovecha el 80 %).

---

## 4. La predicción de cada idea

La app baraja las opciones; `datos` lleva solo valores, nunca la relación que se predice.

**1.** «Ahora llevas tu mochila colgada de la mano y caminas 10 m por un piso horizontal, siempre a la misma rapidez.
¿Cuánto trabajo hace tu mano sobre la mochila?» Datos: la mochila pesa 50 N; tu mano la sostiene hacia arriba con 50 N;
caminas 10 m en horizontal, a rapidez constante.
| 0 J (correcta) | 500 J (TR-PERP: fuerza por distancia) | −500 J (TR-SIGNO) | Depende de lo rápido que camines (TR-RAPIDEZ, pariente de W15) |

**2.** «Para llevar el carrito del reposo a 3 m/s hicieron falta 90 J. ¿Cuánto trabajo hace falta para llevarlo del reposo
a 6 m/s?» Datos: del reposo a 3 m/s, 90 J; el mismo carrito de 20 kg; el piso casi no frena.
| 360 J (correcta) | 180 J (TE-LINEAL, W7) | 90 J (TE-IGUAL: el mismo carrito) | Depende de cuánto tarde (TE-TIEMPO) |

**3.** «La maceta cae del balcón del 3.er piso al del 1.er piso. ¿Cuánto cambia su energía potencial si la mides desde la
vereda, y si la mides desde la azotea?» Datos: la maceta tiene 2 kg; balcones a 3 m, 6 m y 9 m sobre la vereda; la
azotea, a 12 m; g = 10 m/s².
| Baja 120 J con las dos referencias (correcta) | Baja más desde la vereda (EP-REF) | Desde la azotea sube, porque se aleja (EP-SIGNO) | Desde la azotea no cambia: no la toca (EP-CERO) |

**4.** «Dos toboganes lisos de 4 m de alto: uno recto y corto, el otro curvo y más largo. ¿En cuál llega más rápido abajo
el mismo niño?» Datos: los dos tienen 4 m de alto; parte del reposo; sin rozamiento ni aire.
| Igual de rápido en los dos (correcta) | En el curvo: tiene más camino para acelerar (W1) | En el recto: es más directo (CE-CAMINO) | En el curvo: al principio es más empinado (CE-FORMA) |

**5.** «Ahora hay dos rampas de 3 m de alto con los mismos tablones ásperos: una a 37° y otra a 53°. ¿En cuál llega más
rápida la caja abajo?» Datos: las dos tienen 3 m de alto y el mismo μ_k; la caja parte del reposo.
| En la de 53°, la más empinada (correcta) | Igual: tienen la misma altura (CE-ROCE) | En la de 37°: tiene más camino para acelerar (W1) | En la de 37°: la rampa la empuja más (RZ-NORMAL) |

**6.** «Otro motor entrega 500 W a la carga, pero solo aprovecha el 80 % de la energía eléctrica que consume. ¿Cuánta
potencia consume?» Datos: entrega 500 W a la carga; aprovecha el 80 % de lo que consume.
| 625 W (correcta) | 400 W (PO-EFIC: multiplica por 0,8) | 500 W (PO-IGNORA) | 600 W (PO-SUMA: suma el 20 % de 500) |

---

## 5. Tabla de letras (campo `letras`)

| Letra | Significado único | Aviso |
| --- | --- | --- |
| F⃗, F | Una fuerza de una mano, un motor o una cuerda (sin subíndice) | — |
| W | Trabajo de una fuerza; W_F, W_peso, W_N, W_f el de cada una; W_neto, el de todas | «W» después de un número es el watt (idea 6): se avisa |
| d | Distancia que recorre el cuerpo | De MRUV |
| θ | Ángulo entre la fuerza y el desplazamiento | Se dice en cada ejercicio |
| x | Posición en la gráfica F–x; en un resorte, su deformación | De Estática |
| m, g | Masa; g = 10 m/s² | — |
| v, v₀ | Rapidez al final y al empezar | De MRUV |
| h | Altura sobre la referencia | — |
| E_C, E_PG, E_PE, E_M | Energía cinética, potencial gravitatoria, potencial elástica y mecánica | Notación de la academia y del examen |
| k | Constante elástica | De Estática |
| f_k, μ_k, N | Rozamiento cinético, su coeficiente y la normal | De Estática y Dinámica |
| t | Tiempo | Llega en la idea 6 (y en el dato de MRUV de la idea 2) |
| P, P_útil, P_consumida | Potencia; la útil y la que consume una máquina | **P es la potencia; el peso se escribe m · g** (decisión 4) |
| η | Eficiencia (se lee «eta») | — |

---

## 6. Mapa de colores (§5b): las fuerzas con los colores de Estática; cada trabajo y cada energía con el de su fuerza

| Token | Qué | Por qué |
| --- | --- | --- |
| `h` carmín | **El peso** (m · g⃗), g, su trabajo W_peso y la **energía potencial gravitatoria** E_PG | El de Estática y Dinámica; E_PG es lo que el peso puede devolver |
| `o` naranja | **F⃗** de la mano, la cuerda o el motor, la fuerza del resorte, su trabajo W_F y la **energía potencial elástica** E_PE | El de Estática (tensión, mano y resorte) |
| `i` turquesa | **El rozamiento** f⃗, su trabajo W_f y **lo que se vuelve calor** | El de Estática |
| `f` violeta | **La normal** N⃗ y su trabajo W_N | El de Estática |
| tinta | a⃗, ΣF⃗, W_neto, **E_C**, E_M, v⃗, m, d, h, x, k, θ, t, P, η, los objetos y lo pedido («?») | Como la aceleración y la fuerza neta en Dinámica (decisión 3) |
| `d` verde | No se usa | Iría junto al naranja (0,010 en protanopía) |

Distancias OKLab de Estática (peor caso entre visión normal y protan/deutan/tritan): carmín–violeta 0,167; violeta–naranja
0,189; naranja–turquesa 0,114; violeta–turquesa 0,101; carmín–turquesa 0,077; carmín–naranja 0,062 (E_PG junto a E_PE:
siempre con su nombre escrito bajo la barra).

---

## 7. Práctica: qué existe y qué falta por idea

Hay: la escena `energia` (rampas, resorte, F–x, potencia; 0.2.0, sin datos) y `energia-potencia` (catorce subtipos de
potencia, bombas, rebotes, cuerda y masa efectiva; sin datos). Falta todo lo demás: nada separa por idea ni trae
`datos`.

Propuesta: **generador nuevo `plantillas/fis-energia/`** (formato `predicciones`, `TIPOS_POR_IDEA`, tres tipos por idea,
del nivel 1 al de examen, `datos` por línea con prueba en 400 semillas, `casos.json` verificado aparte, papel de 10), que
usa el motor de la escena `energia` (`trabajos`, `areaPartes`, `trabajoResorte`, `potencia`, `rapidez`) y no lo copia.
La escena `energia` y `energia-potencia` van las dos a «Más mesas del tema» (decisión 11). Dos ítems para la prueba del
curso, a la reserva (las formas ya tienen 10 pares): `fis-31` (el trabajo del rozamiento con la cuerda inclinada) y
`fis-32` (la rapidez abajo de una rampa áspera).

## 8. Datos del mundo

Valores de problema, posibles: maletas de 10 a 25 kg jaladas con 10 a 50 N; carritos de obra de 20 a 60 kg a menos de
5 m/s; balcones de 3 m por piso; toboganes de parque de 1,25 a 5 m de alto (rapideces de 5 a 10 m/s); rampas de
almacén de 2 a 5 m de alto; montacargas de obra que suben 50 a 200 kg en decenas de segundos; motores de 100 W a unos
pocos kW; bombas de casa de 0,5 a 2 kW; un foco LED de unos 10 W y una terma de unos 1500 W (valores de libro, con
«unos»). g = 10 m/s² (convención del examen); sen 37° = 3/5 y cos 37° = 4/5 (convención del examen); 1 HP = 746 W y 1 L
de agua ≈ 1 kg (valores de libro). Ningún dato puntual del mundo necesita fuente. La historia de Joule se queda con la
suya (Science Museum Group).

## 8b. Orden con otras unidades (`requiere`)

Se queda `fisica.dinamica` (que trae Estática, MRUV y Movimiento circular en su cadena). Impulso y choques, Termodinámica,
Fluidos, Oscilaciones y Física moderna siguen pidiendo esta unidad. El mapa no cambia.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, sin partir la unidad; la idea 5 es nueva.** *Motivo:* cinco temas del catálogo, 74 fichas y 24
   preguntas; la energía con rozamiento tiene 7 fichas, el error objetivo de la matriz y la mejor predicción de la unidad
   (con rozamiento, el camino sí importa: corrige el exceso de la idea 4). *Descartada:* dejarla como una línea de la
   idea 4 (dos reglas en una idea) o una séptima idea propia para la fuerza variable (`septimaIdea`).
2. **La fuerza variable va donde se usa** (cambio tras la nota de la sesión sobre la idea 1): el área bajo F–x entra
   en la idea 2 (tarjeta de «Lee», La regla y casos de examen con la gráfica y la rapidez final) y el resorte, en la 3
   (E_PE como el área del triángulo). El trabajo del peso también pasó a la idea 3 (W_peso = −ΔE_PG). La idea 1 enseña
   solo W = F · d · cos θ y su signo, con una fórmula por renglón en La regla. *Descartada:* las tres fórmulas juntas en
   la idea 1 (se partían mal y mezclaban tres reglas) o una idea propia (siete ideas).
3. **E_C y E_M en tinta**, como la aceleración y la fuerza neta en Dinámica; cada trabajo y cada energía potencial
   llevan el color de su fuerza (W_peso y E_PG carmín, W_F y E_PE naranja, W_f y el calor turquesa, W_N violeta).
   *Motivo:* las cuatro clases de fuerza ya usan los cuatro colores de la rama; la energía cinética es de la rapidez, que
   va en tinta. *Descartada:* E_C en carmín (como en la unidad vieja: chocaría con el peso) o en verde (junto al naranja).
4. **P es la potencia y el peso se escribe m · g**, también en los rótulos de las figuras («m · g = 50 N»). *Motivo:* el
   examen y la academia escriben P = W/t; dos significados de P en una unidad rompen la tabla de letras. La idea 6 lo
   avisa en «Lee». *Descartada:* «Pot» para la potencia (no es la notación del examen) o seguir con P⃗ de peso.
5. **E_C, E_PG, E_PE y E_M**, la notación de la academia y del examen, en vez de K y U. *Descartada:* K y U (la unidad
   vieja; no se usan en el examen).
6. **El juego de la idea 1 dibuja solo la fuerza del asa** (y su parte a lo largo del piso), no un DCL: el peso y la
   normal de la maleta, con su trabajo cero, delatarían la Predice. La regla de Dinámica («si se dibuja una fuerza, se
   dibujan todas») sigue en los DCL de los ejemplos. *Descartada:* el DCL completo en el juego.
7. **Todo lo que baja, desliza** (el niño, la caja, el collarín): nada rueda, para que la energía de giro no falte.
   *Descartada:* la bolita de la unidad vieja.
8. **La pelota que rebota se mira solo por su energía** (pierde un porcentaje en cada bote): ni velocidades de choque ni
   coeficiente de restitución, que son de Impulso y choques. *Descartada:* sacar los rebotes (es una pregunta de San
   Marcos).
9. **Avance:** los cinco ids se quedan y cambian de Predice: sus predicciones viejas sin huella se borran una vez; la
   unidad suma `energia-y-rozamiento`, así que quien terminó las cinco de antes conserva «Ya la estudié»
   (`REHECHAS_E6` en `nucleo/avance.js`, marcas `prediccionTE` y `estudiadaTE`, con su prueba).
10. **La pieza `fis-estatica` crece con un bloque de Energía** (`maleta`, `barra-e`, `tobogan`, `sentado`, `maceta`,
    `edificio`, `motor`) sin tocar los objetos de Estática ni de Dinámica, con su prueba aparte
    (`fis-estatica-energia.test.js`). *Motivo:* las flechas, cotas, rótulos y la persona son los mismos.
    *Descartada:* una pieza nueva que copiaría 400 líneas.
11. **Práctica:** generador nuevo `fis-energia` sobre el motor de la escena; **la escena `energia` y `energia-potencia`
    van a «Más mesas del tema»** (`"rehacer": true`). *Motivo:* ninguna trae datos ni separa por idea; la escena mezcla los
    temas. `energia-potencia` se queda en la ficha por la masa efectiva y los subtipos que el generador nuevo no cubre.
    *Descartada:* escribirle los datos a sus catorce subtipos.
12. **Códigos nuevos como hipótesis** (TR-*, TE-*, EP-*, CE-*, RZ-*, PO-*), anotados en
    `docs/investigacion/estatica-energia-ideas-erroneas.md` al cerrar. W1, W3, W4, W5, W6, W7, W9, W14 y W15 tienen
    respaldo del informe.

## Lo que se hizo (20 nov, fases 2 a 5)

- **Teoría** (`contenido/teoria/fisica/trabajo-y-energia.js`, v0.3.0, `estado: 'completa'`, sin `calidad`): las seis
  ideas con Lee, Juega con misión de un solo caso en la grilla, Predice, Mira, La regla (con dibujo propio y una fórmula
  por renglón), Así se resuelve, Ahora tú, glosario (16 términos con `simple` y tres ejemplos) y 15 ejemplos cada una
  (90; los 30 de examen con A–E seis veces cada una). Las tres mesas del laboratorio, redibujadas. Tabla `letras` y
  `colores` en la unidad. Prueba propia `trabajo-y-energia.test.js`: forma, colores, los 90 ejemplos contra una tabla
  calculada aparte, «Ahora tú» en 400 semillas contra el motor de la escena y fórmulas propias, las reglas de calidad 2
  en 400 semillas, misiones, figuras y la migración del avance.
- **Pieza**: `nucleo/kit/piezas/fis-estatica.js` con un bloque propio de Energía (maleta, barra de energía, tobogán,
  persona sentada, maceta, edificio y motor, más `enTobogan`) y su prueba aparte, `fis-estatica-energia.test.js`. Los
  objetos de Estática y de Dinámica no cambiaron.
- **Práctica** `plantillas/fis-energia/` (18 tipos, tres por idea, del nivel 1 al de examen, sobre
  `plantillas/energia/motor.js`; 22 casos verificados con un script aparte; 8 problemas de papel). Las escenas `energia`
  y `energia-potencia` van a «Más mesas del tema» (`"rehacer": true`).
- **Prueba del curso**: `fis-31` (el bloque jalado con cuerda inclinada y rozamiento) y `fis-32` (la rampa áspera de
  37°), a la reserva, con su verificador sobre los motores de las escenas.
- **Avance**: `prediccionTE` y `estudiadaTE` en `nucleo/avance.js` (`REHECHAS_E6`), con su prueba.
- **Códigos** nuevos en `docs/investigacion/estatica-energia-ideas-erroneas.md`, «Trabajo, energía y potencia (19 nov
  2026)».

### Decisiones nuevas de las fases 2 a 5 (Gerson revisa después)

13. **Misiones de un solo caso** (nota de la sesión): idea 1 «Haz que tu jalón haga un trabajo de 160 J» (40 N a 37°;
    32 N a 0° no está en la grilla), idea 2 «llegue a 3 m/s», idea 3 «−60 J», idea 4 «6 m/s», idea 5 «40 J de calor»,
    idea 6 «125 W». Donde se usa cos 37° = 0,8 o cos 53° = 0,6 dice «(convención del examen)».
14. **Una figura que pide el trabajo de una sola fuerza dibuja solo esa fuerza**; los DCL completos van donde se piden
    todas (trabajo neto, rozamiento). Como en Dinámica, los DCL van sin escala.
15. **El calor del rozamiento se dice «energía disipada»** (glosario) y va en turquesa, con la flecha del rozamiento; la
    energía interna y la temperatura quedan para Calorimetría.
16. **Sin cantidad de movimiento**: los rebotes, el bloque que choca y el montacargas se resuelven solo con energía; la
    rapidez justo antes y después de un choque queda para Impulso y choques.
