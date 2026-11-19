# Auditoría de contenido: «Enlace químico» (quimica.enlace-quimico)

19 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa6/propuesta-quimica.md` (§3, §8 y §12). Lo que vieron
los dos lectores en frío de esta ronda está en `rutinas/frio/quimica.enlace-quimico.md`; aquí se cita solo cuando el
código lo confirma o lo agrava. Unidad hermana (partida de la misma): `quimica.geometria-molecular`, que comparte la pieza
`quim-enlace` y la audita otro agente a la vez.

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/enlace-quimico.js` (v0.2.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos;
  - los 75 ejemplos;
  - «Ahora tú» y «Así se resuelve», 400 semillas de cada uno por idea;
  - el glosario (21 términos), las 2 mesas del laboratorio en su grilla y la historia.
- La pieza `quim-enlace` (objetos de la primera pantalla y símbolos de Lewis en fila), y lo que la unidad dibuja con
  `quim-molecula` y `quim-particulas`.
- La práctica `plantillas/enlace-lewis/`: 16 tipos en las 5 ideas, `casos.json` con 16 casos y `papel.json` con 8.
- La app a 390 px con `--entera`: los 35 momentos y los 75 ejemplos (servidor propio, puerto 4415), y el probador de
  Juega de la idea 1 en sus cinco materiales, en claro y en oscuro.

**Las tablas, propias.** Escritas aparte, sin la unidad, el motor de `plantillas/enlace` ni el generador:
- electrones de valencia por grupo (H a Xe y los metales que usa: Cu, Fe, Zn, Ag);
- electronegatividad de Pauling revisada por Allred (1961), tabla del CRC;
- metal o no metal, y periodo;
- carga del ion por el octeto: el metal pierde su valencia; el no metal gana hasta 8; el H con un metal queda H⁻;
- fórmula iónica por el mcd de las cargas;
- Lewis de átomo central con ligandos de enlace simple: pares libres = (valencia del central − ligandos − carga) ÷ 2;
- carga formal = valencia − electrones de sus pares libres − órdenes de sus enlaces;
- orden promedio = pares compartidos en los enlaces que resuenan ÷ número de esos enlaces, simplificado.

**Cuentas.** Rehechas con dos scripts:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-enl/cuentas.js` (teoría) y
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-enl/cuentas-gen.js` (práctica).
- «Ahora tú», 400 semillas por idea: 1660 respuestas rehechas desde el texto de la pregunta (los V/F, a mano: los seis
  bancos de afirmaciones), con una sola opción que calza.
- «Así se resuelve», 400 semillas por idea: la respuesta de cada una.
- **Cada fórmula iónica:** la correcta con carga total cero y mínima. En cada distractor se comprobó lo que dice su
  explicación: si dice «no da 0», que no dé 0; si dice «se simplifica», que dé 0.
- **Cada conteo de electrones de valencia y de pares libres:** los de «Ahora tú», «Así se resuelve», los 75 ejemplos y
  las lecturas del juego.
- **Cada carga formal:** los 6 átomos de `casoCF` y las de los ejemplos (O₃, NO₃⁻).
- **Cada orden de enlace promedio:** los 7 iones o moléculas de la teoría y los de la práctica.
- **Cada figura de Lewis** (`quim-molecula`), por un camino distinto del de la unidad. Se calcula la carga formal de cada
  átomo con lo que se ve (rayas, pares y puntos sueltos). Su suma debe ser la carga de la especie que nombra el `alt`, y
  los electrones dibujados, los de valencia menos esa carga. Las cargas dibujadas deben ser las cargas formales. Se
  revisaron:
  - el juego, en toda su grilla, y Predice con su «revelar»;
  - Mira, paso por paso, y la regla;
  - las figuras de los ejemplos;
  - 400 semillas de «Así se resuelve», con las figuras de sus pasos;
  - la mesa de resonancia.
- **Los símbolos de Lewis en fila** (`quim-enlace`): los puntos son la valencia, el ion de no metal lleva 8 y cada fila de
  iones da carga cero.
- La práctica: 2000 problemas (400 por idea), los 16 de `casos.json` y los 8 del papel. Todas las respuestas cuadran.
- **Lo que la respuesta no ve, y sí vio el script:**
  - el XeF₂ y el I₃⁻ de «Así se resuelve» dibujados con un par libre de menos (A1);
  - el carbono como C³⁻ en la mesa (A3);
  - una explicación que dice «no da 0» de una fórmula que da 0 (A2);
  - «Una molécula lineal» (M6);
  - explicaciones de distractores con otro valor (M2).

**Excepciones al octeto (BF₃, NO, PCl₅, SF₆), contra el libro:**
- BF₃: 6 alrededor del B, octeto incompleto;
- NO: 11 electrones; el N con 7 (un par libre, un electrón suelto y el doble), cargas formales 0 y 0;
- PCl₅: 10, sin pares libres;
- SF₆: 12.

Los dibujos del juego cuadran con esas cuentas. Las cuatro van bien.

**Forma, hibridación y polaridad de la molécula.** Se buscaron en todo texto que ve el alumno: «lineal», «angular»,
«tetraédrica», «trigonal», «hibridación», «sp³», «molécula polar o apolar», «geometría», «dipolo», «fuerzas
intermoleculares». Solo salió el título «Una molécula lineal: N₂O» (M6). La polaridad que se usa es la del enlace (δ+ y
δ−, ΔEN), que es de esta unidad. Los pares libres del central se dibujan en un plano y no dicen nada de la forma.

**El probador de Juega (idea 1).** Capturas de los cinco materiales en claro y oscuro:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-enl/foco/` (mosaico en
`.../e6-cierre-enl/foco-mosaico.png`). Encendido: ampolla rellena, halo punteado, siete rayos y filamento grueso.
Apagado: ampolla vacía y filamento fino y tenue. Se lee sin ambigüedad en los dos temas, y la lectura lo dice
(«Agua con sal: prende…»). Solo se corrige el rayo de la izquierda, que caía sobre el cable, y el de la derecha, que
parecía un cable suelto (B4).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 400 semillas y los temas del catálogo): **0 problemas** antes y
después. Pruebas propias antes de corregir: unidad 8 de 8, `quim-enlace` 2 de 2, generador 7 de 7.
`herramientas/ecuaciones-ancho.js quimica.enlace-quimico`: «todo cabe» (52 pantallas) antes y después.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 1, 10 (la figura miente) | Idea 4, «Así se resuelve» del XeF₂ y del I₃⁻ (`radial`) | `radial` pone en el central a lo más 2 pares libres con 2 ligandos (y ninguno con 3 ligandos y 2 pares, o con 4 y 2). El XeF₂ sale con 2 de sus 3 pares: 20 electrones dibujados de 22, mientras el paso dice «3 pares libres» y la cuenta da 10 alrededor. El I₃⁻ igual, y sin su carga. Una de cada dos semillas. | Tabla de huecos por número de ligandos y de pares; error si falta un lugar. El I₃⁻ sale de «Así se resuelve» (su carga no se dibuja): entra el BrF₃. |
| A2 | 13 (explicación falsa) | Idea 2, «Ahora tú» `casoFormula` con cargas iguales (Mg–O, Mg–S, Ca–O, Al–N) | La opción Mg₂O₂ (y Ca₂O₂, Mg₂S₂, Al₃N₃) llevaba QM-FORM-INVERSA: «así la carga total no da 0». Da 0: es la misma proporción sin simplificar. 11 de 400 semillas. | La forma sin simplificar va antes que la «inversa» en la lista de candidatos; con cargas iguales gana su explicación («se simplifica»). |
| A3 | 10 (dato falso en la figura) | Laboratorio, mesa «Dos átomos, un enlace» (`CARGA_ION`) | Todo no metal que no fuera de los grupos 16 o 17 salía «3−»: el carbono con Li, Na, K, Mg o Ca se dibujaba C³⁻. La invitación «un metal con un no metal que la guía no llame iónico» lleva justo ahí (Na–C, ΔEN 1,62). | Carga por grupo: 15 → 3−, 14 → 4−; el H con un metal, −. Prueba en toda la grilla. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 7, 5 | Idea 3, lectura del juego y solución de `casoOrden` | «O₂: 12 e⁻ = 2 enlaces (4) + 4 pares libres (8)» y «CO₂: 4 enlaces (8)». El O₂ tiene un enlace, doble; la leyenda dice «=: enlace doble». Cuenta pares como enlaces. | «2 pares compartidos (4)». |
| M2 | 13 (el distractor no da su valor) | Ejemplos «Dos moléculas con hidrógeno», «Una molécula lineal: N₂O», «El oxígeno que respiras», «Los dos gases del aire», «La estructura del HCN», «Pares libres con más de ocho» | «La E (3 y 2) cuenta electrones del P»: son 2, no 3. En el N₂O, la C (2) «olvida los del oxígeno»: da 1. La D (6) «suma los pares compartidos»: da 5 u 8. El O₂ con un simple: «a cada O le faltarían 2» (a cada uno le falta 1). El N₂ con doble: «cada N con 6 y un par de más». El HCN: «deja al C con 10» (serían 14 electrones). La E del SF₄: solo nombra el xenón. | Alternativas que salen del error que se nombra (E «2 y 4»; N₂O 1 y 5) y explicaciones con su cuenta. |
| M3 | 5, 3 | Idea 2 (`lugarTxt`, `casoCarga`), idea 3 (`casoLibresCentral`, `casoPares`), idea 4 (PCl₅) y la práctica | «6 electrónes» en todos los Datos de grupo (los dos lectores); «cambian 1 electrón»; «1 pares libres», «0 pares libres»; en la práctica, «tiene ningún par libre». | Un ayudante `eTxt` y `pTxt` en todos los sitios. Prueba en 400 semillas (teoría y práctica). |
| M4 | 3, 13 | Idea 4, «Ahora tú» `casoAlrededor` (XeF₄, ClF₃, SF₄, BrF₅) | Nada dice que los electrones que sobran van al central (lector B): sin eso se marca 8. Además, el ICl₄⁻ pedía meter la carga en el central sin decirlo, y los Datos traían «− carga del ion» en especies sin carga. | Dato «Pares libres del central = (sus electrones de valencia − enlaces simples que forma) ÷ 2». La pregunta dice que cada enlace es simple. Sale el ICl₄⁻. |
| M5 | 13, 3 | Línea de Datos «Electrones a repartir = suma de los de valencia − carga del ion» (idea 3, ejemplo del SO₄²⁻, y la práctica) | Con un anión, restar «2» da 28, la trampa E (lector B). | Con su ejemplo: «(un anión 2− suma 2; un catión 1+ resta 1)». La regla lleva «CO₃²⁻: 4 + 3 · 6 + 2 = 24». |
| M6 | 9 (orden con Geometría molecular) | Ejemplo de la idea 5 «Una molécula lineal: N₂O» | La forma de la molécula es de la unidad siguiente. | «Los pares del N₂O». Prueba de palabras de forma, hibridación y polaridad de la molécula. |
| M7 | 8 (regla 8 de la Etapa 5: «Ahora tú» no repite) | Idea 5: `casoOrdenRes`, `casoCuantas`, `casoCF` y el V/F; idea 3: el V/F | El orden del O₃, del NO₃⁻ y del CH₃COO⁻ está resuelto en tres ejemplos (el lector B lo vio con el CH₃COO⁻). Las cargas formales del O y el N del NO₃⁻ y de los tres O del O₃ están en otros tres. El conteo del CO₃²⁻ está en «Los dibujos de la tiza». En 1 de cada 20 V/F de las ideas 3 y 5 salía el trío del ejemplo. | Especies nuevas: SO₃, SO₂ y C₆H₆ para el orden; C y O del CO₃²⁻, N del NO₂⁻ y S del SO₃ y del SO₂ para la carga formal; sin el CO₃²⁻ en el conteo. `vfDe` evita el trío del ejemplo. |
| M8 | 12, 3 | Regla de la idea 1 | Sale «ΔEN ≥ 1,7» sin decir qué es la EN, y «el HF, con 1,78» contradice la tabla de la misma regla sin explicarlo (lector A). | Lee 2 dice qué es la EN. La condición: «la ΔEN (diferencia de electronegatividad) es una guía; mandan los elementos. El HF, con 1,78, son dos no metales: covalente polar». |
| M9 | 5 (un color por magnitud) | Idea 1, la lupa (Predice, Mira y la regla) | El ⊕ gris (Na) y el ⊖ verde (Cl) de la paleta de elementos chocaban con el «Na⁺ Cl⁻» carmín del texto, y el ⊕ del cobre era rojo. Los electrones del mar iban negros y sin nombre (lector A). | Los iones en carmín (carga) y los electrones en violeta, como en toda la unidad. Mira dice cuál es cuál. |
| M10 | 13 | Regla y Lee de la idea 4, «Así se resuelve» con AlCl₃ | La regla nombra solo Be y B con menos de 8, y lo primero que resuelve es el Al (lector B). | «Be, B y Al pueden quedar con menos de 8; P, S, Cl y Xe, con más». |
| M11 | 13, molde §3 | Ejemplos «El gas de Camisea», «El enlace del amoníaco», «Un sólido iónico», «Un doble en el CH₂O», «Quién tiene resonancia», «Un gas del escape» | Les faltaba el dato que usan: los tipos por elementos, hacia dónde se corre el par, los electrones de valencia y el octeto, qué es un radical. Al CH₂O le faltaba un paso del reparto. «Un sólido iónico» traía en Datos la frase de la alternativa A. | Datos completos, sin la frase de la respuesta; el resuelto del CH₂O reparte los 6 que sobran antes de decir que al C le faltan 2. |
| M12 | 9 (niveles) | Ejemplos de nivel 1 y 2 «Un gas del escape» (NO) y «El gas café de la ciudad» (NO₂) | La misma cuenta con un número más (lector B). | El de nivel 2 pide elegir entre el NO₂ y el NO₂⁻: hay que usar la carga. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 5 | EN en los Datos | «H 2,2» en Datos y «2,20» en el resuelto (lector B). | La EN siempre con dos decimales. Prueba. |
| B2 | 3 | Grupo en los Datos | «grupo 1 (IA)» en Datos y «grupos 1, 2 y 13» en la regla (lector A). | Solo el número. |
| B3 | 12 | Juego y Predice de la idea 5 | «como en los otros dibujos» antes de verlos; la leyenda solo nombra la carga del oxígeno y Predice muestra «+» en el N. | Lectura «24 e⁻; los átomos no se movieron». Leyenda «carga de un átomo en ese dibujo»; dato en Predice. |
| B4 | 4 (pieza) | `quim-enlace`: probador, ventana, tiza, símbolos | Rayos horizontales sobre el cable. Las 8 moléculas del aire iguales (78 contra 21). La tiza casi no se ve: se ve la pizarra. El electrón del Na se pierde bajo el inicio de la flecha (lectores A y B). | Sin rayos horizontales. N₂ claras y O₂ oscuras (6 y 2). La tiza grande en primer plano. Puntos de 3,2 y la flecha 14 px sobre el símbolo. |
| B5 | 12 | Idea 5: regla, Datos y Lee | «número de enlaces» sin decir que el doble cuenta uno, y «entre átomos iguales» confuso (lector B). | «un doble cuenta como un enlace»; «cambian en cuál de varios enlaces iguales va el doble». |
| B6 | 13 | Explicaciones de V/F | Ideas 1, 2 y 4: una alternativa niega además otra afirmación que su explicación no nombra. | «La D además niega la III». |
| B7 | 7 | Mira de la idea 4 y ejemplo del H₃N–BF₃, Predice de la idea 5 | El H⁺ del paso 1 sin su «+»; «H₃N–» y «N–» partidos al final de una línea (lector B). | El «+» del H⁺ desde el paso 1; unión sin corte (U+2060) en las dos fórmulas. |
| B8 | 8 | Idea 3, «Así se resuelve» | Empezaba en el H₂O, que es el que abre el juego (lector A). | PH₃, OF₂, SiH₄ y NCl₃. |

## Lo que está bien y hay que copiar al molde

- **La comprobación de las estructuras dentro de la unidad** (`2 · compartidos + 2 · libres = valencia` en cada Lewis de
  `LEWIS`, al cargar). Con la carga formal por átomo de esta auditoría (la suma es la carga de la especie), pasa de
  contar electrones a revisar cada figura, incluidas las que arma una función (`radial`, `triangular`).
- **El juego que no adelanta Predice**: la sal sin lupa, el nitrógeno fuera del juego iónico, el triple fuera del juego de
  Lewis, el dativo fuera del de excepciones y el NO₃⁻ fuera del de resonancia. La prueba de la unidad lo exige.
- **El probador**: un objeto que se reconoce, una misión que solo cumple el agua con sal, y el encendido que se distingue
  sin color (halo, rayos, filamento).
- **La guía de 1,7 con su contraejemplo** (el HF) dicho en la regla y en una invitación del laboratorio (Mg–Br, Na–H), en
  vez de esconderlo.
- **El NO con su electrón suelto dibujado aparte**, que deja contar 11 y ver el impar.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Toda figura de Lewis cuadra**: la suma de las cargas formales de sus átomos es la carga de la especie, y las cargas dibujadas son las cargas formales (A1, B3). | Sí, en química: con la tabla de valencias y la fórmula del `alt`. Esta unidad ya la prueba; serviría como prueba común de `quim-molecula`. |
| **La explicación de un distractor no contradice su propio valor** («no da 0» de una fórmula que da 0) (A2). | Parcial: la unidad declara qué propiedad niega cada código de error y la prueba la evalúa. |
| **Una carga de ion dibujada sale de la regla del octeto para cada grupo**, sin un «else» para todo lo demás (A3). | Sí: recorrer la grilla de la mesa. |
| **«Ahora tú» no repite la especie de un ejemplo en la misma pregunta**, también en los V/F por sorteo (M7). | Sí, si los generadores declaran la especie; con texto, parcial. |
| **Palabras de una unidad posterior** (forma, hibridación, polaridad de la molécula) **no aparecen antes de su `requiere`** (M6). | Sí: lista de palabras por unidad en el catálogo. |
| **Plurales y tildes armados** («1 pares», «electrónes», «cambian 1 electrón») (M3). | Sí: lista negra en `Teoria.problemas`. |

## Correcciones (19 nov)

Hechas en el mismo cierre, junto con las notas de los dos lectores en frío (ver `rutinas/frio/quimica.enlace-quimico.md`,
«Correcciones de la ronda 1»). La teoría pasa a v0.2.1.
- Copias de antes: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-enl/antes/`.
- Capturas de después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-enl/despues/`.
- Figuras sueltas (XeF₂, BrF₃, NH₄⁺ paso 1, mesa Na–C, lupa):
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-enl/figs.png`.

**Pruebas nuevas.** Todas fallan con los archivos de antes (comprobado en `.../e6-cierre-enl/viejo/`):
- al final de `enlace-quimico.test.js`, 5:
  - toda figura de Lewis cuadra, en 400 semillas;
  - fórmulas iónicas: ninguna explicación dice «no da 0» de una fórmula que da 0;
  - cargas de la mesa;
  - sin palabras de Geometría molecular ni plurales y tildes mal armados;
  - EN con dos decimales, y «Ahora tú» sin las especies ni el V/F de los ejemplos;
- al final de `generador.test.js`, 1;
- al final de `quim-enlace.test.js`, 1.

**Después:**
- unidad 13 de 13, `quim-enlace` 3 de 3, generador 8 de 8;
- `geometria-molecular.test.js` y `quim-molecula.test.js` en verde: la pieza no cambió lo que dibuja para esa unidad;
- validador con `calidad: 2` simulada y 400 semillas: 0 problemas;
- `contenido/teoria/teoria.test.js`: 164 de 164;
- `cuentas.js` y `cuentas-gen.js` sin fallas;
- `ecuaciones-ancho.js`: «todo cabe»;
- el papel, regenerado (cambió la línea de Datos de la carga) y al día;
- `npm run -s catalogo`.

| # | Qué se hizo |
|---|---|
| A1 | `HUECOS[n][pares]` en `radial` (2: hasta 3 pares; 3: hasta 2; 4: hasta 2; 5: 1), y error si falta un lugar. `radial` acepta las especies de `especie()`. `AROUND_R` = AlCl₃, XeF₂, BrF₃ y PCl₃. Prueba: carga formal y electrones de cada figura de Lewis. |
| A2 | En `casoFormula`, la forma sin simplificar (`fo(qx, qm)`) va antes que la inversa. Prueba en 400 semillas. |
| A3 | `CARGA_ION` por grupo (13 → 3+, 14 → 4−, 15 → 3−). Prueba en toda la grilla. |
| M1 | `parTxt`: «2 pares compartidos (4)» en la lectura y en la solución de `casoOrden`. |
| M2 | Dos moléculas con hidrógeno: E «2 y 4» (cuenta electrones sueltos: 2 y 4). N₂O: alternativas 4, 8, 1, 5 y 3, cada una con su error. O₂: «quedan 10: no alcanzan para tres pares libres en cada O, que pedirían 12». N₂: «uno de los N quedaría con 6». HCN: «necesitaría 14 electrones, y hay 10». SF₄: «en el azufre (2) y en el xenón (4)». |
| M3 | `eTxt`, `pTxt` y `parTxt` en la teoría y en el generador; «no tiene pares libres» en la práctica. Pruebas en las dos. |
| M4 | `D4.libres` en `casoAlrededor` y en «Así se resuelve» (que muestra la cuenta de los pares en su paso de datos). La pregunta dice «forma un enlace simple con cada F». Sin el ICl₄⁻. |
| M5 | `D3.carga`, en la teoría y en el generador: «Electrones a repartir = suma de valencias − carga del ion (un anión 2− suma 2; un catión 1+ resta 1)». La regla de Lewis lleva el ejemplo del CO₃²⁻. |
| M6 | «Los pares del N₂O». Prueba de palabras. |
| M7 | `RES_A` = SO₃, SO₂ y C₆H₆ (`fr` simplifica y `colaFr` escribe «9/6 = 3/2 = 1,5»). `casoCuantas` sin el CO₃²⁻. `CF_A` con átomos que no están en los ejemplos. El distractor «carga del ion» solo con iones; en moléculas, «0» con su explicación. `vfDe(…, evitar)`. Prueba en 400 semillas. |
| M8 | Lee 2 de la idea 1 define la EN; la condición de la regla explica el HF. |
| M9 | `ATOMOS` de la lupa: iones con `color: 'h'` y electrones con `color: 'f'` (sin la paleta de elementos). Mira: «Na⁺ (chicos, +) y Cl⁻ (grandes, −)», «mar de electrones móviles (puntitos violeta)». |
| M10 | Regla, ecuación («B y Al: 6») y Lee de la idea 4 con el Al. |
| M11 | Línea `D.tipos` en los ejemplos y casos que eligen el tipo; `D.corre` en el del N–H. Sólido iónico con datos que no dicen la A. CH₂O en dos pasos con «12 − 6 = 6». Quién tiene resonancia con valencias y octeto. NO con la definición de radical. |
| M12 | «El gas café y su ion»: NO₂ (17, impar) o NO₂⁻ (18, par). |
| B1–B8 | Todas hechas (ver la tabla de arriba). En la pieza (B4), solo en los objetos y la vista que usa esta unidad: probador, ventana, tiza y símbolos. Globos, soplete, chorro y olla, de Geometría molecular, no se tocaron. |

### Pendiente

- **El cloro que se lee «CI»** en la letra sin serifa de los dibujos y los títulos (lector B). Es la fuente de la app
  (`--font` y `--font-r` en `app/estilos.css`, fuentes del sistema), no de la unidad. Un arreglo mínimo, que vale también
  para Geometría molecular: dibujar los símbolos de los átomos (`quim-molecula`, `quim-enlace`) con la fuente de las
  ecuaciones, que tiene serifa. Lo decide la sesión o Gerson; aquí no se tocó.
- **La pieza `quim-molecula`** (compartida, no es de esta unidad): los pares libres chicos y en diagonal, y las letras
  pequeñas (lector A). Queda para quien la mantiene.
- **«Así se resuelve» de la resonancia** sin dibujo para el NO₂⁻ y el HCOO⁻ (lector B). Un dibujo plano de tres átomos en
  fila diría «lineal» sin querer. Lo dejo así: el texto da la cuenta completa.
- **Para Gerson:** el SO₂ y el SO₃ van con la estructura de octeto (un doble y simples, orden 3/2 y 4/3), como la piden
  las academias (doble más dativos). El motor de `plantillas/enlace` los da con octeto expandido. Decidido por la sesión;
  Gerson revisa después.
