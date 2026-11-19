# Propuesta de ideas: «Dinámica» (`fisica.dinamica`)

Etapa 7 del plan de calidad, rama «Mecánica» de Física: la octava unidad, después de «Estática: equilibrio y torque» y
antes de «Trabajo, energía y potencia» · fases 1 a 5 en un solo agente (`docs/metodo/unidad/etapa-delegada.md`) ·
19 nov 2026

Gerson delegó el criterio: esta propuesta se ejecutó sin esperar su visto bueno. Lo que conviene mirar primero está al
final, en «Decisiones tomadas (Gerson revisa después)». No hay ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y este encargo), las decisiones de las
etapas 2 a 6, `docs/etapa6/propuesta-fisica.md` como modelo, `estatica.js` (calidad 2) con su auditoría y su lector en
frío (lo que se corrigió ahí y no se repite aquí: la regla escrita como arreglo, que sale «[object Object]»; un DCL al que
le falta una fuerza; casos imposibles; errores que dan la correcta y se borran en silencio; «Ahora tú» que repite la
misión; flechas pedidas que se pueden medir; «Vale si» con mayúscula; rótulos encimados; «Así se resuelve» sin dibujo),
`movimiento-circular.js` (calidad 2: la aceleración centrípeta y su notación), la teoría actual
(`contenido/teoria/fisica/dinamica.js`, v0.2.0, sin `calidad`), su ficha en `catalogo/cursos/fisica.json`, sus plantillas
(`dinamica`, escena con motor, casos y papel; `dinamica-fuerzas`, generador compartido con Estática y Gravitación),
`docs/investigacion/dinamica-ideas-erroneas.md` (D1 a D11 y los errores de cálculo sin respaldo),
`estatica-energia-ideas-erroneas.md` (W5), `docs/temario-completo.md` (unidad 5: unas 82 fichas en el banco Cuzcano),
`catalogo/pruebas/fisica.json` (fis-03 y fis-04 son de esta unidad) y las 20 preguntas de la unidad en
`docs/datos/admision-unmsm.csv`. Vecinas: Estática (primera y tercera ley, DCL, rozamiento estático y cinético, la normal
con una fuerza oblicua y la rampa en equilibrio: se usan, no se repiten), MRUV y caída libre (v = v₀ + a·t,
d = v₀·t + ½·a·t² y v² = v₀² + 2·a·d van como datos), Movimiento circular (a_c = v²/r = ω²·r: la dinámica circular se
apoya en ella, no la vuelve a enseñar) y Trabajo y energía, que sigue y se queda con el trabajo, la energía y la
potencia (aquí nada pide un trabajo, aunque dos preguntas de San Marcos lo hagan sobre un sistema de bloques).

## Qué se pregunta en los exámenes

- **UNI:** semana 5 del CEPRE-UNI (dinámica rectilínea y circular).
- **San Marcos:** tema 5 del CEPRE-UNMSM.
- **Banco Cuzcano (unas 82 fichas):** dinámica circular 26, rozamiento en movimiento 18, bloques, poleas y planos 12,
  peso aparente y sistemas acelerados 9, movimiento relativo y sistemas inerciales 9.

**En la admisión real de San Marcos (2019-I a 2027-I) hay 20 preguntas de esta unidad:**

| # | Periodo (pregunta) | Qué piden | Trampa | Idea |
| --- | --- | --- | --- | --- |
| 1 | 2019-I (106) | Fuerza de fricción que detiene un carrito, con la distancia de frenado | Omitir el signo de la fuerza que se opone | 3 |
| 2 | 2019-II (81) | Radio máximo en una plataforma que gira, con el rozamiento estático | Invertir la relación entre radio y centrípeta | 6 |
| 3 | 2020-I (106) | Qué ruedas son motrices, por el sentido del rozamiento en cada eje | Creer que el rozamiento siempre se opone al avance | 3 |
| 4 | 2021 (81) | Masa de dos cuerpos juntos con la fuerza y la aceleración | — (sin clave oficial) | 1 |
| 5 | 2021 (84) | V/F sobre peso y aceleración de un astronauta | Creer que la misma fuerza acelera distinto según el lugar | 2 |
| 6 | 2021 (87) | Aceleración de un bloque unido a otro por un resorte | Suponer que los dos aceleran igual | 4 (examen) |
| 7 | 2022 (87) | Bolita que gira dentro de un cuenco liso | Tomar el radio de la esfera como radio del giro | 6 |
| 8 | 2023-I (82) | Comparar velocidades de bloques empujados con F y t distintos | Mirar solo F o solo m, sin el tiempo | 1 |
| 9 | 2023-I (80) | Trabajo de la cuerda en una máquina de Atwood | La tensión igual al peso | 4 (sin el trabajo) |
| 10 | 2023-I (81) | Balanzas en ascensores que suben o bajan acelerando | Restar la aceleración al subir | 5 |
| 11 | 2024-I (86) | Tensión entre un bloque sobre una mesa lisa y otro colgante | La tensión igual al peso del que cuelga | 4 |
| 12 | 2024-II (81) | Empujar un carrito y levantar cajas en la Tierra y en la Luna | Creer que en la Luna la misma fuerza acelera más | 2 |
| 13 | 2025-I (83) | Trabajo del rozamiento sobre un bloque arrastrado por otro colgante | El signo del trabajo | 4 (sin el trabajo) |
| 14 | 2025-II (90) | Normal sobre una persona en un ascensor que sube acelerando | Restar la aceleración o igualar al peso | 5 |
| 15 | 2025-II (82) | Aceleración de un bloque jalado con fuerza oblicua y rozamiento | La normal igual al peso | 3 |
| 16 | 2026-I (82) | Normal en lo alto de una pista circular vertical | Sumar el peso a la centrípeta | 6 |
| 17 | 2026-I (81) | Rapidez al llegar al piso del bloque pesado de una Atwood | Usar g como aceleración del sistema | 4 |
| 18 | 2026-II (89) | Fuerza única sobre un cuerpo que recorre cierta distancia en un tiempo | Usar la velocidad media como aceleración | 1 |
| 19 | 2027-I (91) | Tensión de una cuerda que sube una carga acelerando | Restar la aceleración a la gravedad | 5 |
| 20 | 2027-I (82) | Distancia que sube un ladrillo lanzado por una rampa rugosa | No sumar el peso y el rozamiento al frenar la subida | 3 |

Por idea: 1 · 3 · 2 · 2 · 3 · 4 · 4 · 5 · 5 · 3 · 6 · 3.

---

## 0. Diagnóstico de la teoría actual

`dinamica.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene seis ideas: `fuerza-neta-acelera`, `masa-y-peso`,
`rozamiento-en-movimiento`, `plano-y-polea`, `centripeta-es-resultante` y `ascensor-y-marcos`, y tres mesas
(`bloque-libre`, `ascensor-libre`, `loma`).

**Lo que se queda:** los seis temas en seis ideas, los ids (su avance se guarda con ellos), la aceleración contra la
velocidad del carrito que frena (D1), la misma aceleración en la Luna (la trampa de San Marcos 2021 y 2024-II), el auto en
la loma, la balanza del ascensor y las tres mesas con sus ids y controles. El motor de la escena `dinamica` (plano, piso
con fuerza oblicua, mesa con polea, Atwood, tren de carritos, ascensor, loma, pista vertical, curva) sirve a la práctica
nueva.

**Lo que falla contra el contrato:**
1. **Punto 1:** las seis ideas abren con un rectángulo sobre una línea (`fis-lienzo`): no hay carrito del mercado,
   balanza de resorte, costal que se arrastra, balde de la obra, ascensor ni auto en la loma.
2. **Regla 3:** dos predicciones ya se vieron jugando: el rozamiento a velocidad constante (el juego dibuja F = f) y la
   aceleración en el plano para dos masas (el juego cambia la masa y la flecha no cambia).
3. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad`, `pregunta`, «Lee», «Así se resuelve» ni
   ejemplos (0 de 90).
4. **Punto 13:** ningún ejercicio trae `datos`; «g = 10 m/s²» va dentro de la pregunta.
5. **Colores y regla 4:** peso verde junto al naranja de F (protanopía 0,010); normal y tensión en el mismo turquesa; no
   siguen los colores fijos de Estática (peso carmín, normal violeta, tensión y mano naranja, rozamiento turquesa).
6. **Punto 9:** la dinámica circular vuelve a enseñar la aceleración centrípeta (es de Movimiento circular) y la ficha no
   pide esa unidad.
7. Glosario de 6 términos sin `simple` y con un solo ejemplo; «postulante de 4.º» en la cabecera; lecturas con números
   sueltos («F = 6 N, m = 2 kg»).
8. **Práctica:** la escena vieja mezcla los seis temas sin datos; `dinamica-fuerzas` no da datos (`datos: ''`), no separa
   por idea y trae problemas de Gravitación (la órbita, el punto de fuerza nula) que el examen de esta unidad sacaría.

---

## 1. Las ideas, en orden

Seis temas del catálogo en **seis ideas** (no se parte la unidad: decisión 1).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `fuerza-neta-acelera` | Segunda ley de Newton | La suma de las fuerzas le da al cuerpo una aceleración en su mismo sentido: a = ΣF/m. La aceleración sigue a la fuerza, no a la velocidad. |
| 2 | `masa-y-peso` | Masa y peso | La masa, lo que cuesta acelerar un cuerpo, es la misma en todas partes. El peso, P = m·g, cambia con la g del lugar. |
| 3 | `rozamiento-en-movimiento` | Rozamiento en movimiento | Mientras desliza, el rozamiento vale μ_k·N y va contra el deslizamiento. Lo que sobra acelera; sin empuje, frena con a = μ_k·g. |
| 4 | `plano-y-polea` | Bloques unidos por una cuerda | Los cuerpos unidos por una cuerda tensa aceleran juntos. La aceleración sale del sistema; la tensión, del DCL de un solo bloque, y no es un peso. |
| 5 | `ascensor-y-marcos` | Peso aparente en el ascensor | La balanza marca la normal: N = m·(g + a), con a positiva hacia arriba. Manda el sentido de la aceleración, no el del viaje. |
| 6 | `centripeta-es-resultante` | Dinámica circular | En una curva, la suma de las fuerzas apunta al centro y vale m·v²/r. No es una fuerza más: la ponen el peso, la normal, la tensión o el rozamiento. |

Los seis ids se quedan; las seis estrenan otra Predice y otro juego (decisión 9). El orden cambia: la balanza del ascensor
va antes de la dinámica circular, que cierra la unidad.

`pregunta` (Resumen): 1 «¿Hacia dónde apunta la aceleración de un carrito que frenas?» · 2 «¿Una caja acelera igual en la
Luna que en la Tierra?» · 3 «¿Una caja más pesada frena antes al deslizar?» · 4 «¿La cuerda jala con el peso del balde que
cuelga?» · 5 «¿Qué marca tu balanza en un ascensor que frena?» · 6 «¿Qué empuja más a un auto: el fondo de una hondonada o
la cima de una loma?»

`actividad`: 1 «Empujar el carrito de carga del mercado con más o menos fuerza y carga.» · 2 «Colgar una bolsa en la balanza
de resorte en la Tierra, en Marte y en la Luna.» · 3 «Arrastrar con una cuerda un costal que ya desliza por el piso.» ·
4 «Unir con una cuerda un costal sobre la mesa y un balde que cuelga.» · 5 «Pararte en una balanza dentro de un ascensor que
arranca.» · 6 «Pasar con un auto por la cima de una loma, cada vez más rápido.»

Glosario que estrena cada idea (con `simple`, tope de 30 por unidad): 1 segunda ley de Newton, fuerza neta · 2 inercia,
dinamómetro · 3 fuerza oblicua, rueda motriz · 4 cuerda ideal, máquina de Atwood · 5 peso aparente, ingravidez, sistema
inercial · 6 fuerza centrípeta, rizo. «Fuerza», «peso», «normal», «tensión», «polea», «rozamiento» y «plano inclinado»
vienen de Estática; «aceleración», «gravedad» y «distancia de frenado», de MRUV; «aceleración centrípeta», de Movimiento
circular; «masa», de Magnitudes.

**Por qué va cada una en su lugar y qué da por sabido**

- **1. Segunda ley.** La raíz: un cuerpo, una o dos fuerzas horizontales y su aceleración. Usa la primera ley de Estática
  (ΣF = 0 es el caso a = 0) y las fórmulas de MRUV como dato. Ataca D1 (65 % de 478 universitarios cree que el movimiento
  necesita una fuerza en su sentido) y D3 (fuerza constante, velocidad constante). Nivel examen: la fuerza que hace
  recorrer cierta distancia en cierto tiempo (San Marcos 2026-II, trampa de la velocidad media) y la tabla de cajas
  empujadas con F y t distintos (2023-I).
- **2. Masa y peso.** Estática dio P = m·g como dato; aquí se separan: la masa acelera, el peso cae. Ataca MP-PESO, la
  trampa de San Marcos 2021 y 2024-II. Nivel examen: las proposiciones del astronauta y levantar una caja en la Luna.
- **3. Rozamiento en movimiento.** Necesita la segunda ley (1) y, de Estática, μ_k·N y la normal con una fuerza oblicua.
  Ataca RM-SIN-ROCE, RM-SUMA y N-MG (San Marcos 2025-II), y en la predicción la masa que no cambia la frenada (pariente de
  D5). Nivel examen: el ladrillo que sube por la rampa rugosa (2027-I), el frenado (2019-I) y las ruedas motrices (2020-I).
- **4. Bloques unidos.** Necesita 1 y 3. Ataca PL-TPESO (la tensión igual al peso: tres preguntas de San Marcos) y el «usa
  g» de la Atwood (2026-I). Nivel examen: la mesa con rozamiento, la Atwood que llega al piso, la rampa con un bloque que
  cuelga.
- **5. Peso aparente.** Necesita 1 y la balanza de Estática (marca la pareja de la normal). Ataca AS-SIGNO (restar la
  aceleración al subir, 2023-I, 2025-II y 2027-I) y D1 en versión ascensor (sube, entonces marca más). Aquí entra el
  sistema inercial.
- **6. Dinámica circular.** Al final: la segunda ley hacia el centro, con a_c de Movimiento circular. Ataca D9 (la
  centrífuga), N-MG y DC-SUMA (sumar el peso a la centrípeta, 2026-I). Nivel examen: el rizo, la plataforma que gira
  (2019-II) y el cuenco (2022).

**Qué no entra:** el trabajo y la energía (Trabajo y energía); el impulso (Impulso y choques; la tabla de 2023-I se
resuelve con a = F/m y v = a·t); la gravitación y la órbita (Gravitación); el péndulo cónico como fórmula (el cuenco va
como ejemplo de examen, con su radio dibujado); los marcos que aceleran con fuerzas ficticias (la unidad trabaja siempre
desde el piso: se dice en la idea 5); los resortes en movimiento salvo el ejemplo de examen de 2021.

---

## 2. Objeto de la primera pantalla

La pieza `fis-estatica` (de Estática) se reusa con cinco objetos nuevos en un bloque propio (decisión 10): `carrito`,
`ascensor`, `auto`, `pista` (un tramo de loma o de hondonada) y `disco` (una plataforma vista desde arriba). Dibujos de
prueba (`data-prueba`), con su prueba numérica de encuadre y de rótulos.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El carrito del mercado**, con papas, empujado por una persona | la mano = F⃗; el carrito = m; la flecha punteada = a⃗ |
| 2 | **La balanza de resorte** colgada de una viga, con una bolsa, en la Tierra, Marte o la Luna | la pantalla = lo que marca (el peso P⃗); el control = el lugar |
| 3 | **El costal que se arrastra** con una cuerda por el piso del almacén | la cuerda = F⃗; el piso = N⃗ y f⃗_k |
| 4 | **El costal sobre la mesa y el balde que cuelga** de una polea, en la obra | la cuerda = T⃗ en los dos tramos; el balde = P⃗ que mueve todo |
| 5 | **La balanza de baño dentro del ascensor** de un edificio | la pantalla = N; la flecha punteada = a⃗ del ascensor |
| 6 | **El auto en la cima de una loma** de la carretera | el centro de la curva = hacia dónde apunta la suma; N⃗ y P⃗ en el auto |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (relación) |
| --- | --- | --- | --- | --- |
| 1 | «En el mercado empujas un carrito con papas, que parte del reposo; las ruedas casi no frenan.» **Haz que el carrito acelere justo 1,5 m/s².** | `F` 0–120 N de 20 en 20; `m` 20–60 kg de 10 en 10; `t` (cámara lenta) | 60 N con 40 kg (un solo caso) | «60 N sobre 40 kg: acelera 1,5 m/s²» |
| 2 | «Cuelgas una bolsa de la balanza de resorte en la Tierra, en Marte o en la Luna.» **Consigue que la balanza marque 8 N.** | `m` 1–8 kg; lugar: Tierra (10), Marte (3,7), Luna (1,6) | Luna con 5 kg | «En Marte, 4 kg pesan 14,8 N» |
| 3 | «Arrastras con una cuerda un costal de 20 kg que ya desliza por el piso del almacén.» **Con el piso más áspero, haz que deslice sin acelerar.** | `F` 0–100 N de 10 en 10; `μ_k` 0,2, 0,3, 0,4; `t` | μ_k = 0,4 y 80 N (un solo caso) | «Jalas 60 N y el piso frena 40 N: sobran 20 N» |
| 4 | «En la obra, un costal sobre una mesa lisa está unido a un balde que cuelga de una polea.» **Haz que los dos aceleren justo 8 m/s².** | `m₁` (costal) 1–8 kg; `m₂` (balde) 1–4 kg; `t` | 1 kg con 4 kg (un solo caso) | «El balde pesa 20 N y mueve 5 kg: 4 m/s²» |
| 5 | «Te paras en una balanza dentro del ascensor; tu masa es 50 kg. El ascensor arranca hacia arriba.» **Haz que la balanza marque 650 N.** | `a` 0, 1, 2, 3, 4 m/s² (hacia arriba); `t` | `a = 3` | «Marca 600 N: 100 N más que tu peso» |
| 6 | «Un auto de 1000 kg pasa por la cima de una loma de 20 m de radio.» **Haz que la normal valga la mitad del peso.** | `v` 0–14 m/s de 2 en 2 | `v = 10` | «A 6 m/s, la normal es 8200 N: menos que el peso» |

Para que la predicción quede fuera de lo jugado: 1 parte del reposo (Predice frena un carrito que ya avanza); 2 pesa
(Predice empuja de lado); 3 tiene una sola masa (Predice compara dos); 4 no muestra la tensión; 5 solo acelera hacia
arriba (Predice sube frenando); 6 es una loma (Predice, una hondonada).

---

## 4. La predicción de cada idea

La app baraja las opciones; `datos` lleva solo valores, nunca la relación que se predice.

**1.** «El carrito ya va hacia la derecha y tú lo empujas hacia la izquierda, para frenarlo. ¿Hacia dónde apunta su
aceleración?» Datos: el carrito va hacia la derecha; tu mano empuja hacia la izquierda con 60 N; las ruedas casi no
frenan.
| Hacia la izquierda (correcta) | Hacia la derecha (D1, K3) | No tiene: va frenando (AC-FRENA) | No tiene: la fuerza es constante (D3) |

**2.** «En la Luna, sobre un piso liso, empujas de lado la misma caja de 20 kg con los mismos 40 N. ¿Cuánto acelera?»
Datos: en la Tierra, con esos 40 N, acelera 2 m/s²; g de la Luna: unos 1,6 m/s².
| 2 m/s² (correcta) | 12,5 m/s² (MP-PESO: la masa baja con el peso) | 0,32 m/s² (MP-LIVIANO: baja como g) | 1,25 m/s² (MP-DIV: divide entre el peso lunar) |

**3.** «Dos cajas de 10 kg y 20 kg deslizan por el mismo piso a la misma rapidez y las sueltas a la vez. La de 10 kg se
detiene a 4 m. ¿A qué distancia se detiene la de 20 kg?»
| 4 m (correcta) | 2 m (RM-MAS-ROCE: el doble de rozamiento) | 8 m (RM-IMPETU: el doble de masa llega más lejos) | 16 m (RM-CUADRADO) |

**4.** «En la mesa hay un costal de 3 kg y cuelga un balde de 2 kg. El sistema acelera 4 m/s². ¿Con qué fuerza jala la
cuerda?»
| 12 N (correcta) | 20 N (PL-TPESO: el peso del balde) | 8 N (PL-NETA: la fuerza neta del balde) | 30 N (PL-PESO-MESA) |

**5.** «Cerca del último piso, el ascensor sube frenando: cada segundo va 2 m/s más lento. ¿Cuánto marca la balanza?»
Datos: tu masa es 50 kg; g = 10 m/s².
| 400 N (correcta) | 600 N (AS-SIGNO: sube, entonces suma) | 500 N (N-MG) | 100 N (AS-MA: solo m·a) |

**6.** «Ahora el auto pasa por el fondo de una hondonada de 20 m de radio, a 8 m/s. ¿Cuánto lo empuja la pista?» Datos:
pesa 10 000 N; a esa rapidez, en esa curva, a_c = 3,2 m/s².
| 13 200 N (correcta) | 6800 N (DC-LOMA: resta como en la loma) | 10 000 N (N-MG) | 3200 N (DC-SOLO: solo m·a_c) |

---

## 5. Tabla de letras (campo `letras`)

| Letra | Significado único | Aviso |
| --- | --- | --- |
| F⃗, F | Una fuerza de una mano, un motor o una cuerda que jala (sin subíndice) | — |
| ΣF⃗, ΣF | La fuerza neta: la suma de todas las fuerzas | En la idea 6, ΣF hacia el centro |
| m, m₁, m₂ | Masa; la de cada bloque | — |
| a⃗, a | Aceleración | Positiva hacia arriba en la idea 5 |
| P | Peso: P = m·g | — |
| g, g_L | Aceleración de la gravedad: 10 m/s² en la Tierra; la de la Luna | Marte: g_M |
| N | Normal; también lo que marca una balanza (su pareja) | — |
| T | Tensión | En Movimiento circular, T era el período: otra unidad |
| f_k, f_s, μ_k, μ_s | Rozamiento cinético y estático, y sus coeficientes | De Estática |
| θ | Ángulo de la rampa o de la fuerza con la horizontal | Se dice en cada ejercicio |
| v, v₀ | Rapidez al final y al empezar | De MRUV |
| t, d | Tiempo; distancia recorrida | De MRUV |
| r, a_c, ω | Radio de la curva, aceleración centrípeta, rapidez angular | De Movimiento circular |

---

## 6. Mapa de colores (§5b): un color fijo por clase de fuerza, como en Estática

| Token | Qué | Por qué |
| --- | --- | --- |
| `h` carmín | **Peso P⃗** y g (también g_L, g_M) | El de Estática: el peso es la gravedad sobre el cuerpo |
| `f` violeta | **Normal N⃗**, lo que marca la balanza y toda fuerza de un apoyo | El de Estática |
| `o` naranja | **Tensión T⃗** y lo que jala o empuja desde afuera: F⃗ de la mano, el motor | El de Estática |
| `i` turquesa | **Rozamiento f⃗** (f_k, f_s) | El de Estática |
| tinta | a⃗ (flecha punteada, fuera del cuerpo), ΣF⃗, m, v, t, d, μ, θ, r, a_c, ω, los objetos y lo pedido («?») | Ver decisión 3 |
| `d` verde | No se usa | Iría junto al naranja (0,010 en protanopía) |

Distancias OKLab de Estática (peor caso entre visión normal y protan/deutan/tritan): P–N 0,167; N–T 0,189; T–f 0,114;
N–f 0,101; P–f 0,077; P–T 0,062 (el par más débil va siempre en sentidos opuestos y con su letra).

---

## 7. Práctica: qué existe y qué falta por idea

Hay: la escena `dinamica` (bloques, plano, poleas, ascensor, loma; 0.2.0, sin datos) y `dinamica-fuerzas` (ocho tipos de
tres unidades, sin datos). Falta todo lo demás: nada separa por idea ni trae `datos`.

Propuesta: **generador nuevo `plantillas/fis-dinamica/`** (formato `predicciones`, `TIPOS_POR_IDEA`, tres tipos por idea,
del nivel 1 al de examen, `datos` por línea con prueba en 400 semillas, `casos.json` verificado aparte, papel de 8), que
usa el motor de la escena `dinamica` (no lo copia). La escena `dinamica` y `dinamica-fuerzas` van las dos a «Más mesas del
tema» (decisión 11). Dos ítems para la prueba del curso, a la reserva (las formas ya tienen 10 pares).

## 8. Datos del mundo

Valores de problema, posibles: carritos de 20 a 60 kg; costales de 10 a 50 kg; personas de 50 a 70 kg; ascensores que
aceleran hasta 4 m/s²; lomas de 20 a 50 m de radio; autos de 800 a 1500 kg a menos de 20 m/s. g = 10 m/s² en la Tierra
(convención del examen); en la Luna y en Marte, «unos 1,6 m/s²» y «unos 3,7 m/s²» (valores de libro, sin fuente).
Coeficientes de rozamiento como valores de problema (0,1 a 0,5). Ningún dato puntual del mundo necesita fuente. La
historia de los Principia se queda con su fuente (The Newton Project).

## 8b. Orden con otras unidades (`requiere`)

Se queda `fisica.estatica` y `fisica.mruv-y-caida-libre`; se agrega **`fisica.movimiento-circular`** (la idea 6 usa a_c).
Trabajo y energía sigue pidiendo esta unidad. El mapa no cambia (Movimiento circular ya va antes en la rama).

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, sin partir la unidad.** *Motivo:* seis temas del catálogo, 82 fichas y 20 preguntas que caen en seis
   familias; la dinámica circular es una idea (26 fichas, 3 preguntas) porque la aceleración centrípeta ya está enseñada.
   *Descartada:* partir en «Dinámica» y «Dinámica circular» (la segunda tendría una sola idea con sustancia nueva) o
   separar el plano inclinado de las poleas (el plano entra en la idea 3, con un solo cuerpo, y en el examen de la 4).
2. **El plano inclinado va con el rozamiento (idea 3) y no con las poleas.** *Motivo:* en la idea 3 hay un solo cuerpo
   (piso, fuerza oblicua, rampa) y en la 4 varios unidos por una cuerda; Estática ya dio la rampa en equilibrio.
   *Descartada:* «Planos y poleas» juntos, como antes (mezclaba dos ideas en una predicción).
3. **La aceleración y la fuerza neta en tinta;** a⃗ es una flecha punteada al lado del cuerpo. *Motivo:* las cuatro clases
   de fuerza ya usan los cuatro colores de Estática, y el carmín de la rama (la aceleración en MRUV) chocaría con el peso,
   que también es carmín: en la rampa o en el ascensor, P⃗ y a⃗ irían del mismo color. La respuesta de una aceleración va
   en negrita, como el torque en Estática. *Descartada:* a⃗ en carmín, como en MRUV (dos flechas carmín distintas en cada
   DCL) y a⃗ en verde (0,010 junto al naranja de F).
4. **La velocidad v⃗ también en tinta** (flecha continua y fina, sobre el cuerpo), por la misma razón: el naranja es de las
   fuerzas que jalan. *Descartada:* v⃗ en naranja, como en MRU (se leería como una fuerza).
5. **La dinámica circular no vuelve a enseñar a_c:** va en `datos` («a_c = v²/r = ω²·r») y en una tarjeta de «Lee» que dice
   de dónde viene. La ficha pide `fisica.movimiento-circular`. *Descartada:* la idea vieja, que la volvía a explicar.
6. **«No existe la fuerza centrífuga» no es un término del glosario.** *Motivo:* un `simple` sobre algo que no se dibuja
   afirmaría lo que dice un distractor; la idea lo trata en Mira y en un `siFuera`. *Descartada:* «fuerza centrífuga» con
   su `simple`.
7. **Ningún ejercicio pide un trabajo ni una energía.** Las preguntas de San Marcos 2023-I y 2025-I se adaptan a su parte
   de dinámica (la tensión, el rozamiento). *Descartada:* adelantar W = F·d (es de la unidad que sigue).
8. **El sistema inercial entra en la idea 5** (la balanza del ascensor se mira desde el edificio) y en la condición de las
   reglas 1 y 6. *Descartada:* una idea propia para «Movimiento relativo y sistemas inerciales» (no hay ninguna pregunta
   de San Marcos sobre fuerzas ficticias; las 9 fichas del banco son ascensores y vagones que aceleran).
9. **Avance:** los seis ids se quedan y cambian de Predice: sus predicciones viejas sin huella se borran una vez
   (`prediccionDN`, bloque propio en `nucleo/avance.js` con su prueba). La unidad no suma ni quita ideas: «Ya la estudié»
   no se toca.
10. **La pieza `fis-estatica` crece con cinco objetos** (`carrito`, `ascensor`, `auto`, `pista`, `disco`) en un bloque
    propio, sin tocar los de Estática, con su prueba aparte. *Motivo:* las flechas, rótulos, cortes y DCL son los mismos;
    una pieza nueva copiaría 360 líneas. *Descartada:* una pieza `fis-dinamica` aparte.
11. **Práctica:** generador nuevo `fis-dinamica` sobre el motor de la escena; **la escena `dinamica` y `dinamica-fuerzas`
    van a «Más mesas del tema»** (`"rehacer": true` y `"rehacer": ["fisica.estatica", "fisica.dinamica"]`). *Motivo:* la
    escena no trae datos y la nueva práctica usa su motor; `dinamica-fuerzas` no trae datos, no separa por idea y mezcla
    Gravitación. *Descartada:* dejar `dinamica-fuerzas` como práctica de la unidad separándola por unidad (habría que
    escribirle los datos a sus ocho tipos, que son de tres unidades).
12. **Códigos nuevos como hipótesis** (AC-FRENA, DN-*, MP-*, RM-*, PL-*, AS-*, DC-*), anotados en
    `docs/investigacion/dinamica-ideas-erroneas.md` al cerrar.

## Lo que se hizo (19 nov, fases 2 a 5)

- **Teoría** (`contenido/teoria/fisica/dinamica.js`, v0.3.0, `estado: 'completa'`, sin `calidad`): las seis ideas con
  Lee, Juega con misión (un solo caso de la grilla en cada una), Predice, Mira, La regla (con dibujo propio), Así se
  resuelve, Ahora tú, glosario (13 términos con `simple` y tres ejemplos) y 15 ejemplos cada una (90; los 30 de examen
  con A–E seis veces cada una). Las tres mesas del laboratorio, con sus ids y controles, redibujadas. Tabla `letras` y
  `colores` en la unidad. Prueba propia `dinamica.test.js`: forma, colores, los 90 ejemplos contra una tabla calculada
  aparte, «Ahora tú» en 400 semillas contra el motor de la escena, las reglas de calidad 2 en 400 semillas, misiones y
  figuras.
- **Pieza**: `nucleo/kit/piezas/fis-estatica.js` con un bloque propio de Dinámica (carrito, ascensor, auto, pista,
  disco y pelota) y su prueba aparte, `fis-estatica-dinamica.test.js`. Los objetos de Estática no cambiaron.
- **Práctica** `plantillas/fis-dinamica/` (19 tipos, tres o cuatro por idea, del nivel 1 al de examen, sobre el motor de
  la escena; 19 casos verificados con un script aparte; 8 problemas de papel). La escena `dinamica` y `dinamica-fuerzas`
  van a «Más mesas del tema».
- **Prueba del curso**: `fis-29` (la tensión de la mesa con polea) y `fis-30` (la balanza del ascensor que frena), a la
  reserva, con su verificador sobre el motor de la escena.
- **Avance**: `prediccionDN` en `nucleo/avance.js`, con su prueba.
- **Códigos** nuevos en `docs/investigacion/dinamica-ideas-erroneas.md`, «Dinámica (19 nov 2026)».

### Decisiones nuevas de las fases 2 a 5 (Gerson revisa después)

13. **Los DCL van sin escala**: todas las fuerzas con el mismo largo y su valor escrito («sin escala» bajo el DCL).
    *Motivo:* el peso de un carrito (cientos de newtons) y el empujón (decenas) en una sola escala dejaban el empujón
    como un triángulo. *Descartada:* una escala por figura.
14. **Misiones de un solo caso** (nota de la sesión): idea 1 «acelere justo 1,5 m/s²» (60 N con 40 kg), idea 3 «con el
    piso más áspero, deslice sin acelerar» (80 N), idea 4 «aceleren justo 8 m/s²» (1 kg con 4 kg).
15. **«Carga» no se usa** en el texto del alumno: el glosario del curso la da como carga eléctrica (Electrostática). Se
    dice «papas», «bloque» o «montacargas».
16. **La «fuerza centrípeta» se define en el glosario como nombre de una suma**, y la regla de la idea 6 escribe
    ΣF = m · v²/r: no hay una flecha de centrípeta en ningún DCL.
