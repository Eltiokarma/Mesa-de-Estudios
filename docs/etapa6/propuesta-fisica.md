# Propuesta de ideas: «Estática: equilibrio y torque» (`fisica.estatica`)

Etapa 6 del plan de calidad, rama «Mecánica» de Física: la sexta unidad, después de «Movimiento parabólico» y
«Movimiento circular» · fases 1 a 5 en un solo agente (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta se ejecutó sin esperar su visto bueno. Lo que conviene mirar primero está al
final, en «Decisiones tomadas (Gerson revisa después)». No hay ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y este encargo), las decisiones de las
etapas 2 a 5, `docs/etapa5/propuesta-fisica.md` como modelo, `movimiento-circular.js` (calidad 2) con su auditoría y su
lector en frío (lo que se corrigió ahí: glosario que da la clave de una Predice conceptual, igualdades con «=» que son
redondeos, «Ahora tú» con 3 opciones, Mira que usa la fórmula antes de la regla, fórmulas partidas en dos renglones,
explicaciones de distractores que no se pueden rehacer), la teoría actual (`contenido/teoria/fisica/estatica.js`,
v0.1, sin `calidad`), su ficha en `catalogo/cursos/fisica.json`, sus plantillas (`estatica`, escena con motor, casos y
papel; `dinamica-fuerzas`, generador compartido con Dinámica y Gravitación), `docs/investigacion/estatica-energia-ideas-erroneas.md`
(E1 a E11) y `dinamica-ideas-erroneas.md` (D6, D11), la trampa 7 de `docs/clasificacion/trampas-admision-unmsm/fisica.md`,
el banco Cuzcano (unidad 4: 120 fichas), `docs/temario-completo.md` (unidad 4), `catalogo/pruebas/fisica.json` (fis-16 en
la reserva) y las 7 preguntas de la unidad en `docs/datos/admision-unmsm.csv`. Vecinas: Vectores (componentes,
resultante y Pitágoras se usan, no se repiten), MRU (el «velocidad constante» de la primera ley) y Dinámica, que sigue
y se queda con la segunda ley, la masa contra el peso, el rozamiento con aceleración, los bloques que aceleran y la
dinámica circular.

## Qué se pregunta en los exámenes

- **UNI:** semana 4 del CEPRE-UNI (estática: primera y tercera ley, DCL, equilibrio de la partícula y del cuerpo
  rígido, torque, rozamiento estático).
- **San Marcos:** tema 6 del CEPRE-UNMSM. La trampa 7 del informe de trampas («la normal igual al peso aunque haya una
  fuerza oblicua») sale **5 veces** en la admisión real.
- **Banco Cuzcano (120 fichas):** equilibrio de una partícula 38, equilibrio del cuerpo rígido 37, rozamiento estático
  y cinético 12, equilibrio con poleas 10, diagrama de cuerpo libre 8.

**En la admisión real de San Marcos (2019-I a 2027-I) hay 7 preguntas de esta unidad:**

| # | Periodo (pregunta) | Qué piden | Trampa | Idea |
| --- | --- | --- | --- | --- |
| 1 | 2019-I (105) | V/F de las fuerzas sobre un bloque que sube a velocidad constante por un plano rugoso | Creer que la fuerza aplicada es la resultante si la velocidad es constante | 1 (primera ley) y 3 |
| 2 | 2021 (83) | Reacciones del piso sobre una escalera apoyada en una pared lisa, con una persona | — (sin clave oficial) | 6 |
| 3 | 2023-II (81) | Reacción de la pared sobre una escaladora sostenida por una cuerda inclinada | Igualar la reacción al peso sin el triángulo de fuerzas | 2 |
| 4 | 2025-I (83) | Normal de un bloque arrastrado con fuerza oblicua hacia arriba, a velocidad constante | La normal igual al peso | 3 |
| 5 | 2026-II (85, área C) | Fuerza oblicua mínima que inicia el movimiento con rozamiento estático | La normal igual al peso | 3 |
| 6 | 2026-II (82, área A) | Fuerza de la articulación del hombro, con el músculo inclinado (torques y fuerzas) | Dar solo una componente de la reacción | 6 |
| 7 | 2027-I (82) | Estiramiento de un resorte unido a una polea móvil con dos tramos inclinados | Tomar la fuerza del resorte igual a una sola tensión | 4 (y 2) |

Por idea: 1 ½ · 2 1½ · 3 2½ · 4 1 · 5 0 (es la base de la 6) · 6 2.

---

## 0. Diagnóstico de la teoría actual

`estatica.js` (v0.1, `estado: 'completa'`, sin `calidad: 2`) tiene seis ideas: `diagrama-y-parejas`,
`nudo-en-equilibrio`, `rozamiento-se-ajusta`, `resorte-proporcional`, `torque-y-brazo` y `polea-movil`, y tres mesas
(`palanca-libre`, `caja-con-masa`, `nudo-libre`).

**Lo que se queda:** la normal que crece con un empujón (N = P + F), el nudo con dos cuerdas, el rozamiento que se
ajusta hasta μ_s·N (E10), la deformación medida desde el largo natural, el brazo como distancia perpendicular, los
códigos de error de la cabecera y las tres mesas (con sus ids y controles). El motor de la escena `estatica` (barra,
nudo, rampa con roce, polea, momento de una fuerza) sirve a la práctica nueva.

**Lo que falla contra el contrato:**
1. **Punto 1:** las seis ideas abren con un rectángulo sobre una línea (`fis-lienzo`): no hay costal, letrero, ropero,
   balanza de gancho, sube y baja ni andamio.
2. **Regla 3:** tres predicciones ya se vieron jugando: el rozamiento de 12 N (el juego dibuja la flecha del rozamiento
   igual a F), el estiramiento de 3 kg (el juego muestra la cota para cada masa) y la cuerda de la polea móvil (el juego
   dibuja las dos cotas). La «Lee» del resorte dice la respuesta («se mide desde el largo natural, no desde el techo»).
3. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad`, `pregunta` ni ejemplos (0 de 90).
4. **Punto 13:** ningún ejercicio trae `datos`; «g = 10 m/s²» va dentro de la pregunta.
5. **Punto 9 y temas:** el equilibrio del cuerpo rígido (37 fichas, 2 preguntas de San Marcos) no tiene idea propia: la
   idea 5 solo pone masas en una barra sin peso. La trampa más repetida de San Marcos (la normal con una fuerza oblicua)
   no aparece.
6. **§5b:** colores por papel de antes (peso verde, junto al naranja de F: protanopía 0,010; normal, tensión y brazo,
   los tres turquesa). Las fuerzas no llevan flecha en ningún texto.
7. **Lecturas** con «·» entre dos igualdades («N = 30 N · P = 20 N»).
8. Glosario de 15 términos sin `simple` y con un solo ejemplo. «Postulante de 4.º» en la cabecera.
9. **Práctica:** la escena vieja mezcla temas; `dinamica-fuerzas` (de Dinámica) aporta a esta unidad solo su tipo
   `escalera` y el resto es dinámica circular y gravitación.

---

## 1. Las ideas, en orden

Ocho temas del catálogo en **seis ideas** (no se parte la unidad: decisión 1). Las máquinas simples no tienen idea
propia: la polea entra en la idea 2 (una polea es una partícula con dos tensiones) y la palanca en la idea 5 (es un
torque).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `diagrama-y-parejas` | Primera y tercera ley de Newton | Quieto, las fuerzas sobre un cuerpo suman cero, así que la normal no siempre es el peso. Cada fuerza tiene su pareja en el otro cuerpo. |
| 2 | `nudo-en-equilibrio` | Equilibrio de una partícula | En equilibrio, las componentes horizontales se cancelan y las verticales sostienen el peso. El cable más parado es el que más jala. |
| 3 | `rozamiento-se-ajusta` | Rozamiento estático y cinético | Quieto, el rozamiento vale lo justo, hasta μ_s·N; deslizando, vale μ_k·N. La normal se halla con las fuerzas, no es siempre el peso. |
| 4 | `resorte-proporcional` | Fuerza elástica: la ley de Hooke | Un resorte jala en proporción a lo que se deforma desde su largo natural: F_e = k·x. Su largo total no es x. |
| 5 | `torque-y-brazo` | Torque: fuerza por brazo | Lo que hace girar es la fuerza por su brazo, τ = F·d. Sin girar, los torques de un sentido igualan a los del otro. |
| 6 | `cuerpo-rigido` (nueva) | Equilibrio del cuerpo rígido | Un cuerpo rígido quieto cumple dos cosas: fuerzas que suman cero y torques que suman cero. Su peso actúa en su centro de gravedad. |

Los ids 1 a 5 se quedan (su avance se guarda con ellos); la idea vieja `polea-movil` se va (su contenido pasa a las
ideas 2 y 4) y entra `cuerpo-rigido`. Las cinco que se quedan estrenan otra Predice: sus predicciones guardadas sin
huella se borran una vez, y quien había terminado las seis ideas de antes conserva «Ya la estudié» (bloque propio en
`nucleo/avance.js`, decisión 9).

`pregunta` (Resumen): 1 «¿La balanza marca siempre lo que pesa el costal?» · 2 «Si un letrero cuelga de dos cables,
¿cuál de los dos jala más?» · 3 «Si empujas un ropero y no se mueve, ¿cuánto lo frena el piso?» · 4 «¿Cuánto mide un
resorte cuando le cuelgas más peso?» · 5 «¿Dónde se sienta Beto para equilibrar a Ana en el sube y baja?» · 6 «¿Cuánto
sostiene cada caballete del tablón del pintor?»

`actividad`: 1 «Jalar con una cuerda un costal puesto sobre la balanza de la bodega.» · 2 «Colgar el letrero de la
bodega con dos cables y cambiar su ángulo.» · 3 «Empujar el ropero del cuarto hasta que empiece a moverse.» · 4 «Colgar
bolsas en la balanza de resorte del mercado.» · 5 «Sentar a Beto en el sube y baja del parque hasta equilibrarlo.» ·
6 «Mover al pintor por el tablón apoyado en dos caballetes.»

Glosario que estrena cada idea (con `simple`, tope de 30 por unidad): 1 fuerza, peso, fuerza normal, tercera ley de
Newton (y, sin `simple`, primera ley de Newton y diagrama de cuerpo libre) · 2 equilibrio, tensión, polea · 3 rozamiento
estático, rozamiento cinético, coeficiente de rozamiento, plano inclinado · 4 fuerza elástica, constante elástica,
deformación · 5 torque, brazo de palanca, palanca · 6 cuerpo rígido, centro de gravedad, reacción. «Vector»,
«componente», «módulo» y «resultante» vienen de Vectores; «masa», de Magnitudes; «MRU» y «velocidad», de MRU.
«Polea» y «plano inclinado» estaban definidas en Dinámica (que va después): se mudan aquí (decisión 10).

**Por qué va cada una en su lugar y qué da por sabido**

- **1. Primera y tercera ley.** La raíz: un cuerpo, sus fuerzas verticales y su DCL, sin componentes. El objeto es la
  balanza de la bodega porque **lo que marca la balanza es la pareja de la normal** (tercera ley): así las dos leyes
  salen del mismo juego. El peso se da como P = m·g, con g = 10 m/s² (un dato, como en el examen; la diferencia entre
  masa y peso es de Dinámica). Ataca N-MG (trampa 7 de San Marcos, D6) y D11. Nivel examen: cajas apiladas, la persona
  que sube una pesa a velocidad constante sobre la balanza (San Marcos 2019-I), la pareja del peso.
- **2. Equilibrio de una partícula.** Trae de Vectores las componentes (F·cos θ y F·sen θ). Ataca E8 (las tensiones se
  reparten por mitades; un cuarto de 132 alumnos eligió que la cuerda más parada jala menos) y E7 (el largo). Nivel
  examen: la escaladora contra la pared (San Marcos 2023-II), la polea móvil (2T = P), la lámpara jalada a un lado.
- **3. Rozamiento.** Necesita la normal (1) y las componentes (2). Ataca E10 (el estático siempre vale μN: la respuesta
  equivocada más elegida en Steif y Dantzler 2005), RZ-CERO y N-MG con fuerza oblicua (San Marcos 2025-I y 2026-II).
  Nivel examen: la fuerza oblicua mínima, el bloque que sube a velocidad constante, la caja quieta en la rampa.
- **4. Fuerza elástica.** Necesita el equilibrio (1 y 2). Nivel examen: San Marcos 2027-I (resorte y polea móvil), el
  resorte que sostiene una caja en una rampa y el largo final de un resorte.
- **5. Torque.** Barras sin peso propio. Ataca E1 (cortar en el punto de equilibrio: «pesan igual»; 80–85 % en Ortiz y
  otros 2005 y Fischer y otros 2014), E4 (fuerza y torque son lo mismo) y TQ-BRAZO (el brazo hasta el punto de
  aplicación, sin el seno). Nivel examen: la llave con fuerza inclinada, la barreta del agricultor, tres niños en el sube
  y baja.
- **6. Cuerpo rígido.** Al final: junta las dos condiciones y el peso propio en el centro (E2). Nivel examen: la escalera
  en la pared lisa (San Marcos 2021), el antebrazo con el bíceps (San Marcos 2026-II), el tablón en voladizo.

**Qué no entra:** la segunda ley y todo lo que acelera (Dinámica); el par de fuerzas y el centro de gravedad de figuras
compuestas (quedan en la escena vieja, «Más mesas del tema»); el teorema de Lamy como fórmula (se resuelve con
componentes; en «Mira» de la idea 2 se ve el triángulo de fuerzas); los sistemas de poleas de más de dos.

---

## 2. Objeto de la primera pantalla

Pieza nueva `fis-estatica` (dibujos de prueba, `data-prueba`): un lienzo en píxeles con objetos de la vida real y las
fuerzas como flechas que salen del cuerpo que las siente, con su prueba numérica de encuadre y de rótulos.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Un costal de arroz sobre la balanza de piso de la bodega**, con una cuerda que lo jala hacia arriba | la pantalla de la balanza = lo que marca; las flechas P⃗, N⃗ y T⃗ salen del costal |
| 2 | **El letrero de la bodega**, colgado de un nudo con dos cables | los cables = T⃗₁ y T⃗₂; el letrero = P⃗; sus ángulos con la horizontal |
| 3 | **El ropero del cuarto**, empujado por una persona | la mano = F⃗; el piso = N⃗ (y el rozamiento, que el juego no dibuja hasta Mira) |
| 4 | **La balanza de resorte del mercado**, colgada de una viga, con una bolsa | la línea punteada = el largo natural; la llave = x |
| 5 | **El sube y baja del parque**, con Ana y Beto | el apoyo = el eje; cada niño = su peso; las llaves = los brazos |
| 6 | **El tablón del pintor** sobre dos caballetes, con el pintor y su balde | los caballetes A y B = N⃗_A y N⃗_B; el centro del tablón = su peso |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (relación) |
| --- | --- | --- | --- | --- |
| 1 | «En la bodega, el costal está sobre la balanza y tú lo jalas con una cuerda.» **Haz que la balanza marque la mitad de lo que pesa el costal.** | `m` 20–50 kg de 10 en 10; `T` 0–200 N de 25 en 25 | `T = 5·m` (tres maneras) | «Marca 300 N: pesa 400 N y la cuerda sostiene 100 N.» |
| 2 | «El letrero de la bodega cuelga de dos cables iguales.» **Haz que cada cable jale lo mismo que pesa el letrero.** | `P` 60–120 N; `ang` 30°, 37°, 45°, 53°, 60°, 90° | `ang = 30°` | «Cada cable jala 100 N; sus partes verticales suman 120 N.» |
| 3 | «El ropero pesa 500 N. Lo empujas de lado, cada vez más fuerte.» **Encuentra la mayor fuerza con la que sigue quieto.** | `F` 0–300 N de 20 en 20 | `F = 200` | «Empujas con 120 N y el ropero sigue quieto.» (sin la flecha del rozamiento) |
| 4 | «La balanza de resorte del mercado tiene un resorte de 200 N/m.» **Cuelga una bolsa que lo estire justo 10 cm.** | `m` 0,5–3 kg de 0,5 en 0,5 | `m = 2` | «La bolsa jala 15 N y el resorte se estira 7,5 cm.» |
| 5 | «Ana, de 30 kg, se sienta a 1,5 m del apoyo.» **Sienta a Beto donde el sube y baja quede horizontal.** | `mB` 20, 25, 30 kg; `d` 0,5–2,5 m de 0,25 en 0,25 | `mB·d = 45` (dos maneras) | «Ana gira con 450 N·m y Beto con 400 N·m: baja Ana.» |
| 6 | «El tablón del pintor mide 4 m y pesa 200 N; el pintor pesa 600 N.» **Lleva al pintor hasta que el caballete B aguante 550 N.** | `x` 0,5–3,5 m de 0,5 en 0,5 | `x = 3` | «A empuja 400 N y B, 400 N: suman los 800 N.» |

Para que la predicción quede fuera de lo jugado: 1 solo jala hacia arriba (Predice empuja hacia abajo); 2 tiene cables
iguales (Predice, distintos); 3 no dibuja el rozamiento; 4 es otro resorte, con otro largo; 5 no corta nada (Predice
corta una escoba); 6 no llega a poner al pintor sobre un caballete.

---

## 4. La predicción de cada idea

La app baraja las opciones; `datos` lleva solo valores, nunca la relación que se predice. En la figura, lo pedido va con
«?» en tinta.

**1.** «Ahora no jalas: empujas el costal hacia abajo con la mano. ¿Cuánto marca la balanza?» Datos: el costal pesa
400 N; tu mano empuja con 100 N.
| 500 N (correcta) | 400 N: marca el peso (N-MG, D6, trampa 7) | 300 N: resta como al jalar (N-SIGNO) | 100 N: lo de la mano (N-F) |

**2.** «Ahora los cables son distintos: uno forma 37° con el techo y el otro 53°. ¿Cuál jala más?» Datos: el letrero
pesa 100 N; sen 37° = cos 53° = 3/5 y cos 37° = sen 53° = 4/5.
| El de 53°, el más parado (correcta: 80 N contra 60 N) | El de 37°, el más tendido (E8, un cuarto en Flores-García y otros 2009) | Los dos igual: cada uno la mitad (E8) | El más largo de los dos (E7) |

**3.** «Empujas el ropero con 120 N y sigue quieto. ¿Con cuánta fuerza lo frena el piso?» Datos: pesa 500 N; en el
juego empezó a moverse al pasar de 200 N.
| 120 N (correcta) | 200 N: siempre el tope (E10) | 0 N: si no se mueve, no hay rozamiento (RZ-CERO) | 80 N: lo que falta para el tope (RZ-RESTA) |

**4.** «Otro resorte mide 12 cm sin nada. Con 1 kg colgado mide 15 cm. ¿Cuánto mide con 3 kg?»
| 21 cm (correcta) | 45 cm: el triple del largo (RS-LARGO) | 9 cm: solo lo que se estira (RS-SOLO-X) | 18 cm: suma 3 cm una vez (RS-PASO) |

**5.** «Equilibras una escoba sobre tu dedo y la cortas justo ahí. ¿Qué parte pesa más?»
| La del cepillo, la más corta (correcta) | Pesan igual: estaba equilibrada (E1, 80–85 %) | La del palo, la más larga (E1-LARGO) | No se puede saber sin una balanza (TQ-NOSE) |

**6.** «El pintor se para justo encima del caballete B. ¿Cuánto empuja el caballete A?» Datos: el tablón pesa 200 N,
es parejo y mide 4 m; el pintor pesa 600 N.
| 100 N, la mitad del tablón (correcta) | 0 N: todo lo carga B (RG-SIN-PESO) | 400 N: cada uno la mitad de todo (RG-MITAD) | 200 N: el tablón entero (RG-TODO) |

---

## 5. Tabla de letras (campo `letras`)

| Letra | Significado único | Aviso |
| --- | --- | --- |
| F⃗, F | Una fuerza; sin subíndice, la que hace una persona con la mano | ΣF⃗ es la suma de todas |
| P | Peso: P = m·g; P_b el de una barra o un tablón | — |
| m, g | Masa (kg) y g = 10 m/s² | — |
| N | Fuerza normal; N_A, N_B las de los apoyos A y B; N_p la de una pared | — |
| T | Tensión de una cuerda o cable; T₁, T₂ | En Movimiento circular, T era el período: otra unidad |
| f, f_s, f_k | Rozamiento; estático y cinético | En Movimiento circular, f era la frecuencia |
| μ_s, μ_k | Coeficientes de rozamiento | sin unidad |
| F_e, k, x | Fuerza elástica, constante elástica (N/m), deformación | x se mide desde el largo natural L₀ |
| L₀, L | Largo natural y largo de un resorte; L también el largo de una barra | — |
| τ | Torque (momento de una fuerza), en N·m | La academia escribe también M |
| d | Brazo de palanca, del eje a la línea de la fuerza | — |
| θ | Ángulo de una fuerza o de un cable con la horizontal (o con la barra, en el torque) | Se dice en cada ejercicio respecto de qué |
| R | Reacción de una bisagra o articulación (idea 6) | En Vectores, R⃗ era la resultante: la idea 6 lo avisa en «Lee» |
| F_x, F_y | Componentes de una fuerza | De Vectores |

---

## 6. Mapa de colores (§5b): un color fijo por fuerza

| Token | Fuerza | Por qué |
| --- | --- | --- |
| `h` carmín | **Peso P⃗** (y g, que lo produce) | Como g en la rama («aceleración y g carmín»): el peso es la gravedad sobre el cuerpo |
| `f` violeta | **Normal N⃗** y toda fuerza de un apoyo: N_A, N_B, la pared, la reacción R de una bisagra | Violeta es el color que mejor se separa de los otros tres; la normal es la flecha que más se confunde con el peso |
| `o` naranja | **Tensión T⃗** y lo que jala o empuja algo amarrado o una mano: T, F, F_e | Las tres son «algo que jala desde afuera» (cuerda, mano, resorte) |
| `i` turquesa | **Rozamiento f⃗** (f_s, f_k) | En la idea 3, F⃗ y f⃗ van en la misma recta y opuestas: naranja–turquesa es el par más claro de los posibles (0,114) |
| tinta | m, μ, k, x, L, d, τ, los ángulos, los objetos y lo que se pide en una figura («?») | En Estática el color es de las fuerzas |
| `d` verde | No se usa | Va junto al naranja (0,010 en protanopía) y al carmín del peso |

Distancias OKLab, peor caso entre visión normal y protan/deutan/tritan (`herramientas/auditar-colores.py`, tema claro):
P–N 0,167; N–T 0,189; T–f 0,114; N–f 0,101; P–f 0,077; **P–T 0,062** (tritan; 0,075 deutan). El par más débil
(peso y tensión) siempre va en sentidos opuestos (el peso hacia abajo, la cuerda hacia su amarre) y con su letra; se
eligió así para que el peso conserve el color de g. Ver decisión 3.

---

## 7. Práctica: qué existe y qué falta por idea

Hay: la escena `estatica` (palancas, centro de gravedad, nudo, polea, roce; 0.1.0) y el tipo `escalera` de
`dinamica-fuerzas`. Falta todo lo demás: ningún generador separa por idea ni trae `datos` de estática.

Propuesta: **generador nuevo `plantillas/fis-estatica/`** (formato `predicciones`, `TIPOS_POR_IDEA`, niveles 1 a 3,
`datos` por línea, prueba en 400 semillas, `casos.json` verificado aparte, papel de 8), que usa el motor de la escena
`estatica` para la barra, el nudo y la rampa (no lo copia). La escena `estatica` pasa a «Más mesas del tema»
(`"rehacer": true`) y `dinamica-fuerzas` también, solo en esta unidad (`"rehacer": ["fisica.estatica"]`). Dos ítems para
la prueba del curso, a la reserva (las formas ya tienen 10 pares).

## 8. Datos del mundo

Valores de problema, posibles: costales de 20 a 50 kg; letreros de 60 a 120 N; un ropero de 50 kg; balanzas de resorte
de 200 a 500 N/m; niños de 20 a 35 kg; un tablón de 4 m y 20 kg; escaleras de 3 a 5 m. g = 10 m/s² y los senos de 37° y
53° como «convención del examen». Coeficientes de rozamiento como valores de problema (0,2 a 0,6), sin fuente. Ningún
dato puntual del mundo necesita fuente. La historia de Arquímedes y la palanca se queda con su fuente (NYU).

## 8b. Orden con otras unidades (`requiere`)

Se queda `fisica.vectores` (componentes, Pitágoras). Dinámica sigue pidiendo esta unidad. El mapa no cambia.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, sin partir la unidad.** *Motivo:* ocho temas pero 120 fichas y 7 preguntas, la mitad de lo que tenía
   Movimiento parabólico y circular; la polea es una partícula y la palanca un torque. *Descartada:* partir en
   «Fuerzas y equilibrio de una partícula» y «Torque y cuerpo rígido» (tres ideas cortas) o `septimaIdea` con
   «Máquinas simples».
2. **La idea 1 junta primera y tercera ley con la balanza.** *Motivo:* lo que marca la balanza es la pareja de la
   normal, así que las dos leyes salen del mismo objeto; la Predice ataca la trampa más repetida (N = P). *Descartada:*
   la Predice vieja (la pareja del peso), que queda como ejemplo y como tipo de «Ahora tú».
3. **Colores por fuerza:** peso carmín (con g), normal violeta, tensión y fuerzas de mano o resorte naranja, rozamiento
   turquesa; longitudes, ángulos y torque en tinta. *Motivo:* el peso conserva el color de g de la rama, y los dos pares
   que más se miran (normal–peso y fuerza–rozamiento) quedan separados (0,167 y 0,114). *Descartada:* peso violeta y
   normal carmín, que separa mejor peso–tensión (0,189) pero rompe el color de g y deja normal–tensión en 0,062.
4. **F, T y F_e comparten el naranja.** *Motivo:* no hay un quinto color que se distinga del carmín del peso (el verde
   da 0,086 con carmín y 0,010 con naranja); las tres son «algo que jala desde afuera». La letra las separa.
   *Descartada:* F en tinta (es lo que se pide en la idea 3).
5. **τ en tinta.** *Motivo:* no queda color libre que no choque con una fuerza en la idea 6. La respuesta de torque va en
   negrita, como el radio en Movimiento circular. *Descartada:* τ violeta (choca con N en el tablón).
6. **La idea 3 no dibuja el rozamiento en el juego.** *Motivo:* si lo dibuja, la Predice (E10) ya está vista. Aparece en
   «Mira». *Descartada:* dibujarlo y preguntar por otra cosa (la Predice de E10 es la del dato más fuerte del informe).
7. **R para la reacción de una bisagra, con aviso.** *Motivo:* es la letra del examen. *Descartada:* F_A o «H y V»
   (H es la altura máxima de MRUV).
8. **Fuerzas con flecha** (F⃗, P⃗, N⃗) en el texto cuando se habla del vector; sus módulos sin flecha en las cuentas.
   El peso como dato P = m·g, sin explicar la diferencia entre masa y peso (es de Dinámica).
9. **Avance:** los ids 1 a 5 se quedan y cambian de Predice (predicciones viejas sin huella, borradas una vez:
   `prediccionES`); `polea-movil` sale y entra `cuerpo-rigido`; quien terminó las seis de antes conserva «Ya la
   estudié» (`estudiadaES`). Bloque propio en `nucleo/avance.js` con su prueba.
10. **«Polea» y «plano inclinado» se mudan del glosario de Dinámica al de Estática** (un término por curso, en la unidad
    que lo estrena; Dinámica va después). Cambio mínimo en `dinamica.js` (quitar las dos entradas).
11. **Práctica:** generador nuevo `fis-estatica` con el motor de la escena; la escena y `dinamica-fuerzas` a «Más mesas
    del tema». *Descartada:* separar `dinamica-fuerzas` por unidad (es de Dinámica y Gravitación, y aquí sirve un solo tipo).
12. **Códigos nuevos como hipótesis** (N-SIGNO, N-F, N-MG con su trampa 7, ST-*, RZ-*, RS-*, TQ-*, RG-*), anotados en
    `docs/investigacion/estatica-energia-ideas-erroneas.md` al cerrar.

## Lo que se hizo (19 nov, fases 2 a 5)

- **Teoría** (`contenido/teoria/fisica/estatica.js`, v0.3.0, `estado: 'completa'`, sin `calidad`): las seis ideas con
  Lee, Juega con misión, Predice, Mira, La regla (con dibujo propio), Así se resuelve, Ahora tú, glosario (22 términos)
  y 15 ejemplos cada una (90; los 30 de examen con A–E seis veces cada una). Las tres mesas del laboratorio, con sus ids
  y controles, redibujadas con la pieza nueva. Tabla `letras` y `colores` en la unidad.
- **Pieza** `nucleo/kit/piezas/fis-estatica.js` con su prueba: costal, caja, ropero, balanza de piso con pantalla,
  letrero, bolsa, balde, persona, cuerda (también floja), nudo, resorte, polea, rampa, barra, apoyo, caballete, viga,
  escalera, escoba, llave, regla, balanza de resorte; fuerzas, ángulos, cotas, guías y cortes para «Mira».
- **Práctica** `plantillas/fis-estatica/` (18 tipos, tres por idea, del nivel 1 al de examen; 18 casos verificados con
  un script aparte; 8 problemas de papel). La escena `estatica` y `dinamica-fuerzas` van a «Más mesas del tema».
- **Prueba del curso**: `fis-27` (tablón con peso propio) y `fis-28` (rozamiento estático en la rampa, E10), a la
  reserva, con su verificador sobre el motor de la escena.
- **Avance**: `prediccionES` y `estudiadaES` en `nucleo/avance.js`, con su prueba.
- **Códigos** nuevos en `docs/investigacion/estatica-energia-ideas-erroneas.md`, «Estática (19 nov 2026)».

### Decisiones nuevas de las fases 2 a 5 (Gerson revisa después)

13. **El DCL va al lado del objeto** en las ideas 1 y 3 (una caja chica con sus flechas, a la derecha de la escena), y
    sobre el objeto en las demás (el nudo, el tablón, la llave). *Motivo:* en el piso, la flecha del peso cruzaba la
    balanza o el suelo. *Descartada:* flechas sobre el costal mismo.
14. **El juego de la idea 1 explica la balanza en la leyenda** («lo que marca la balanza, en newtons») y g en la consigna
    («cada kilo pesa 10 N»); la cuerda se dibuja floja cuando no jala (nota de la sesión).
15. **Opciones de Predice numéricas sin justificación**: cada una es solo el número, para que la correcta no sea la más
    corta; la explicación va en su `siFuera`.
16. **El papel de `dinamica-fuerzas` dice de qué unidad es cada problema** (`unidades`): p8 (la escalera) es de
    Estática, p5 y p9 de Gravitación, los demás de Dinámica. Cambio mínimo en un archivo compartido.
17. **Valores exactos**: todo «Ahora tú» y «Así se resuelve» elige sus números para que lo que se escribe con «=» sea
    exacto con dos decimales (sin 45° ni 60° en los cables de «Ahora tú»; el juego sí los tiene, con su lectura sin «=»).
