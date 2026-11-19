# Propuesta de ideas: «Longitud de arco y sector circular»

`trigonometria.longitud-de-arco-y-sector` · Etapa 6 del plan de calidad, segunda unidad de la rama «Ángulos y razones»
(sigue a «Ángulo trigonométrico y sistemas de medida», con `calidad: 2`) · fases 1 a 5 con criterio delegado
(`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta es el guion de la unidad y ya se usó para escribirla. Las dudas van como
**decisiones tomadas** (sección 9), cada una con su motivo y la opción descartada. No hay ningún conflicto crítico.

**Estado (19 nov, fases 1 a 5 hechas):** las cinco ideas están escritas enteras (Lee, juego con misión, predicción, Mira,
regla, «Así se resuelve», «Ahora tú» de tres tipos con datos y nivel de examen, glosario con `simple` y 15 ejemplos cada
una), con la pieza nueva `trig-arco` (ocho objetos de prueba), un laboratorio de cinco mesas (una por idea) y la práctica
nueva `plantillas/trig-arco-sector/` (15 tipos, 30 casos verificados aparte y 8 de papel). La unidad no declara
`calidad: 2`; con la marca simulada, el validador no da faltas. Lo que cambió durante la escritura está en la sección 9
(decisiones 15 a 19).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador y cierre-delegado), las decisiones de `docs/etapa2/` a `docs/etapa5/`,
`docs/etapa5/propuesta-trigonometria.md` (modelo de formato), la unidad anterior de la rama
(`angulo-trigonometrico.js` con su prueba, su auditoría y su lector en frío, para no repetir lo que se corrigió allá), la
teoría actual de esta unidad (v0.1.0, cinco ideas sin contrato), su ficha en `catalogo/cursos/trigonometria.json`, sus dos
plantillas (`cinta-radio` y `geo-areas-circulares`), `docs/investigacion/trigonometria-ideas-erroneas.md`,
`docs/temario-completo.md` (unidad 2), la matriz `docs/teoria/matriz/trigonometria.json`, el ítem `tri-03` de la prueba
del curso, las seis preguntas de San Marcos de `docs/datos/admision-unmsm.csv` y, para no contradecir ni adelantar,
`fisica/movimiento-circular.js` (usa el arco como herramienta) y `razones-trigonometricas-agudas.js` (la que sigue).

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 2; San Marcos, tema 2. **Banco Cuzcano:** unas 49 fichas: longitud de arco (18), ruedas,
poleas y engranajes (18), sector y trapecio circular (13). Las ruedas pesan tanto como el arco.

**San Marcos, admisión real 2019-I a 2027-I:** seis preguntas de esta unidad.

| Periodo (examen) | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2020-I (15 set 2019, n.º 53) | Área que barre un limpiaparabrisas (trapecio circular). Trampa: usar solo la hoja y no el radio total | 3 (es el objeto de su primera pantalla) |
| 2022 (19 mar 2022, n.º 45) | Lo que recorre un punto de una rueda que avanza (cicloide) | 4, solo el número de vueltas; la cicloide no entra (decisión 9) |
| 2024-I (3 dic 2023, n.º 43) | Perímetro de un sector interior cuya área es múltiplo de la del trapecio que queda. Trampa: el ángulo en grados | 3, nivel examen |
| 2025-II (1 mar 2025, n.º 37) | El cerco (perímetro) de un sector con su área y su ángulo en radianes. Trampa: contar solo el arco o solo los radios | 2, nivel examen |
| 2026-I (11 oct 2025, n.º 41) | Costo de un terreno con forma de sector; el ángulo sale de un triángulo notable | 2, sin el notable (decisión 10) |
| 2026-II (8 mar 2026, n.º 43) | Razón entre el área de un sector interior y la del trapecio, con los radios en razón dada. Trampa: no elevar al cuadrado | 3, nivel examen |

Las tres trampas que se repiten (el ángulo en grados, el radio sin elevar y la hoja sin el brazo) son distractores de
las ideas 1, 2 y 3.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cinco ideas** (`arco`, `sector`, `trapecio-circular`, `vueltas-rueda`, `faja-y-eje`), con «Lee» y «Así se resuelve»,
   y un laboratorio de tres mesas (`sector-completo`, `rodea`, `faja-libre`). La base sirve: el arco como radios, el
   sector como medio arco por radio (Arquímedes), el trapecio como sector grande menos chico, la moneda que rodea a otra
   y la faja contra el eje común.
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Las cinco abren con el plano `trig-plano` (círculos y rayos). La
   combi del óvalo, la tajada de torta, el limpiaparabrisas y la bicicleta solo están escritos en «Lee».
3. **Punto 2: no hay misión,** ni `leyenda`, `aprendizaje`, `actividad`, `pregunta` ni `letras`; la cabecera dice «3.º
   de secundaria» y la ficha, `grado: 3`.
4. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 75) y el glosario trae un ejemplo por
   término, sin `simple`.
5. **«Así se resuelve» es el mismo tipo que «Ahora tú»** con otra semilla, en las cinco ideas.
6. **Las lecturas encadenan con «·»** («θ = 90° = π/2 rad · s = 3,14 cm»), lo que el molde prohíbe.
7. **Colores contra §5b y contra la unidad anterior:** el ángulo va en naranja, los radios en verde pegado al naranja
   (protanopía 0,010), los arcos en turquesa y el área en carmín, que es el color de los ángulos en todo el curso.
8. **La idea 1 predice lo que el juego ya mostró:** el juego pasa los grados a radianes en la lectura y la predicción
   pide justo eso con otros números.
9. **Letras que chocan con la unidad anterior:** R es el radio mayor y L el arco de afuera, pero en «Ángulo
   trigonométrico» R es el número de radianes (y allá se decidió que el radio es siempre r minúscula).
10. **La práctica no es de la unidad:** `geo-areas-circulares` es de Geometría (coronas, lúnulas, regiones sombreadas) y
    solo su tipo `rueda` es de aquí; `cinta-radio` es una escena vieja con paleta propia.

**Se queda:** los cinco `id` de idea, las tres mesas con sus `id` (con controles y colores nuevos), la historia de
Arquímedes (con fuente) y los doce términos del glosario, que otras unidades del curso pueden usar.

**Sale o cambia:** los títulos; las cinco primeras pantallas (pasan a objetos); las cinco predicciones salvo la de la
moneda; L, l y R (pasan a s₁, s₂, r₁ y r₂); los colores; `geo-areas-circulares` deja de servir a esta unidad;
`cinta-radio` va a «Más mesas del tema» también aquí.

---

## 1. Las ideas, en orden

Cinco ideas, con sus `id` de siempre. No hace falta partir la unidad ni declarar `septimaIdea`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `arco` | Longitud de arco | El arco mide θ radios: s = θ · r, con θ en radianes; si el ángulo viene en grados, primero se pasa a radianes. |
| 2 | `sector` | Área del sector circular | El sector es la fracción θ/2π del círculo: A = θ · r²/2 = s · r/2. Con el doble de radio, el arco se duplica y el área se cuadruplica. |
| 3 | `trapecio-circular` | Trapecio circular | Un trapecio circular es un sector grande menos uno chico del mismo ángulo: A = θ(r₂² − r₁²)/2, o la semisuma de sus arcos por su ancho. |
| 4 | `vueltas-rueda` | Número de vueltas de una rueda | Una rueda que rueda sin deslizar da n = d/(2πr) vueltas, donde d es el camino de su centro; alrededor de otra rueda, ese camino es otra circunferencia. |
| 5 | `faja-y-eje` | Ruedas unidas: faja y eje | Con faja, cadena o engranaje, los bordes recorren el mismo arco: θ₁ · r₁ = θ₂ · r₂. En un eje común, las ruedas giran el mismo ángulo. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **Longitud de arco.** Va primero porque las otras cuatro la usan. Parte del radián de la unidad anterior (un arco de
   un radio abarca 1 rad, con las pitas de la rueda) y aquí se calcula: el arco mide θ radios. Su nivel de examen junta
   dos conversiones de la unidad anterior: el minutero (minutos a vueltas a radianes) y un ángulo en grados centesimales.
2. **Área del sector.** Usa el arco de la idea 1 (A = s · r/2) y el área del círculo, que va como dato. Su nivel de
   examen es San Marcos 2025-II (el cerco de un sector con su área y su ángulo) y el perímetro que es «tantas veces el
   radio».
3. **Trapecio circular.** Resta dos sectores de la idea 2. Su objeto es el limpiaparabrisas de San Marcos 2020-I, y su
   nivel de examen, la razón de áreas de San Marcos 2026-II.
4. **Número de vueltas.** Usa el arco de la idea 1: al rodar sin deslizar, lo que avanza el centro es el arco que
   rueda el borde. Su predicción es la moneda que rodea a otra igual (da 2 vueltas, no 1).
5. **Faja y eje.** Al final, porque usa el arco (idea 1) y las vueltas (idea 4). Es la mitad del banco de la unidad.
   Física («Movimiento circular») lleva después lo mismo con velocidades; aquí solo hay ángulos, arcos y vueltas.

**Da por sabido** (todo de `trigonometria.angulo-trigonometrico`, su único `requiere`): el radián, π rad = 180° = 200ᵍ,
la vuelta en los tres sistemas, los minutos del reloj y convertir. **Va como dato** cuando se usa: el área del círculo
(π · r²), el largo de la vuelta (2π · r), el área de un triángulo y la de un trapecio.

**Qué no entra** (y dónde va):
- Las razones trigonométricas (San Marcos 2026-I halla el ángulo con un triángulo notable): son la unidad siguiente.
- La cicloide (San Marcos 2022): no la presenta ninguna unidad del curso; aquí queda solo el número de vueltas.
- Velocidad angular y lineal (ω, v = ω · r): «Movimiento circular» de Física. Aquí no hay tiempo, salvo el del minutero.
- Coronas, lúnulas y regiones sombreadas: `geometria.longitud-y-areas-circulares`.

**Temas de la ficha:** se quedan los cuatro («Longitud de arco», «Área del sector y del trapecio circular», «Número de
vueltas de una rueda», «Ruedas, poleas y engranajes»).

---

## 2. Objeto de la primera pantalla

Ninguna pieza del kit los dibuja: la idea 1 estrena la pieza **`trig-arco`** (dibujos de prueba, `data-prueba`, con su
prueba numérica de encuadre y de rótulos). Las figuras de examen (sectores y bandas con letras) siguen en `trig-plano`.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Un columpio del parque**, visto de lado | la cadena es el radio; donde cuelga quieta, el lado inicial; el asiento recorre el arco |
| 2 | **Un abanico de papel plegado** que se abre | sus dos varillas de los bordes son radios; el borde de arriba, el arco; el papel, el área |
| 3 | **El limpiaparabrisas de un carro** | el brazo gira desde un punto; el jebe va solo en la parte de afuera y limpia una banda curva |
| 4 | **La rueda de una bicicleta** con la llanta mojada en pintura | la marca de la llanta cuenta las vueltas; la huella pintada en el piso mide lo que avanzó |
| 5 | **La transmisión de una bicicleta**: plato, cadena y piñón (y, en la predicción, la rueda de atrás) | la cadena pasa el arco del plato al piñón; el piñón y la rueda de atrás comparten eje |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «La cadena del columpio es el radio r; el asiento recorre un arco s.» **Con la cadena de 2 m, haz que el asiento recorra 1,5 m de arco.** | `t` (θ, de 0,25 a 1,25 rad, de 0,25 en 0,25); `r` (1,5; 2 o 2,5 m) | `t === 0.75 && r === 2` | «θ = 0,75 rad: el arco mide 0,75 cadenas; s = 0,75 · 2 m = 1,5 m» |
| 2 | «El abanico tiene varillas de 20 cm.» **Abre el abanico hasta que su papel cubra 50π cm².** | `g` (θ, de 30° a 180°, de 15° en 15°) | `g === 45` | «45° es 1/8 de vuelta: A = 50π cm², 1/8 del círculo» |
| 3 | «El brazo del limpiaparabrisas barre 120°; el jebe va al final del brazo.» **Con un brazo de 60 cm, elige el jebe para que su arco de adentro mida 20π cm.** | `r2` (brazo, de 40 a 60 cm); `h` (jebe, de 20 a 40 cm) | `r2 === 60 && h === 30` | «adentro, s₁ = 20π cm; afuera, s₂ = 40π cm: mismo ángulo» |
| 4 | «La llanta deja una huella de pintura.» **Con la rueda de 0,3 m de radio, haz que la bici avance 1,2π m.** | `r` (0,2; 0,3 o 0,4 m); `n` (vueltas, de 0,25 a 2) | `r === 0.3 && n === 2` | «2 vueltas de 0,6π m: d = 1,2π m ≈ 3,77 m» |
| 5 | «El plato de los pedales mide 10 cm de radio.» **Elige el piñón con que una vuelta de los pedales dé 2 vueltas del piñón.** | `n1` (vueltas de los pedales, de 0,5 a 2); `r2` (piñón: 4, 5, 8 o 10 cm) | `n1 === 1 && r2 === 5` | «la cadena corre 20π cm: el piñón da 2 vueltas» |

Cada misión se cumple con un solo caso de su grilla y no al abrir (lo comprueba la prueba de la unidad).

---

## 4. La predicción de cada idea

La app baraja las opciones. Los `datos` solo traen equivalencias y valores, nunca la fórmula. TR2 y TR4 son del informe
de trigonometría (TR2 documentado, TR4 sale de TR2 y TR3); lo demás son hipótesis de aula.

**Idea 1.** «La cadena de otro columpio mide 2 m. Si el asiento se aleja 60° de donde cuelga quieto, ¿cuánto mide el
arco que recorre?» Datos: «π rad = 180°» y «π ≈ 3,14». El juego solo da el ángulo en radianes; aquí viene en grados.

| Opción | Qué mide |
| --- | --- |
| 2π/3 ≈ 2,09 m | Correcta: 60° = π/3 rad, y π/3 · 2 |
| 120 m | 60 · 2, con el ángulo en grados (TR4) |
| 2 m | «60° es un radián»: el arco de un radio (TR2) |
| 4π/3 ≈ 4,19 m | Usa el largo de las dos cadenas, el diámetro (ARCO-DIAM) |

**Idea 2.** «Otro abanico tiene varillas del doble de largo, 40 cm, y se abre el mismo ángulo. ¿Qué les pasa a su arco y
al área de su papel?» Datos: «Varillas: 20 cm en el primero y 40 cm en el segundo.»

| Opción | Qué mide |
| --- | --- |
| El arco se duplica y el área se cuadruplica | Correcta |
| Los dos se duplican | El área crece como el radio (SEC-LINEAL) |
| Los dos se cuadruplican | El arco crece como el área (SEC-ARCO-CUADRADO) |
| Ninguno cambia: el ángulo es el mismo | Solo mira el ángulo (SEC-ANGULO) |

**Idea 3.** «Otro limpiaparabrisas tiene un brazo de 40 cm, y su jebe va desde los 20 cm hasta la punta. Si barre
120°, ¿qué área limpia?» Datos: «120° = 2π/3 rad». El juego no da ningún área; el área de un sector se aprendió en la idea 2.

| Opción | Qué mide |
| --- | --- |
| 400π cm² | Correcta: 2π/3 · (40² − 20²)/2 |
| 400π/3 cm² | El sector del jebe solo, de radio 20 (TRAP-RESTA; la trampa de San Marcos 2020-I) |
| 1600π/3 cm² | El sector entero del brazo (TRAP-GRANDE) |
| 800π cm² | Resta bien los cuadrados y olvida la mitad (TRAP-MITAD) |

**Idea 4.** «Una moneda rueda sin deslizar alrededor de otra igual, que está fija, hasta volver a su lugar. ¿Cuántas
vueltas da sobre sí misma?» Datos: «Las dos monedas tienen el mismo radio.» (La predicción del informe, con monedas
iguales.) El juego solo rueda sobre una recta.

| Opción | Qué mide |
| --- | --- |
| 2 vueltas | Correcta: su centro recorre una circunferencia de radio 2r |
| 1 vuelta | Cuenta el borde de la fija que toca (VUEL-CONTACTO) |
| 0: solo se traslada | No ve que también gira (VUEL-TRASLADA) |
| 4 vueltas | Divide el camino del centro entre media vuelta (VUEL-DIAMETRO) |

**Idea 5.** «El piñón de 5 cm dio 2 vueltas. La rueda de atrás, de 30 cm de radio, va en el mismo eje que el piñón.
¿Cuántas vueltas da la rueda?» Datos: «Piñón: 5 cm de radio. Rueda de atrás: 30 cm de radio.» El juego no tiene eje
común.

| Opción | Qué mide |
| --- | --- |
| 2 vueltas | Correcta: en un mismo eje giran el mismo ángulo |
| 1/3 de vuelta | Reparte por radios, como con cadena (POL-FAJA-EJE) |
| 12 vueltas | Multiplica por la razón de radios (POL-PROPORCIONAL) |
| 1 vuelta | Copia las vueltas de los pedales (POL-PEDAL) |

---

## 5. Tabla de letras y símbolos (va también en el campo `letras`)

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| θ | El ángulo central; en una rueda, el ángulo que gira. θ₁, θ₂, θ₃: el de cada rueda | En las fórmulas va en radianes |
| r | Un radio. r₁ y r₂: en el trapecio, el de adentro y el de afuera; en las ruedas unidas, el de la rueda 1 y el de la 2 | **R no se usa**: en la unidad anterior es el número de radianes. Se avisa en «Lee» de la idea 3 |
| s | La longitud de arco. s₁ y s₂: los arcos de adentro y de afuera del trapecio | La letra de Física («Movimiento circular»); muchas academias usan L |
| A | El área del sector o del trapecio circular | Ninguna rueda se llama A |
| h | El ancho del trapecio circular: h = r₂ − r₁ | |
| n | Número de vueltas; n₁, n₂: las de cada rueda | Igual que en la unidad anterior |
| d | Lo que avanza el centro de la rueda | Al rodar sin deslizar, d es el arco que rueda el borde |
| π | El número 3,1416…; π rad = 180° | |
| O | El centro, en las figuras de examen | Ningún punto se llama A, r, s ni n |

---

## 6. Mapa de colores (§5b: un color fijo por magnitud en la unidad)

| Token | Magnitud | Dónde |
| --- | --- | --- |
| `h` carmín | **El ángulo θ, en cualquier sistema** (60° y π/3 rad son el mismo ángulo), con su arco chico junto al vértice | Las cinco ideas; el carmín de los ángulos en todo el curso |
| `o` naranja | **Los radios**: r, r₁, r₂ (la cadena, las varillas, el brazo, el plato y el piñón) | Las cinco ideas; en la unidad anterior el radio ya era naranja |
| `i` turquesa | **Los arcos**: s, s₁, s₂, y d, que es el arco que rueda el borde | Las cinco ideas |
| `f` violeta | **Lo que se busca casi siempre al final**: el área A (ideas 2 y 3) y el número de vueltas n (ideas 4 y 5) | Nunca van juntos en un mismo problema |
| tinta | El ancho h, π, el objeto y lo que se pide antes de hallarlo («?») | Todas |
| `d` verde | No se usa | — |

**En la rama (Ángulo trigonométrico → Longitud de arco → Razones):** el ángulo es carmín en las tres unidades. La unidad
anterior pinta además el número de radianes en violeta porque su tema es el sistema de medida (decide cuál de tres
escalas se usa); aquí no se convierte por convertir, y el violeta queda para lo que se busca al final. Un mismo ángulo
escrito «60°» y «π/3 rad» va entonces en un solo color, y la palabra «rad» dice el sistema.

Reglas que salen de ahí:
- La respuesta lleva el color de su magnitud: un arco en turquesa, un área o unas vueltas en violeta, un ángulo en
  carmín, un radio en naranja. Lo que se pide va con «?» en tinta hasta comprobar.
- Dos radios de un mismo problema van los dos en naranja y se distinguen por su subíndice y su lugar (como los dos
  ángulos de la unidad anterior); lo mismo los dos arcos.
- Pares que quedan juntos: naranja–turquesa 0,114, turquesa–violeta 0,101, naranja–violeta 0,189, carmín–turquesa
  0,077 y carmín–violeta 0,167. Naranja–carmín (0,062) se junta en cada figura: el ángulo es un arco chico con su letra
  junto al vértice y el radio, una recta larga.
- La unidad escribe esta regla en su cabecera, con una prueba que la recorre en todos los textos y figuras.

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Arco | papel 3 de `cinta-radio`; `tri-03` en la prueba | tipos «el arco» (θ en grados), «radio o ángulo» y «el minutero o los centesimales»; papel |
| 2 Sector | papel 3 y 5 de `cinta-radio`; mesa `sector-completo` | tipos «el área», «radio o ángulo desde el área» y «el perímetro» (San Marcos 2025-II); papel |
| 3 Trapecio | papel 6 de `cinta-radio`; tipo `sector/trapecio` de Geometría | tipos «el área», «el ángulo desde los arcos» y «la razón de áreas» (San Marcos 2026-II); papel |
| 4 Vueltas | papel 7 de `cinta-radio`; tipo `rueda` de Geometría; mesa `rodea` | tipos «avanza o vueltas», «alrededor de otra» y «dos ruedas, distintas vueltas»; papel |
| 5 Faja y eje | papel 8 y 9 de `cinta-radio`; mesa `faja-libre` | tipos «faja o cadena», «engranajes con sentido» y «tres ruedas con un balde»; papel |

**Plantilla nueva `plantillas/trig-arco-sector/`**, formato `predicciones`: generador con `TIPOS_POR_IDEA` (tres tipos
por idea, niveles 1 a 3), prueba, `casos.json` verificado con un cálculo aparte y `papel.json` con sus datos al final.
`cinta-radio` pasa a «Más mesas del tema» también en esta unidad (`"rehacer"` con las dos unidades). `geo-areas-circulares`
deja de servir a esta unidad: es de Geometría y solo su tipo `rueda` era de aquí (sale también su fila de
`nucleo/repaso-tipos.js`, porque deja de ser un generador mixto). Dos ítems nuevos para la prueba del curso, a la
**reserva** (las formas ya tienen 10 pares): un área de sector con el ángulo en grados y una rueda que rodea a otra.

### 7b. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Columpios con cadenas de 1,5 m a 2,5 m | Valores de problema, creíbles: sin fuente |
| Abanicos de 20 a 40 cm; limpiaparabrisas con brazo de 40 a 60 cm y jebe de 20 a 40 cm | Valores de problema, creíbles: sin fuente |
| Ruedas de bicicleta de 0,2 a 0,4 m de radio; plato de 10 cm y piñones de 4 a 10 cm | Valores de problema (una rueda de adulto mide unos 0,33 m de radio): sin fuente |
| El minutero da una vuelta en 60 min | Es una cuenta, no un dato |
| Historia: Arquímedes, *Medida del círculo*, proposición 1 | Ya trae fuente (seminario de Harvard, 2009) |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido:** todo lo de `trigonometria.angulo-trigonometrico` (su único `requiere`, que
confirmo). El área del círculo, el largo de la vuelta, el área del triángulo y la del trapecio no están en el
`requiere` (son de Geometría): van en `datos` y en «Lee».

**Dentro de la unidad:** la idea 2 usa el arco (1); la 3, el sector (2); la 4, el arco (1); la 5, el arco y las vueltas
(1 y 4). Ninguna usa algo de una idea posterior.

**Lo que no hay que adelantar:** las razones trigonométricas (Razones, la que sigue) y la velocidad angular (Física).

**Lo que otras unidades toman de aquí:** Física («Movimiento circular») escribe s = θ · r con θ en radianes y «al rodar
sin resbalar, la rueda avanza lo mismo que el arco que recorre su borde»: esta unidad dice lo mismo, con las mismas
letras (s, θ, r), y no habla de velocidades. El glosario conserva sus doce términos.

**Avance de los alumnos:** los cinco `id` y las tres mesas se conservan: nada se pierde. Los controles cambian de rango
y algunos de `id` (la colección guardada se ajusta sola al rango nuevo; un control que ya no existe se ignora).

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas con sus `id` de siempre**, en el mismo orden. Motivo: el orden ya va de lo simple a lo compuesto y el
   banco reparte su peso entre las cinco. Descartado: partir las ruedas en dos ideas («en una recta» y «alrededor de
   otra»): la segunda cabe como «Ahora tú» y Mira de la idea 4.
2. **Objetos:** columpio, abanico de papel, limpiaparabrisas, rueda de bicicleta con la llanta pintada y la transmisión
   de la bicicleta, todos en la pieza nueva `trig-arco` (dibujos de prueba). Descartado: volver a la rueda del triciclo
   de la unidad anterior en la idea 1 (repetiría su primera pantalla; «Lee» la recuerda con palabras).
3. **El juego de la idea 1 da el ángulo en radianes y la predicción en grados.** Motivo: hoy la predicción pide lo que la
   lectura ya hacía (pasar a radianes y multiplicar). Así se mide TR4 con algo que el juego no mostró. Descartado: el
   juego en grados.
4. **Colores: θ en carmín en cualquier sistema, radios en naranja, arcos en turquesa, área y vueltas en violeta.**
   Motivo: §5b pide un color por magnitud, y aquí hay una sola magnitud de ángulo; el carmín es el del ángulo en todo el
   curso y el naranja del radio viene de la unidad anterior. Descartado: los radianes en violeta, como en la unidad
   anterior (el ángulo tendría dos colores en una misma cuenta, y el área se quedaría sin color que no choque con el
   radio naranja: el verde cae a 0,010 en protanopía).
5. **Letras:** s para el arco (como Física), r₁ y r₂ para dos radios, A para el área y **nada de R ni L**. Motivo: en la
   unidad anterior R es el número de radianes y se decidió que el radio es siempre r minúscula. Descartado: L y R de las
   academias (se avisa en «Lee» de la idea 3: «en muchos libros verás R y L»).
6. **El ancho h va en tinta.** Motivo: los cuatro colores ya están tomados en el trapecio (θ, radios, arcos y área), y h
   se distingue por su llave y su letra. Descartado: h en naranja junto a r₁ y r₂ (tres naranjas en una figura).
7. **En las ruedas alrededor de otra no hay letra para la rueda fija:** la regla lo dice con palabras («el centro recorre
   una circunferencia de radio igual a la suma de los dos radios por fuera, o a su resta por dentro»). Motivo: no gastar
   una letra más ni reusar R. Descartado: R para la rueda fija.
8. **La faja, la cadena y el engranaje van juntos** («los bordes recorren el mismo arco»), con el sentido como parte de la
   regla (el engranaje invierte el giro; la cadena no). Los dientes entran solo en un ejemplo de nivel 3, con su dato.
   Descartado: una idea propia para los engranajes.
9. **La cicloide no entra** (San Marcos 2022): no la presenta ninguna unidad del curso; queda el número de vueltas.
10. **San Marcos 2026-I se usa sin el triángulo notable**: el ángulo se da en grados. Razones es la unidad siguiente.
11. **Práctica:** plantilla nueva `trig-arco-sector` (15 tipos, tres por idea) y 8 problemas de papel; `cinta-radio` a
    «Más mesas del tema» en las dos unidades; `geo-areas-circulares` deja de servir a esta unidad y sale su fila de
    `nucleo/repaso-tipos.js` (archivo compartido, cambio de un bloque). Descartado: separar por unidad el generador de
    Geometría (es de otra rama y otra sesión).
12. **Prueba del curso:** dos pares nuevos a la reserva (`tri-12`, área de sector con el ángulo en grados; `tri-13`, la
    rueda que rodea a otra). Descartado: sacar `tri-03`, que ya mide el arco.
13. **Ficha del catálogo:** `grado: 5` (como el resto de la rama), `trig-arco-sector` primero y sin
    `geo-areas-circulares`. `requiere` se queda con `trigonometria.angulo-trigonometrico`.
14. **El glosario conserva sus doce términos;** «eje común» cambia su definición para no decir lo que responde la
    predicción de la idea 5 («giran juntas el mismo ángulo») y va sin `simple`. «altura» y «vértice» se quedan sin `simple`.
15. **«perímetro» no se define aquí:** ya lo define «Áreas y líneas notables» (un término por curso) y esta unidad lo
    marca como «se explica en…». La idea 2 estrena «centímetro cuadrado» (cm²), que su Lee ya usaba. Descartado: mover la
    definición desde la otra unidad (no es de esta sesión).
16. **Laboratorio de cinco mesas, una por idea:** se conservan `sector-completo` (ahora el abanico), `rodea` y `faja-libre`
    (cadena o engranaje) con sus `id` y los de sus controles, y entran `arco-columpio` y `limpia-libre`. Descartado: dejar
    las ideas 1 y 3 sin mesa propia.
17. **El juego de la rueda usa una sola escala** (63 px por metro), con radios de 0,3 a 0,4 m y hasta 1,5 vueltas: las
    ruedas se ven chicas, pero dos casos se comparan. El columpio tiene un armazón fijo (de 2,5 m de cadena) y la cadena
    cambia de largo: así la figura llena su lienzo con cualquier cadena. Descartado: cambiar la escala con cada caso.
18. **El ícono de la unidad en la app** (`app/dibujos/trigonometria.js`, archivo compartido, una letra) pasa de «L» a «s»,
    la letra del arco en la teoría.
19. **El color del ángulo en la rama** (la nota de la sesión, 19 nov): carmín en todo sistema, como en Razones; ver §6.
    Descartado: los radianes en violeta, como en «Ángulo trigonométrico» (decisión 4).
