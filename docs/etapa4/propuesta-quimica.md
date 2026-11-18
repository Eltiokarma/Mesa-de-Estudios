# Propuesta de ideas: «Estructura atómica»

`quimica.estructura-atomica` · Etapa 4 del plan de calidad, segunda unidad de la rama «Materia y átomo» (sigue a
«Materia y energía») · fase 1 (`docs/metodo/unidad/1-ideas.md` §A) · 18 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 12), cada una con mi recomendación. No toqué ningún otro archivo del repo.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` (§3 y §7), `docs/molde-unidad.md` entero, `docs/metodo/unidad/LEEME.md` y
`1-ideas.md`, `docs/etapa2/decisiones.md` (Materia y energía y «Cambios posteriores») y `docs/etapa3/decisiones.md`
(las cinco rondas), las propuestas `docs/etapa3/propuesta-geometria.md` y `docs/etapa2/propuesta-quimica.md`, la
teoría actual (`contenido/teoria/quimica/estructura-atomica.js`, v0.1.0), su ficha en `catalogo/cursos/quimica.json`,
las cuatro plantillas que la nombran (`atomo-y-tabla`, `configuracion-ubicacion`, `quimica-conceptos` y
`conversiones-quimica`), el informe `docs/investigacion/atomo-enlace-ideas-erroneas.md`, `docs/temario-completo.md`, la
matriz `docs/teoria/matriz/quimica.json` (unidad 2), la prueba `catalogo/pruebas/quimica.json`, las preguntas de San
Marcos de `docs/datos/admision-unmsm.csv`, la auditoría y el lector en frío de Materia y energía, y como nivel
`contenido/teoria/quimica/materia-y-energia.js` (con `quim-vasos`, `quim-particulas` y la paleta de
`nucleo/elementos.js`). También miré qué usan de aquí las unidades que vienen después (`tabla-periodica.js`,
`mol-y-composicion.js`, `enlace-quimico.js`) y el motor de `plantillas/fisica-moderna/`.

---

## 0. Qué pregunta la admisión

La UNI la pone en las semanas 0 a 2 y San Marcos en su tema 2 (catálogo). En el banco Cuzcano hay unas 72 fichas: modelo
de Bohr y espectros (20), modelos de Dalton a Bohr (11), núclidos e isótopos (10), iones e isoelectrónicos (10) y
configuración de átomos e iones (8) (`docs/temario-completo.md`). En la admisión real de San Marcos (2019-I a 2027-I)
hay **13 preguntas** clasificadas en esta unidad, y **8 de las 13 son de configuración**, casi todas con un metal de
transición: catión, electrones desapareados y números cuánticos del último electrón. Hoy la teoría llega solo hasta el
calcio (Z = 20).

| Periodo | Qué piden | Trampa que anota el solucionario | Idea donde cae |
| --- | --- | --- | --- |
| 2019-II (n.º 110) | Configuración del catión y del anión de una sal binaria | Escribir la del átomo neutro en vez de la del ion | 5 |
| 2020-I (n.º 106) | Dónde están protones, neutrones y electrones; neutralidad del átomo | Poner electrones en el núcleo o protones afuera | 1 |
| 2021 (n.º 91) | Orbitales llenos y semillenos, niveles completos y el catión del cromo | Ignorar la anomalía del cromo | 4 (anomalía), 5 (catión) y 6 (semillenos) |
| 2022 (n.º 93) | Qué comparten y en qué difieren los isótopos | Creer que los isótopos tienen otras propiedades químicas | 1 |
| 2023-II (n.º 94) | V/F sobre los postulados de Dalton y sus límites | — | 2 |
| 2024-II (n.º 84) | Cationes de transición: configuración, números cuánticos y desapareados (más agentes redox) | Quitar los 3d antes que los 4s | 5 y 6 (lo redox es de `reacciones-y-balance`) |
| 2025-I (n.º 87) | Desapareados, grupo y configuración de un metal de transición en su mayor estado de oxidación | Ubicar mal el grupo | 5 y 6 (el grupo es de `tabla-periodica`; el oxoanión, de `nomenclatura-inorganica`) |
| 2025-II (n.º 86) | Halógeno: electrón desapareado, periodo, sal y enlace dativo | Tomar el periodo del grupo | 6 (lo demás, de tabla, nomenclatura y enlace) |
| 2026-I (n.º 86) | Metales con configuración anómala: números cuánticos, desapareados del catión, capa de valencia y grupo | Ignorar la anomalía | 4, 5 y 6 (el grupo, de tabla) |
| 2026-II (n.º 93) | Relacionar cada científico con su modelo o aporte | Darle a Rutherford lo de Thomson, o al revés | 2 |
| 2026-II (n.º 94) | Niveles llenos, espín del último electrón, desapareados y radio iónico de un halógeno | Contar como lleno el último nivel; creer que el anión es más pequeño | 4 y 6 (el radio, de tabla) |
| 2027-I (n.º 92) | V/F sobre la lámina de oro y el modelo nuclear | Darle orbitales a Rutherford o carga negativa a las alfa | 2 |
| 2027-I (n.º 86) | Cationes de transición: desapareados, electrones d, espín y mₗ del último electrón | Quitar los 3d antes que los 4s | 5 y 6 |

Vecinas que usan esta unidad, clasificadas en otras: 2023-I n.º 89 (átomo e ion sodio con sus niveles, en tabla),
2023-II n.º 91 (isótopo radiactivo y vida media, en Materia y energía), 2024-I n.º 91, 2025-I n.º 93 y 2026-I n.º 90
(configuración para ubicar en la tabla) y 2025-II n.º 96 (radical libre: la especie con un electrón desapareado, en
enlace). San Marcos no pregunta en química el modelo de Bohr con números ni la radiactividad α, β y γ.

Las «trampas» son las que anota el solucionario: muestran que el error existe en el examen, pero **no son una medición**.
Ninguna tiene porcentaje.

---

## 1. Diagnóstico de la teoría actual

1. **Cinco ideas** (`nucleo-identidad`, `modelos-atomicos`, `numeros-cuanticos`, `configuracion-electronica`,
   `desapareados-isoelectronicos`), «Lee» en todas, «Así se resuelve» en todas y un laboratorio de tres mesas con retos
   comprobados (`nube-orbital` en 3D, `arma-ion`, `cajas-ion`). La base sirve: el átomo con su núcleo contado
   (`quim-atomo`), las cajas con flechas que se llenan por Hund (`quim-cajas`), la nube 3D con nodos calculados en el
   motor de `atomo-y-tabla` y las predicciones del sodio que pierde un electrón, la lámina de oro, el nivel 4 y el Fe²⁺.
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Las cinco abren con un diagrama: el átomo de capas, una cadena
   de textos (`quim-cadena`) o las cajas. Los objetos de «Lee» solo están escritos (el cobre de Cuajone, el mapa de
   Juliaca, la combi del Hund).
3. **Punto 2: no hay misión.** Las consignas describen controles («Los neutrones suben y bajan solos…», «La cadena se
   recorre sola…»). Tampoco hay `leyenda`, `aprendizaje`, `actividad` ni `pregunta`. No declara `calidad: 2`. La
   cabecera dice «postulante de 3.º–5.º».
4. **Punto 7: lecturas que no dicen nada.** Las ideas 2 y 6 tienen un control «t» en segundos (el reloj de la animación,
   el mismo defecto que se sacó de Materia y energía). La lectura de la idea 2 se corta a las 12 palabras
   (`split(' ').slice(0, 12)`): deja frases a medias. Varias encadenan con «·» («Z = 6: carbono · A = 12 · carga 0»).
5. **Punto 9: usa cosas que llegan después.** La predicción de la idea 3 tiene un distractor con «el periodo 4»
   (tabla periódica) y otro con «el octeto de valencia» (enlace). La idea 6 habla de «cajas de valencia», que se define
   en tabla periódica, y su predicción y su «Mira» comparan radios en pm, que es el tema «Radio atómico e iónico» de
   tabla periódica. La idea 3 presenta una metáfora (barrio, calle, casa) solo con palabras (punto 6).
6. **Falta lo que más se pregunta.** La configuración llega hasta Z = 20 en la teoría, pero la predicción de la idea 4
   ya usa el Fe²⁺, y San Marcos pregunta Cr, Cu, Fe, Mn y Co: la regla no dice todo lo que el examen pide. Tampoco
   están los números cuánticos del último electrón (4 preguntas de San Marcos los piden), las anomalías del Cr y el Cu (solo en la
   condición de la regla), que los isótopos reaccionan igual (San Marcos 2022) ni dónde está cada partícula (2020-I).
7. **Punto 13: ningún ejercicio trae `datos`.** «Así se resuelve» es el generador de «Ahora tú» con la semilla s + 900
   en las cinco ideas. No hay ejemplos resueltos (0 de 75). El glosario tiene 23 términos sin `simple` y con 0 o 1
   ejemplo (tres de ellos, nodo, plano nodal y radio de Bohr, solo sirven a la mesa 3D).
8. **Colores contra §5b.** Z va en carmín (el color de los ángulos), N en verde y A en naranja: en la regla
   «A = Z + N» quedan juntos naranja y verde, el par que en protanopía cae a 0,010. Los electrones van en turquesa y
   los desapareados en una caja naranja. La cadena de modelos pinta la evidencia en verde y el modelo en naranja, otra
   vez el mismo par.
9. **Códigos repetidos en una predicción.** En la idea 1, «Neón» y «Magnesio» llevan el mismo QM-ION-ELEMENTO; en la
   idea 2, dos opciones llevan QM-MODELO (el defecto que se corrigió en verbal y en geometría).
10. **La práctica no se separa por unidad.** `configuracion-ubicacion` tiene `TIPOS_POR_UNIDAD = {}`: la práctica de
    esta unidad saca también ubicación en la tabla, familias y vida media. `quimica-conceptos` sale sin `datos`.

---

## 2. Qué se queda, qué cambia y qué sale

**Se queda:** los cinco `id` de idea y los `id` de sus controles (`z`, `n`, `q`, `k`, `l`), porque el avance se guarda con
ellos; las tres mesas del laboratorio con sus `id`; las piezas `quim-atomo`, `quim-cajas` y `quim-orbital-3d` (con
colores nuevos, como opción); el motor de `atomo-y-tabla` (configuración por Möller con Cr y Cu, cationes por mayor n,
desapareados, números cuánticos del último electrón, orbitales 3D); la historia de Dalton a Bohr con su fuente.

**Cambia:** se agrega una idea, `configuracion-iones`, porque los iones de transición son lo más preguntado y merecen su
propia predicción. La idea 6 deja de comparar radios y pasa a ser «Hund y el último electrón». Los títulos pasan al
nombre del tema (`docs/teoria.md` 4f).

**La configuración electrónica entra aquí** (pregunta 2). Salió de la práctica de Materia y energía y no tiene otra casa:
la idea `ubicacion-lewis` de Tabla periódica ya la da por sabida («Leer una configuración»), y 8 de las 13 preguntas de
San Marcos de esta unidad son de configuración. Lo que se va a Tabla periódica es lo que usa la tabla: periodo, grupo,
bloque y familia (tipos `ubicar` y `familia` de `configuracion-ubicacion`).

**Sale:**
- la comparación de radios de los isoelectrónicos (Shannon, en pm): va a «Radio atómico e iónico» de Tabla periódica
  (pregunta 5). Aquí «isoelectrónico» se queda como definición y conteo;
- la vida media de `configuracion-ubicacion` (Materia y energía ya tiene su plantilla `vida-media`);
- las longitudes atómicas en Å, nm y pm de `conversiones-quimica` (subtipo `densidad:longitud`): no las enseña
  ninguna idea; van con el radio de Tabla periódica o salen;
- el modelo de Bohr con números (radio y energía de la órbita, longitud de onda): pregunta 4;
- la escena `atomo-y-tabla` (borrador compartido con Tabla periódica) pasa a «Más mesas del tema».

---

## 3. Las ideas, en orden

Propongo **seis**, el tope de `docs/teoria.md`. Una es nueva (`configuracion-iones`); las otras cinco conservan su `id`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `nucleo-identidad` | Partículas, isótopos e iones | Los protones del núcleo (Z) deciden el elemento y A = Z + N. Con otros neutrones es un isótopo del mismo elemento; con otros electrones, un ion: carga = Z − e⁻. |
| 2 | `modelos-atomicos` | Modelos atómicos | Cada modelo explicó una evidencia que el anterior no podía. La lámina de oro mostró que el átomo es casi vacío, con un núcleo diminuto y positivo. |
| 3 | `numeros-cuanticos` | Niveles, subniveles y orbitales | El nivel n tiene n subniveles (ℓ de 0 a n − 1); cada subnivel, 2ℓ + 1 orbitales; cada orbital, dos electrones. En el nivel n caben 2n². |
| 4 | `configuracion-electronica` | Configuración electrónica | Los electrones llenan primero el subnivel de menor energía, el de menor n + ℓ; por eso el 4s se llena antes que el 3d. El Cr y el Cu son excepciones. |
| 5 | `configuracion-iones` (nueva) | Configuración de los iones | Un anión suma electrones en el orden de llenado. Un catión pierde primero los del nivel más alto: el Fe²⁺ pierde sus dos 4s, no dos 3d. |
| 6 | `desapareados-isoelectronicos` | Hund y el último electrón | En un subnivel, cada electrón ocupa un orbital vacío antes de aparearse. Con electrones solos, un imán atrae a la especie; el último electrón tiene su n, ℓ, mₗ y mₛ. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **Partículas, isótopos e iones.** Es la base de las otras cinco. Da por sabido, de Materia y energía, que la materia
   está hecha de átomos y que el carbono-14 del hueso pasa a nitrógeno-14 (ideas 3 y 6 de esa unidad, que a propósito no
   usaron protones, neutrones ni la palabra «isótopo»). «Lee» presenta las tres partículas, su carga y **dónde está cada
   una** (San Marcos 2020-I), que el protón pesa unas 1836 veces el electrón, que las cargas opuestas se atraen y la
   notación ²³₁₁Na⁺ con sus tres números. La regla agrega una línea: los isótopos tienen los mismos electrones y por eso
   reaccionan igual (San Marcos 2022); isóbaros e isótonos, si lo apruebas (pregunta 6). «Mira» cierra el hueso: del
   carbono-14 (6 protones y 8 neutrones) al nitrógeno-14 (7 y 7), un neutrón del núcleo pasó a protón y cambió el
   elemento. «Isoelectrónico» se estrena aquí («Na⁺ tiene 10 electrones, como el neón»); su nivel examen es «X³⁻ es
   isoelectrónico con el Ca²⁺: ¿qué elemento es X?».
2. **Modelos atómicos.** Usa protón, electrón y núcleo de la idea 1. Va antes de los niveles porque el modelo actual
   (orbital, no órbita) es lo que la idea 3 cuenta. La cadena es Dalton → Thomson → Rutherford → Bohr → actual; el juego
   es la lámina de oro (sección 5) y Bohr entra en «Mira» y en la regla solo como idea: niveles permitidos y luz de
   colores fijos al bajar de nivel (pregunta 4). Su nivel examen son los V/F de San Marcos (Dalton 2023-II, Rutherford
   2027-I) y relacionar científico con aporte (2026-II). Aquí entra el tamaño del núcleo frente al átomo, el error mejor
   medido de la unidad en escala (AT2, 65 % antes y después del curso).
3. **Niveles, subniveles y orbitales.** Usa el orbital de la idea 2. Presenta los cuatro números cuánticos, sus valores
   permitidos y las capacidades (2ℓ + 1 orbitales, 2 electrones por orbital, 2n²). Su nivel examen: «¿qué juego (n, ℓ,
   mₗ, mₛ) no puede existir?» y el número de orbitales de un nivel. Da por sabido elevar al cuadrado.
4. **Configuración electrónica.** Usa subnivel, orbital y capacidad de la idea 3. El orden sale de la energía relativa
   n + ℓ (y, a igual n + ℓ, primero el de menor n). Aquí se estrenan la abreviada con el gas noble ([Ar] = los 18
   electrones del argón), el último nivel (capa de valencia, que hoy se define en Tabla periódica: ver la sección 11) y
   las anomalías del Cr y el Cu (San Marcos 2021 y 2026-I). Átomos neutros hasta Z = 36 en el juego; su nivel examen,
   hasta Z = 54 con el orden de llenado en `datos` (pregunta 3).
5. **Configuración de los iones.** Necesita la carga de la idea 1 y el orden de la idea 4. Un anión sigue el orden; un
   catión pierde primero los del mayor n (y, a igual n, los de mayor ℓ). Los isoelectrónicos de la idea 1 se ven aquí
   con la misma configuración (Na⁺, Mg²⁺ y Ne). Su nivel examen: Fe³⁺, Co³⁺, Cu⁺ y el catión del Cr.
6. **Hund y el último electrón.** Necesita las cajas de la idea 3 y las configuraciones de 4 y 5. Hund, electrones
   desapareados, paramagnético o diamagnético, y los cuatro números cuánticos del último electrón con la convención del
   examen (pregunta 9). Va al final porque San Marcos lo pregunta siempre junto con el catión de la idea 5 (2024-II,
   2026-I, 2027-I). Su nivel examen es justo ese: «desapareados y números cuánticos del último electrón del Fe²⁺».

Qué **no** entra: el radio de los iones (Tabla periódica), periodo, grupo y bloque (Tabla periódica), Bohr con números
(pregunta 4), radiactividad α, β y γ y ecuaciones nucleares (pregunta 13), masa atómica promedio (ya está en
`mol-y-composicion`), estados de oxidación y oxoaniones (nomenclatura) y radicales libres (enlace).

---

## 4. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El hueso de la llama del museo** (el mismo de la idea 6 de Materia y energía, pieza `quim-vasos`) y, al lado, dos átomos de su carbono: carbono-12 y carbono-14 | el hueso = dónde están esos átomos; cada átomo = su núcleo contado (protones y neutrones) y sus electrones afuera |
| 2 | **Un retablo dorado con pan de oro**, como los de las iglesias coloniales del sur, y la hojita de oro de Rutherford al lado: la misma clase de lámina, muy fina | la hoja = la lámina del experimento; las alfas = las partículas que se lanzan contra ella |
| 3 | **El hotel del electrón**: un hotel de pisos con pasillos y cuartos dobles, dibujado junto a sus cajas | piso = nivel n; pasillo = subnivel (s, p, d, f); cuarto doble = orbital; huésped = electrón |
| 4 | **El mismo hotel con el precio en la puerta de cada pasillo** (n + ℓ), y los huéspedes que llegan de uno en uno | precio = energía relativa; el huésped toma el pasillo más barato que tenga sitio |
| 5 | **Un salero con sal de Maras** (Na⁺ y Cl⁻) y sus cajas; en la predicción, **el frasco de sulfato ferroso** (Fe²⁺), el hierro que se da contra la anemia | el salero = dónde están esos iones; las cajas = sus electrones; el frasco = el ion que se predice |
| 6 | **Una combi que se va llenando**: cada pasajero se sienta primero en una fila vacía y recién después comparte, junto a las cajas de un subnivel | fila = orbital; pasajero = electrón; los que van solos = desapareados |

El hotel es una analogía, no un objeto real: «Lee» la presenta con su dibujo antes del juego (punto 6) y la figura
siempre lo pone al lado de las cajas, con los mismos números, para que el alumno pase de uno a las otras. Lo propongo
porque el átomo no se ve y porque `docs/temario-completo.md` ya dice que la unidad descubre que «el orden de llenado sale
de primero el más barato». Sus límites se dicen en «Lee»: los huéspedes no son bolitas quietas y el piso no es una
órbita.

Hay que dibujar, como prueba (`data-prueba`, molde §6): el retablo con su hojita, el hotel, el salero, el frasco de
sulfato ferroso y el interior de la combi con sus filas. Propongo una pieza nueva `quim-objeto` para el retablo, el
salero y el frasco; una pieza `quim-hotel` que reuse la geometría de `quim-cajas` (cada pasillo, una fila de cajas); y
una pieza `quim-lamina` para la lámina con las alfas (sección 5). El hueso ya existe en `quim-vasos` y la combi por
fuera en `fis-combi`.

---

## 5. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «El hueso guarda carbono-12 y un poco de carbono-14. Los dos son carbono.» **Arma un átomo de carbono-14.** | `z` (protones) de 1 a 12 y `n` (neutrones) de 0 a 14, sin automático; el control `q` sale del juego y la carga queda en 0 (es lo que se predice; vuelve en la mesa `arma-ion`) | `v.z === 6 && v.z + v.n === 14` | «Z = 6: carbono. A = 6 + 8 = 14: carbono-14.» Con 7 y 7: «Z = 7: nitrógeno. El mismo A = 14, otro elemento.» | «6 protones y 8 neutrones. Con 6 neutrones también es carbono: lo decide Z.» |
| 2 | «Thomson pensaba que la carga positiva estaba repartida en todo el átomo, con los electrones metidos adentro.» **Apunta una alfa justo al centro de un átomo de Thomson.** | `b`, dónde apunta la alfa: de −1 a 1 radio del átomo, de 0,1 en 0,1 (arrastre del lanzador) | `v.b === 0` | «La alfa pasó por el centro y se desvió casi nada: la carga repartida no la frena.» | «Ni apuntando al centro rebota: en el modelo de Thomson, ninguna alfa vuelve.» |
| 3 | «En el hotel del electrón, cada piso tiene un pasillo más que el de abajo.» **Abre un piso donde quepan exactamente 18 huéspedes.** | `n` (piso) de 1 a 3, sin automático; `l` (pasillo marcado) de 0 a 2 | `v.n === 3` | «Piso 3: pasillos 3s, 3p y 3d; 1 + 3 + 5 = 9 cuartos y 18 huéspedes.» Con ℓ ≥ n: «el piso 2 no tiene pasillo d: ℓ llega hasta n − 1.» | «9 cuartos dobles: 18 huéspedes. Cada piso suma un pasillo con 2 cuartos más.» |
| 4 | «Los electrones llegan al hotel de uno en uno y toman el pasillo más barato con sitio.» **Encuentra el primer átomo que estrena el pasillo 3p.** | `z` de 1 a 18 (arrastre del último huésped, como hoy) | `v.z === 13` | «Z = 13, aluminio: 1s² 2s² 2p⁶ 3s² 3p¹; el 3p (precio 4) se abre después del 3s (precio 3).» | «El aluminio: su electrón 13 es el primero del 3p, porque el 3s ya estaba lleno.» |
| 5 | «En la sal de Maras, el sodio está como Na⁺ y el cloro como Cl⁻.» **Deja al sodio con la misma configuración que el neón.** | `z` de 1 a 20 y `q` (carga) de −3 a 3; el arrastre saca o trae el último electrón | `v.z === 11 && v.q === 1` | «Na⁺: 11 protones y 10 electrones, 1s² 2s² 2p⁶, igual que el neón.» | «Na⁺ y Ne: los mismos 10 electrones y las mismas cajas. Son isoelectrónicos.» |
| 6 | «En la combi, cada pasajero se sienta solo en una fila vacía antes de compartir.» **Reparte los cuatro electrones 2p del oxígeno como en la combi.** | las cuatro flechas se arrastran a las tres cajas del 2p | reparto de Hund: las tres cajas ocupadas y una sola con dos flechas opuestas | «2p⁴: una caja con pareja y dos con un electrón solo: 2 desapareados.» | «Primero uno por caja, después en pareja: el oxígeno queda con 2 electrones solos.» |

Notas:
- **Idea 2** necesita una función nueva en el motor de `atomo-y-tabla` (regla 1): la desviación de una alfa en el modelo
  de Thomson (casi nada) y en el modelo nuclear (cuánto se desvía según qué tan cerca pasa del núcleo). No hace falta
  ninguna cifra real en pantalla: la lectura dice «casi nada», «se desvía mucho», «rebota».
- **Ideas 1, 3 y 4** pierden el automático («sube y baja solo»): el juego espera al alumno.
- **Idea 4** llega solo hasta Z = 18, para que la predicción (el electrón 19) no se haya visto.
- **Idea 6** trabaja un subnivel p para que la predicción (un d⁶) sea transferencia.

---

## 6. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores, nunca la fórmula. En la figura, lo que se pide va con «?» en
tinta. Casi ningún distractor de esta unidad tiene dato medido; los que dicen «hipótesis» se confirman con el piloto. Los
códigos nuevos llevan «nuevo».

**Idea 1.** «Un átomo de sodio tiene 11 protones, 12 neutrones y 11 electrones. Si pierde un electrón, ¿qué es ahora?»
Datos: Z del neón = 10; Z del magnesio = 12.

| Opción | Qué mide |
| --- | --- |
| Un ion Na⁺: sigue siendo sodio | Correcta |
| Neón, porque ahora tiene 10 electrones | El elemento por los electrones (QM-ION-ELEMENTO-E, nuevo: parte el QM-ION-ELEMENTO de hoy) |
| Magnesio, porque queda con carga +1 | Suma la carga a Z (QM-ION-ELEMENTO-Q, nuevo) |
| Un isótopo del sodio | Ion por isótopo (QM-ION-ISOTOPO; hipótesis; AT4 es vecino, sin porcentaje) |

**Idea 2.** «En el experimento de verdad, casi todas las alfas atravesaron la lámina de oro, pero unas pocas
rebotaron hacia atrás. ¿Qué tiene que haber dentro del átomo?» Datos: las alfas tienen carga positiva.

| Opción | Qué mide |
| --- | --- |
| Un núcleo diminuto y positivo; lo demás, casi vacío | Correcta |
| Electrones en órbitas fijas | Le da a Rutherford lo de Bohr (AT5: el 69,1 % de 421 escolares griegos dibuja el átomo de Bohr; es respaldo vecino, no del mismo ítem) |
| Una esfera maciza que no se puede partir | El modelo de Dalton (QM-MODELO-DALTON, nuevo) |
| Carga positiva repartida en todo el átomo | El modelo de Thomson, el del juego (QM-MODELO-THOMSON, nuevo; San Marcos 2026-II anota esta confusión) |

**Idea 3.** «En el piso 4 del hotel aparece un pasillo nuevo, el 4f. ¿Cuántos huéspedes caben, como máximo, en todo el
piso 4?» Datos: el piso 4 tiene los pasillos 4s, 4p, 4d y 4f; el pasillo f tiene 7 cuartos dobles.

| Opción | Qué mide |
| --- | --- |
| 32 | Correcta (1 + 3 + 5 + 7 = 16 cuartos, 2 en cada uno) |
| 16 | Cuenta cuartos y no huéspedes (QM-ORBITAL-ELECTRON) |
| 18 | Se queda con lo del piso 3, sin el f (QM-SIN-F, nuevo; reemplaza al distractor del «periodo 4») |
| 8 | Cree que todos los pisos se llenan con 8 (QM-OCHO-POR-NIVEL, nuevo; reemplaza al del «octeto», que es de enlace) |

**Idea 4.** «El argón llenó el hotel hasta el 3p. El potasio tiene un electrón más. ¿Adónde va el electrón 19?» Datos:
argón (Z = 18): 1s² 2s² 2p⁶ 3s² 3p⁶; potasio: Z = 19.

| Opción | Qué mide |
| --- | --- |
| Al 4s | Correcta (precio 4 + 0 = 4, contra 3 + 2 = 5 del 3d) |
| Al 3d: el piso 3 todavía tiene sitio | Llena por pisos y no por energía (QM-3D-ANTES; hipótesis) |
| Al 4p | Salta al pasillo que sigue en el dibujo (QM-4P, nuevo) |
| A ninguno: el argón ya está lleno | Cree que el hotel se cierra en 18 (QM-LLENO-NO-ENTRA, nuevo) |

**Idea 5.** «Las gotitas de sulfato ferroso llevan el hierro como Fe²⁺. Al formar el Fe²⁺, el hierro pierde dos
electrones. ¿De qué subnivel salen?» Datos: hierro (Z = 26): [Ar] 4s² 3d⁶; [Ar] son los 18 electrones del argón.

| Opción | Qué mide |
| --- | --- |
| Del 4s: queda [Ar] 3d⁶ | Correcta |
| Del 3d, el último en llenarse: [Ar] 4s² 3d⁴ | El último en entrar sale primero (QM-ULTIMO; es la trampa que anotan San Marcos 2024-II y 2027-I) |
| Uno de cada uno: [Ar] 4s¹ 3d⁵ | Reparte la salida (QM-REPARTE; hipótesis) |
| De ninguno: es [Ar] 4s² 3d⁶ con carga 2+ | Escribe la del átomo neutro (QM-CARGA-E; la trampa de San Marcos 2019-II) |

**Idea 6.** «En el Fe²⁺ quedan seis electrones en el 3d. ¿Cuántos quedan solos?» Datos: Fe²⁺: [Ar] 3d⁶; un subnivel d
tiene 5 orbitales.

| Opción | Qué mide |
| --- | --- |
| 4 | Correcta (5 solos y luego 1 se aparea) |
| 0 | Aparea antes de llenar los vacíos (QM-HUND; hipótesis) |
| 6 | Uno por electrón, como si hubiera 6 cajas (QM-HUND-TODOS, nuevo) |
| 1 | Resta 6 − 5 y cuenta los que sobran (QM-DESAP-RESTA, nuevo) |

«Mira» de la idea 6 sigue al último electrón: en el oxígeno, (2; 1; −1; −½) con la convención del examen, y en el Fe²⁺,
(3; 2; −2; −½). Además dice qué hace un imán con una especie con electrones solos.

---

## 7. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| Z | número atómico: los protones del núcleo | — |
| A | número de masa: protones más neutrones | **Choca con la letra de la alternativa A.** Las letras de las alternativas van en negrita (regla de la etapa 2), y A, el número de masa, nunca va en negrita |
| N | número de neutrones | **Choca con el nitrógeno (N).** Es la notación de los libros (A = Z + N); se avisa en «Lee» y el nitrógeno se nombra con su nombre o con su número de masa (¹⁴N), nunca como «N» suelto en una figura con neutrones (pregunta 7). En física, N es el newton |
| e⁻ | electrones (cuántos hay) | e también es la carga elemental en física; aquí no se usa |
| carga | protones menos electrones, con su signo (+1, −2) | Se escribe en palabras en la fórmula: carga = Z − e⁻ |
| ²³₁₁Na⁺ | arriba a la izquierda A, abajo a la izquierda Z, arriba a la derecha la carga | **Tres números pegados al símbolo.** «Lee» de la idea 1 dice cuál es cuál con su dibujo |
| 2p⁶ | nivel, subnivel y cuántos electrones hay ahí | **El superíndice cambia de sentido**: en ⁵⁶Fe es A, en Fe³⁺ la carga y en 3d⁶ los electrones del subnivel. «Lee» de la idea 4 lo avisa |
| n | número cuántico principal: el nivel (el piso) | En otras unidades, n es el mol o las vidas medias (Materia y energía). Aquí nunca son los neutrones |
| ℓ | número cuántico secundario: el subnivel (0 = s, 1 = p, 2 = d, 3 = f) | Propongo ℓ y no l, porque l se confunde con el 1 (pregunta 8). En Materia y energía, L es el calor latente |
| mₗ | número cuántico magnético: el orbital (la caja), de −ℓ a +ℓ | Con subíndice de verdad |
| mₛ | número cuántico de espín: +½ o −½ (la flecha ↑ o ↓) | El signo de ↑ es convención: va en `datos` (pregunta 9) |
| s, p, d, f | subniveles | s también es el segundo; en esta unidad no hay tiempos en segundos |
| n + ℓ | energía relativa de un subnivel (el precio del pasillo) | — |
| [Ar], [Ne] | los electrones del argón o del neón, en la abreviada | — |
| ↑ ↓ | un electrón y su espín | — |
| α, alfa | la partícula alfa del experimento de Rutherford | α es un ángulo en otras unidades; aquí se escribe «alfa» la primera vez en cada pantalla |
| Å, pm | no se usan en esta unidad (los radios se van a Tabla periódica) | — |

---

## 8. Mapa de colores por magnitud (§5b) y cómo convive con los elementos

Un color fijo por magnitud en toda la unidad, en la teoría, los ejemplos, la escena, los generadores y el glosario, con
su prueba (como `colores` de Materia y energía):

| Magnitud | Token | Por qué |
| --- | --- | --- |
| Z, los protones (número y bolitas del núcleo) | `o` naranja | el primer dato casi siempre |
| N, los neutrones | `i` turquesa | el segundo dato, o lo que se pide en la idea 1 |
| e⁻, los electrones: cuántos son, las bolitas de afuera, las flechas de las cajas, los huéspedes, los desapareados y el último electrón | `f` violeta | es lo que se busca casi siempre en la unidad (la configuración, los del ion, los solos) |
| la carga, con su signo | `h` carmín | aparece siempre con Z; el signo la nombra |
| cuántos orbitales (2ℓ + 1, n²) | `i` turquesa | el factor (× 2 electrones por orbital); nunca en el mismo ejercicio que N (lo comprueba una prueba) |
| A, n, ℓ, mₗ, mₛ, n + ℓ | tinta, con su letra | A es el total (como «el todo en tinta» de geometría); los números cuánticos son la dirección del electrón, no algo que se cuenta |
| `d` verde | no se usa | todo dibujo de la unidad tiene naranja al lado (naranja–verde: 0,010) |

Pares medidos con `herramientas/auditar-colores.py` (el menor entre visión normal, protan, deutan y tritan, en claro y
oscuro): naranja–turquesa 0,114; naranja–violeta 0,159; turquesa–violeta 0,101; carmín–violeta 0,164; turquesa–carmín
0,077; naranja–carmín 0,062, el más justo: la carga lleva siempre su signo. El verde queda fuera también por
turquesa–verde (0,057).

- **La respuesta lleva el color de su magnitud**: «18 electrones» en violeta; «A = 56» en tinta; «Z = 15, fósforo» en
  naranja. Nada se pinta de violeta antes de comprobarse: lo que se pide va con «?» en tinta.
- **Los desapareados** son electrones: violeta, marcados con una caja punteada en tinta (hoy es naranja, el color de Z).
- **Qué cambia en las piezas**: `quim-atomo` (protones de carmín a naranja, neutrones de verde a turquesa, electrones de
  turquesa a violeta) y `quim-cajas` (flechas de turquesa a violeta, caja de desapareados en tinta). Solo esta unidad
  usa esas dos piezas en la teoría; van como opción y lo de hoy no cambia (riesgo del plan §10). La escena
  `atomo-y-tabla` tiene sus colores y se corrige cuando le toque.
- **Partículas o variables, nunca los dos** (decisión de la etapa 2). El átomo de capas, las cajas y el hotel son
  dibujos de variables: sus bolitas y flechas son Z, N y e⁻, y llevan los tokens de arriba. La paleta de elementos
  (`--el-*`) no aparece en ellos. Los objetos (hueso, retablo, salero, frasco, combi) van en tinta, sin lupa de átomos;
  si alguna vez hace falta una lupa con la paleta de elementos, va en un panel aparte. En el texto, los símbolos de
  elemento (Fe, Na, Cl) van en tinta.
- **Otras unidades.** Tabla periódica pinta Z en carmín hoy. Como el color es fijo por unidad, no es un error, pero
  conviene alinearla con esta cuando se rehaga.

---

## 9. Práctica: qué existe y qué falta por idea

Lo que hay:
- **`configuracion-ubicacion`** (generador, Z hasta 86): tipos `particulas` y `atomo-ion` (idea 1), `anomala` y
  `contar` (idea 4), `cation` y `anion` (idea 5), `desapareados` y `cuanticos` (idea 6; `cuanticos` solo con Z de 37 a
  86 y solo átomos neutros); `ubicar` y `familia` (Tabla periódica) y `vida-media` (ya no es de nadie: Materia y energía
  tiene la suya). Sin `TIPOS_POR_UNIDAD`: hoy salen todos aquí. Sus datos son una sola línea larga (`DATOS_MOLLER`).
- **`quimica-conceptos`** (V/F): temas `dalton`, `modelos` y `rutherford`, y el par `cientificos` (idea 2). Sin
  `datos`, como en Materia y energía (auditoría M4).
- **`conversiones-quimica`**: solo el subtipo `densidad:longitud` (Å, nm y pm) se clasifica aquí. Sale (sección 2).
- **La escena `atomo-y-tabla`** (borrador 0.1.0, compartida con Tabla periódica): su motor sirve para casi todo
  (configuración por Möller con Cr, Cu, Mo, Ag y Au, cationes, aniones, desapareados, último electrón, electrón que sale
  y orbitales 3D), con 29 casos verificados aparte. Su papel tiene 10 problemas: p1 y p2 (idea 1), p3 (ideas 5 y 6),
  p4 y p10 (idea 6); p5, p6, p7, p8 y p9 son de Tabla periódica.
- **Mesas**: `arma-ion` (idea 1), `nube-orbital` (idea 3) y `cajas-ion` (ideas 5 y 6).
- **Prueba**: el par de reserva qui-11 (un ion X³⁻ a su elemento, idea 1).

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Partículas | `particulas`, `atomo-ion`; papel p1 y p2; mesa `arma-ion`; qui-11 | tipos «isótopo, isóbaro o isótono», «isoelectrónico a su elemento» (X³⁻ con el Ca²⁺) y «dónde está cada partícula» (San Marcos 2020-I); V/F de isótopos (San Marcos 2022) |
| 2 Modelos | V/F `dalton`, `modelos`, `rutherford`; par `cientificos` | `datos` en todos (las definiciones o postulados entre los que se elige); tipo «tamaño del núcleo frente al átomo»; papel |
| 3 Niveles | solo los «Ahora tú» de la teoría; mesa `nube-orbital` | un generador «niveles y orbitales»: capacidades, valores permitidos, el juego imposible de (n, ℓ, mₗ, mₛ); papel |
| 4 Configuración | `anomala`, `contar` | tipo «configuración de un átomo neutro» hasta Z = 54, «electrones del último nivel», «orbitales llenos y semillenos»; papel |
| 5 Iones | `cation`, `anion`; papel p3 | `datos` en lista; tipo «isoelectrónicos con la misma configuración»; mesa propia si `cajas-ion` no alcanza |
| 6 Hund | `desapareados`, `cuanticos` (Z de 37 a 86); papel p4 y p10; mesa `cajas-ion` | `cuanticos` para Z ≤ 36 y para cationes (San Marcos 2027-I: el último electrón del catión); tipo «paramagnético o diamagnético» |

Propuesta, siguiendo lo que se hizo en Materia y energía: `configuracion-ubicacion` se separa por unidad
(`TIPOS_POR_UNIDAD`) y le da a esta unidad solo los tipos de las ideas 1, 4, 5 y 6, con `datos` en lista y una línea
por dato (el orden de llenado, la regla de las anomalías, la convención de mₗ y mₛ), los colores de la sección 8 en sus
`variables` y prueba en 400 semillas. Dos generadores nuevos: `particulas-nucleo` (idea 1, sobre el motor de
`atomo-y-tabla`) y `niveles-orbitales` (idea 3). `quimica-conceptos` gana `datos` en sus temas de esta unidad y un tema
`isotopos`. Papel de 5 a 10 por idea, con sus datos al final. `nucleo/repaso-tipos.js` se actualiza con lo mismo.

---

## 10. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| El protón pesa unas 1836 veces el electrón | Valor de libro: con «unos», sin fuente |
| Si el núcleo fuera un arándano, el átomo sería un estadio de fútbol (unas 100 000 veces más grande) | OpenStax, *Chemistry 2e*, §2.3, la misma fuente de la historia de hoy. Lo compruebo en la página antes de escribir. La versión local (un granito de quinua en el centro de la plaza de armas) es la misma razón, sin cifras nuevas |
| Unas pocas alfas de cada miles rebotan | OpenStax §2.2 lo dice sin cifra. La de Geiger y Marsden (1909, «1 de cada 8000») está **por confirmar**; si no se confirma, va «unas pocas» |
| El pan de oro de los retablos coloniales | Hecho de todos los días, sin cifra. Si se nombra una iglesia (Juli, Andahuaylillas o la Compañía del Cusco), la confirmo con el Ministerio de Cultura; si no, va sin nombre |
| El hueso de llama y su carbono-14, unos 5730 años | Ya está en Materia y energía (valor de libro, con «unos») |
| C-14: 6 protones y 8 neutrones; N-14: 7 y 7 | Cálculo (Z y A), no dato |
| El cobre de Cuajone tiene Z = 29 | Hecho sin cifra del mundo (Z es un dato de tabla). Se queda |
| La sal de Maras es cloruro de sodio | Hecho sin cifra. No uso su producción ni su pureza |
| El sulfato ferroso se da contra la anemia | **Por confirmar**: norma técnica de anemia del MINSA. Si no la encuentro, va «un suplemento de hierro» sin decir quién lo da |
| Un imán fuerte atrae un poco a una sustancia con electrones solos | Valor cualitativo de libro. No afirmo que una pastilla concreta se pegue a un imán |
| Configuraciones por Möller con Cr, Cu, Mo, Ag y Au anómalos | Las del motor de `atomo-y-tabla` y de `configuracion-ubicacion`, contrastadas en el informe con Python |

---

## 11. Riesgos de orden con otras unidades (`requiere`)

- **`requiere` se queda en `["quimica.materia-y-energia"]`.** De ahí usa: átomo, elemento, símbolo, partícula, las
  potencias de 10 (idea 5) y el carbono-14 que pasa a nitrógeno-14 (ideas 3 y 6). La carga eléctrica, el imán y la luz
  de colores son de física, pero de unidades que vienen muy después (`electrostatica`, `magnetismo`,
  `ondas-electromagneticas`): no las pongo como requisito. «Lee» dice lo que hace falta con un ejemplo de todos los días
  (las cargas opuestas se atraen; un imán de refrigeradora).
- **Lo que esta unidad tiene que dar porque otras lo usan:** «isótopo» (Mol y composición, masa atómica promedio; Materia
  y energía evitó la palabra a propósito), «ion», «catión» y «anión» (Tabla periódica, Enlace, Nomenclatura), la
  configuración (Tabla periódica, idea `ubicacion-lewis`) y «electrón desapareado» (Enlace, radicales libres).
- **«Electrones de valencia» y «último nivel».** Hoy los define «Lee» de `ubicacion-lewis`, en Tabla periódica. La idea 4
  de aquí necesita «el último nivel» (San Marcos 2026-I pide la capa de valencia con la configuración). Propongo
  estrenar aquí «último nivel (capa de valencia)» y que Tabla periódica lo recuerde cuando se rehaga. Lewis se queda
  allá.
- **Radios iónicos.** Si sale la comparación de isoelectrónicos (pregunta 5), Tabla periódica tiene que agregarla a su
  idea `radio-atomico-ionico` cuando se rehaga. Hasta entonces nadie la enseña.
- **Bohr con números.** El motor de `plantillas/fisica-moderna/` ya calcula Eₙ = −13,6/n² eV y la luz de un salto, pero
  el catálogo de `fisica.fisica-moderna` no tiene el tema. Si se va allá (pregunta 4), hay que agregarlo y poner esta
  unidad como consejo en su `requiere`.
- **Lo que no puede aparecer aquí** porque llega después: periodo, grupo, bloque y familia (Tabla periódica), octeto
  y Lewis (Enlace), radio en pm (Tabla periódica), estado de oxidación (Nomenclatura). La teoría de hoy usa tres de
  ellos (sección 1, punto 5).

---

## 12. Preguntas para Gerson

1. **¿Seis ideas, con `configuracion-iones` como idea propia?** Recomiendo que sí. Los iones de transición son lo más
   preguntado (5 de 13 en San Marcos) y su trampa (sacar los 3d antes que los 4s) merece su propia predicción. La otra
   opción es dejarlos en la idea 4, que quedaría con dos reglas y dos errores fuertes en una sola predicción.
2. **¿La configuración electrónica entra aquí?** Recomiendo que sí, entera (ideas 4 a 6), y que Tabla periódica se quede
   solo con periodo, grupo, bloque y familia. Tabla periódica ya la da por sabida y 8 de las 13 preguntas de San Marcos
   de esta unidad son de configuración.
3. **¿Hasta qué Z?** Recomiendo el juego hasta Z = 36 (hasta el kriptón, con Cr y Cu) y «Ahora tú» de nivel examen hasta
   Z = 54, con el orden de llenado escrito en `datos` (es una herramienta, no el paso hecho: el alumno decide dónde va
   cada electrón). El Au y lo que tiene 4f quedan para la práctica.
4. **Bohr con números** (radio y energía de cada órbita, luz de un salto: 20 fichas en el banco, nada en San Marcos).
   Recomiendo dejar aquí solo la idea (niveles permitidos; al bajar de nivel sale luz de un color fijo) y llevar los
   números a `fisica.fisica-moderna`, cuyo motor ya los calcula, agregando el tema a su ficha. La otra opción es un
   «Ahora tú» de nivel examen en la idea 2 con rₙ y Eₙ en `datos`, pero entonces la regla de la idea 2 tiene que
   enseñarlos.
5. **Isoelectrónicos.** Recomiendo dejar aquí la definición y el conteo (ideas 1 y 5) y llevar la comparación de radios
   a «Radio atómico e iónico» de Tabla periódica, donde está el radio. La predicción de radios de hoy sale.
6. **Isóbaros e isótonos** (núclidos, 10 fichas en el banco). Recomiendo una línea en la regla de la idea 1, con sus
   definiciones en `datos` y un caso de nivel examen. No llevan idea propia.
7. **La letra de los neutrones.** N choca con el nitrógeno, que esta unidad usa (el carbono-14 que pasa a nitrógeno-14,
   el Hund del nitrógeno). Recomiendo N, la de los libros (A = Z + N), con el aviso en «Lee» y el nitrógeno siempre con
   su nombre o como ¹⁴N. La otra opción es la de academia, #n⁰ (con #p⁺ y #e⁻), que no choca con nada pero se lee raro
   fuera de la academia.
8. **ℓ o l para el subnivel.** Recomiendo ℓ, como ya hace `configuracion-ubicacion`, porque l se confunde con el 1 en
   «l = 1». La teoría de hoy usa l.
9. **Convención de mₗ y mₛ.** Las cajas se llenan de mₗ = −ℓ a +ℓ, primero con ↑ en cada una, y ↑ vale +½. No todos los
   libros usan los mismos signos. Recomiendo escribirla en `datos` de todo ejercicio que pida el último electrón y en
   una tarjeta «Convención del examen» (`nucleo/convencion.js`), como la hibridación. Lo confirmo con un libro de
   `fuentes/` antes de escribir.
10. **Objetos.** ¿Te sirven el hueso de la llama (sigue de Materia y energía), el retablo con pan de oro, el hotel del
    electrón como analogía presentada en «Lee», la sal de Maras, el sulfato ferroso y la combi? Los dibuja la sesión
    como prueba (piezas `quim-objeto`, `quim-hotel` y `quim-lamina`) y tú decides cuáles reemplazas. Si el hotel no te
    convence, la otra opción es quedarse solo con las cajas, sin objeto, y declarar `sinObjeto` en las ideas 3 y 4, que
    es lo que el contrato quiere evitar.
11. **Colores (sección 8).** ¿Apruebas Z naranja, N turquesa, electrones violeta, carga carmín y A con los números
    cuánticos en tinta, sin verde? Cambia los colores de `quim-atomo` y `quim-cajas` (como opción). Recomiendo que sí: hoy
    A y N quedan juntos en naranja y verde, que en protanopía no se distinguen.
12. **Práctica (sección 9).** ¿Separo `configuracion-ubicacion` por unidad, saco de aquí `ubicar`, `familia`, `vida-media`
    y las longitudes de `conversiones-quimica`, y hago los generadores nuevos `particulas-nucleo` y `niveles-orbitales`?
    Recomiendo que sí, igual que en Materia y energía.
13. **Radiactividad α, β y γ** (no tiene tema en el catálogo y San Marcos no la pregunta). Recomiendo dejarla fuera y solo
    cerrar el hueso en «Mira» de la idea 1: un neutrón del carbono-14 pasa a protón y queda nitrógeno-14, sin nombrar la
    beta. Si la UNI la pide, se decide aparte dónde va.
14. **Títulos.** Propongo el nombre del tema (sección 3), como pide `docs/teoria.md` 4f. El `id` no cambia. Si prefieres
    conservar alguno de hoy («El núcleo decide el elemento», «Dónde va cada electrón»), dime cuál.
