# Auditoría de contenido: «Propiedades periódicas» (quimica.propiedades-periodicas)

19 nov 2026. Auditor externo (fase 7 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-quimica.md` (§12; en especial 11, 24, 25,
26 y 27). Lo que vio el lector en frío de esta ronda está en `rutinas/frio/quimica.propiedades-periodicas.md`; aquí se
cita solo cuando el código lo confirma o lo agrava. Unidad hermana: `rutinas/auditoria/quimica.tabla-periodica.md` (las
cuentas se rehicieron con el mismo script).

**Qué se revisó.**
- La teoría `contenido/teoria/quimica/propiedades-periodicas.js` (v0.2.0, unidad nueva, sin `calidad: 2`):
  - las 4 ideas con sus 7 momentos;
  - los 60 ejemplos;
  - «Ahora tú» y «Así se resuelve», 200 semillas de cada uno por idea;
  - el glosario (11 términos), las 2 mesas con sus 8 invitaciones y la historia.
- Las piezas `quim-tabla` (propiedad con círculos o barras) y `quim-tira` (vistas esferas, barras y objetos), y lo que usa
  de `quim-molecula`.
- La práctica `plantillas/propiedades-tabla/`: 16 tipos en las 4 ideas, `casos.json` con 18 casos y `papel.json` con 8.
- La app a 390 px con `--entera`: los 28 momentos y los 60 ejemplos (servidor propio, puerto 4314).

**Las tablas, contra su fuente.** Cada valor de la unidad y del generador se comparó con una tabla escrita aparte:
- Radio atómico de Clementi, Raimondi y Reinhardt (1967): los 36 valores, del H al Kr. Cuadran todos con la tabla
  calculada (H 53, He 31, F 42, Na 190, K 243, Kr 88…).
- Primera energía de ionización: los 36, desde las energías del NIST ASD en eV (× 96,4853, redondeadas). Cuadran todas. El
  As da 944 con el valor vigente del NIST (9,7886 eV); tablas más viejas traen 947. El orden As > Se no cambia.
- Electronegatividad de Pauling revisada por Allred (1961): los 33 que trae, y el Cs (0,79) de un ejemplo. Cuadran.
- Radios iónicos de Shannon (1976), número de coordinación 6: los 15. Cuadran, también el Be²⁺ (45) y el Al³⁺ (53,5).
- Energías sucesivas del NIST (Li, Be, B, C, Na, Mg, Al, Si, K, Ca) y afinidades de OpenStax §6.5 (12): cuadran.
- **Lo que la tabla no dice y la unidad sí:**
  - «dos bajadas por periodo». En el periodo 5 la EI sube de Sr a In y de Sb a Te, y en el 6 también. En el 4, entre los
    de transición, hay tres bajadas más (Ti → V, Fe → Co → Ni). Ver M6.
  - «carácter metálico: qué tan fácil pierde electrones», con el par Ca–Ga. Ver M7.

**Cuentas.** Rehechas con `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-qui/cuentas.js`.
De la unidad y del generador solo lee el texto; cada respuesta sale de las tablas de arriba. Además revisa toda igualdad
numérica («4562 ÷ 496 ≈ 9,2», «3,98 − 0,82 = 3,16») y todo valor escrito junto a un símbolo («Na 190 pm», «EN: Cl 3,16»,
«Cl⁻ 181»), en resueltos, `siFuera`, lecturas del juego, Mira, reglas, Lee y glosario.
- «Ahora tú»: 800 casos y «Así se resuelve»: 800. Las respuestas correctas cuadran todas. Para las sucesivas, el grupo sale
  del mayor cociente de las energías del NIST.
- Los 60 ejemplos: los 20 de nivel 3 con su letra rehecha a mano, y los números de los 60 por el script.
- Las 4 predicciones:
  - radio del Na al Cl: baja, de 190 a 79 pm;
  - la serie del neón: O²⁻ 140 > F⁻ 133 > Na⁺ 102 > Mg²⁺ 72;
  - P 1012 > S 1000;
  - el flúor aislado, neutro: 9 protones y 9 electrones.
- Las 4 misiones en su grilla, ninguna cumplida al abrir:
  - grupo 1;
  - Br⁻;
  - B u O (dos casos a propósito: «encuentra uno»);
  - K–F, ΔEN = 3,16, un solo caso de 25.
- La práctica: 800 problemas, los 18 de `casos.json` y los 8 del papel.
- Las 8 invitaciones del laboratorio: el par de igual EN existe (Si y Cu 1,90; C y Se 2,55).
- **Lo que la respuesta no ve, y sí vio el script:**
  - una opción que es también correcta en un tercio de los pares de isoelectrónicos (A1);
  - el Mira de la idea 2 sin su dibujo (A2);
  - datos que faltan en el V/F de iones (M5);
  - un par de carácter metálico que contradice la EI de la propia unidad (M7);
  - dos `siFuera` que no dicen el valor de su opción (B1, B2).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes**, antes y después.
Pruebas propias antes de corregir: unidad 8 de 8, `quim-tabla` 5 de 5, generador 7 de 7.
`herramientas/ecuaciones-ancho.js quimica.propiedades-periodicas`: «todo cabe» (43 pantallas).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13 (más de una respuesta válida) | Idea 2, «Ahora tú» tipo 1 (`casoParIso`) y práctica `iso-par` | La opción «El de mayor carga, sea cual sea su signo» señala justo a la correcta cuando el anión de carga 2 va con uno de carga 1: O²⁻ con F⁻ o con Na⁺, S²⁻ con Cl⁻ o con K⁺, Se²⁻ con Br⁻ o con Rb⁺. Y no señala a nadie cuando las cargas son iguales (F⁻ con Na⁺). Teoría: 14 de 40 casos con dos respuestas buenas. Práctica: 20 de 49. | Sacar esa opción. Va «No se puede saber sin la tabla de radios» (QM-SIN-LEY), que siempre es falsa. |
| A2 | 4, 1 (la figura no es la que se describe) | Mira de la idea 2 | Las escenas no traen `vista`, y `quim-tira` toma su vista solo de la escena. Por eso los 5 pasos dibujan la tira de tarjetas del He al Ca en filas de 8, sin un solo átomo ni ion. El texto habla de «Na: 11 p⁺, 11 e⁻» y de las series. El lector creyó que era una tabla periódica mal hecha (sin H, con los gases nobles a la izquierda). | Cada escena con `vista: 'esferas'` y su escala. La primera escena es el Na y el Na⁺. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 3, 6 | Juego de la idea 1 y Lee 3 | «Radio calculado» no se dice en palabras. El F mide 42 pm y el libro del lector, unos 64 (radio covalente). Bruna dice «Compara cada círculo con el de arriba», pero los círculos van en fila, y Lee 4 dice «de arriba abajo». | Lee 3: calculado desde la nube del átomo solo; otros libros traen radios medidos en enlaces, algo mayores, con las mismas tendencias. Voz: «con el de su izquierda». |
| M2 | 3, 12 | Juego y regla de la idea 2 | Para el lector, «radios de dos tablas distintas» no dice qué se puede comparar («¿puedo restar 190 − 102?»). Leyó tres veces la condición. «r (catión) < r (átomo) < r (anión)» se lee como que todo catión es menor que todo anión. | La leyenda dice «compara solo cuál es mayor». La condición: con números, solo entre iones; un átomo y su ion, solo cuál es mayor. La llave: «de un mismo elemento». |
| M3 | 3, 12 | Regla de la idea 3 | «Baja al estrenar el p y al aparear el p» es jerga, y la AE sale sin ejemplo ni signo. | «Baja si sale el primer electrón p (Be → B) o uno apareado (N → O)». La llave de la AE lleva el Cl con −349 kJ/mol. |
| M4 | 13 | Voz de «Ahora tú» de la idea 3 | «La flecha orienta; el dato decide», pero los Datos de los pares no traen ninguna EI (lector). | «Ubica los dos; si son vecinos de fila, mira su configuración». |
| M5 | 13 | Idea 2, «Ahora tú» tipo 4 (V/F de iones) | Los datos dan siempre los protones del Cl, el Ar, el K y el Ca, pero las afirmaciones usan el S²⁻, el Br⁻ y el Na. En 35 de 40 casos falta un dato. | Datos armados con los protones de cada elemento que nombran las tres afirmaciones. |
| M6 | 10 (afirmación general falsa) | `aprendizaje` de la idea 3, ejemplo «La bajada del boro» | «Con dos bajadas por periodo» y «Es la primera de las dos bajadas de cada periodo» valen en los periodos 2 y 3 (y en el 4 entre los grupos A). En el 5 y el 6 no hay ninguna entre los grupos A (Sr 550 < In 558, Sb 834 < Te 869, NIST). La unidad no los muestra, pero lo afirma. | «con bajadas como Be–B y N–O»; «Es la primera bajada del periodo 2; la otra es la del oxígeno». |
| M7 | 10 | Idea 4, «Ahora tú» `casoMetal` (par Ca–Ga) y práctica `metalico` | Los datos dicen «Carácter metálico: qué tan fácil pierde electrones» y la unidad trae las EI: Ga 579 < Ca 590. Al responder «el calcio, más a la izquierda», el alumno que mira la EI de la idea 3 ve lo contrario. | Cambiar el par por Ca–Br. Prueba contra las EI. |
| M8 | 12 | Idea 4 (título «Electronegatividad y carácter metálico») | El carácter metálico sale en una frase de la regla y lo pide el ejemplo 14 (lector). «El par» sale en el juego sin decir que es un par de electrones. Los gases nobles quedan sin barra sin decir por qué. | La regla dice qué es y hacia dónde crece. La leyenda trae «par» y «sin barra». La lectura y la consigna dicen «el par de electrones». |
| M9 | 3, 4f (glosario que da la clave) | Glosario «carga nuclear» (idea 1) | El `simple` («La atracción del núcleo, que crece con sus protones») es la razón de la opción correcta de Predice («el núcleo, con más protones, jala más fuerte»). | «La carga positiva del núcleo: una por cada protón». |
| M10 | Molde §3 (figura y datos que muestran la respuesta) | Ejemplos «El periodo 3 entero» (nivel 3), «Un elemento del grupo 2» (nivel 3), «Las cuatro tendencias del periodo 4» (nivel 3) | En «El periodo 3 entero», las barras y los Datos traen las 8 EI: la respuesta A se ve antes del resuelto, y «1012» y «1000» se pisan. «Un elemento del grupo 2» le pone a X «194 pm», que no sale de ningún dato (es el Ca). «Las cuatro tendencias» trae el Ca, que no se usa, y «K 0,82 → Br 2,96» sin decir que son EN. | Sin barras ni EI en Datos: la fila y qué subnivel se llena. En los otros dos: X sin número, sin el Ca, «EN:» y la definición del carácter metálico. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 13 | `casoElectrones`, QM-ION-UNO con carga 1 | Con el Na⁺ da 9 y dice «la carga dice cuántos: cuenta todos». El 9 sale de quitar dos. | Con carga 1, QM-ION-DOBLE (z − 2q): «cambia un solo electrón, no dos». |
| B2 | 13 | `casoSucesivas`, QM-SALTO-ANTES con el salto tras la primera (Li, K) | La opción es «Grupo 18» y dice «cuenta todos los electrones que salen antes». | No sale cuando el salto es tras la primera. |
| B3 | 5 | Resuelto de `casoSucesivas` y de «Así se resuelve» | «16091 ÷ 4356» con la pregunta en «16 091». | Separador de miles también en el resuelto. |
| B4 | 7 | Ejemplo «Tres cationes del neón» | El título hace creer que son iones del neón; «53,5 pm» queda suelto en otro renglón (lector). | «Tres cationes con 10 electrones»; «en pm» en el texto. |
| B5 | 9 | Ejemplo «El anión de un halógeno» | «Los mismos 35 protones jalan uno más» (lector). | «jalan un electrón más». |
| B6 | Molde §7 | `papel.json` de `propiedades-tabla` | p3 y p8 son el mismo problema (C > B > Al) con los nombres en otro orden. | Queda: es de `papel-generador.js` (compartida). Ver la propuesta en el informe de Tabla periódica. |

## Lo que está bien y hay que copiar al molde

- **Cada valor con su tabla y su fuente**, en la cabecera de la unidad y del generador, y una sola escala por propiedad. Las
  cinco tablas cuadran con la fuente, valor por valor.
- **«Dos tablas distintas»** (decisión 25): radios de átomos e iones que no se restan entre sí. Es una regla buena para
  cualquier dato de dos fuentes; con la corrección, el texto dice qué se puede comparar.
- **La predicción medida** (P–S, Tan y otros 2005), con la razón de academia («semilleno es estable») nombrada sin castigarla.
- **La EN siempre con dos decimales** (decisión 27) y ΔEN con su dato «el mayor menos el menor».
- **Tríos «pivote, el de abajo, el de la derecha»** que la regla ordena sin mirar los números. Los de «Así se resuelve» y los
  de «Ahora tú» van en listas separadas.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una opción que es una regla general («el de mayor carga», «el de más protones») no puede elegir a la correcta en ningún caso** (A1). | Parcial: la unidad declara qué elige esa opción; la prueba la evalúa en 400 semillas. Esta unidad ya la prueba. |
| **Cada escena de «Mira» se dibuja con la vista que dicen sus pasos**: una escena sin `vista` no cae en la vista por omisión (A2). | Sí: en la prueba común de piezas, comparar la vista de cada escena con la de `datos`, o que `quim-tira` herede la vista y avise. |
| **Una tendencia escrita («dos bajadas por periodo», «crece hacia…», «más metálico») se comprueba contra la tabla de datos de la unidad** en todos los pares que el generador puede sacar (M6, M7). | Sí, si la unidad declara sus tablas y la dirección de cada tendencia. |
| **Los datos de un V/F traen lo que usan sus tres afirmaciones** (M5). | Parcial: con símbolos de elemento, sí (los que nombra la afirmación tienen su línea). |
| **Una voz o una consigna que nombra un dato («el dato decide») tiene ese dato en el recuadro** (M4). | Parcial: búsqueda de frases. |
| **Una figura de ejemplo no repite los valores que los Datos ya dan, y dos rótulos no se pisan** (M10). | Lo segundo sí (`geometria` de la pieza); lo primero lo ve el auditor. |

## Correcciones (19 nov)

Fase 8 del método, junto con las notas del lector en frío (ver `rutinas/frio/quimica.propiedades-periodicas.md`,
«Correcciones de la ronda 1»). La teoría pasa a v0.2.1. Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-qui/antes/`. Capturas de después en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-qui/despues-pp/`.

Las pruebas nuevas van al final de `propiedades-periodicas.test.js` (6) y de `plantillas/propiedades-tabla/generador.test.js`
(1). Las 7 fallan con los archivos de antes (comprobado en `.../e5-cierre-qui/viejo/`). Después:
- unidad 14 de 14, `quim-tabla` 5 de 5, generador 8 de 8;
- validador con `calidad: 2` simulada: 0 problemas;
- `cuentas.js` sin fallas;
- `ecuaciones-ancho.js`: «todo cabe»;
- `teoria.test.js`: esta unidad en verde;
- el papel, al día (no cambió).

`casos.json` no cambió: ninguno de sus 18 casos caía en lo corregido.

| # | Qué se hizo |
|---|---|
| A1 | `casoParIso` cambia «El de mayor carga…» por «No se puede saber sin la tabla de radios» (QM-SIN-LEY). En `iso-par` se quitó el error QM-ION-CARGA (quedan tres). Pruebas en la teoría y en el generador: ninguna opción dice «mayor carga». |
| A2 | Las cuatro escenas de Mira 2 llevan `vista: 'esferas'` y `max: 250`; la primera (desde 0) es el Na y el Na⁺. Prueba: cada paso dibuja `kit-esfera`. Captura `despues-pp/claro-cel-radio-ionico-4-mira.png`. |
| M1 | Lee 3: «Aquí son calculados desde la nube de electrones del átomo solo. Otros libros traen radios medidos en enlaces, algo mayores (el flúor, unos 64 pm), con las mismas tendencias». Lee 4 y la voz: los círculos van en fila, «compara cada círculo con el de su izquierda». La leyenda: «radio del átomo, calculado desde su nube». Prueba. |
| M2 | Lee 2, leyenda («dos tablas: compara solo cuál es mayor»), condición de la regla («los radios iónicos se comparan con números solo entre iones; un átomo y su ion, solo en cuál es mayor») y llave «de un mismo elemento»; el texto dice «menor que el átomo del que sale». Prueba. |
| M3 | Regla: «La EI sube a la derecha y arriba; baja si sale el primer electrón p (Be → B) o uno apareado (N → O). El salto de las sucesivas da el grupo». La llave de la AE: «Cl(g) + e⁻ → Cl⁻(g)», con «AE = −349 kJ/mol: libera». Sin «estrenar» ni «aparear» en la unidad (también Mira 3, misión, `siFuera`, laboratorio y el generador). Prueba. |
| M4 | Voz: «Ubica los dos; si son vecinos de fila, mira su configuración». La prueba exige el dato si la voz vuelve a decir «el dato decide». |
| M5 | El V/F arma su línea de protones con los elementos que nombran sus afirmaciones. Prueba en 400 semillas. |
| M6 | El aprendizaje dice «con bajadas como Be–B y N–O»; el ejemplo, «Es la primera bajada del periodo 2; la otra es la del oxígeno». Prueba: ningún texto dice «dos bajadas por periodo» ni «de cada periodo». |
| M7 | El par Ca–Ga pasa a Ca–Br en la teoría y en la práctica. Pruebas: el más metálico tiene la EI menor (NIST, escrita en la prueba). |
| M8 | La regla de la idea 4 suma «carácter metálico (qué tan fácil pierde electrones): crece hacia abajo y a la izquierda». La leyenda trae «par» y «sin barra»; la consigna, la lectura y la misión dicen «par de electrones». Prueba. |
| M9 | «carga nuclear», simple: «La carga positiva del núcleo: una por cada protón». Prueba. |
| M10 | «El periodo 3 entero»: sin figura; los Datos dan la fila y qué se llena (3s en Na y Mg, 3p del Al al Ar), y el resuelto, las dos bajadas con su razón y sus valores. «Un elemento del grupo 2»: r (X) > r (Mg) y r (X) > r (Br), sin número. «Las cuatro tendencias»: sin el Ca, con la definición del carácter metálico y «EN: K 0,82 → Br 2,96»; la A y la D se explican una por una. Prueba. |
| B1–B5 | B1: QM-ION-DOBLE con carga 1. B2: sin «Grupo 18» por QM-SALTO-ANTES (prueba). B3: `miles` en los dos resueltos. B4: título «Tres cationes con 10 electrones» y «en pm» en el texto. B5: «jalan un electrón más». |
| B6 | No se tocó (herramienta compartida). |

### Pendiente

- **Herramienta compartida:** el papel repetido (B6) y el papel por idea, en `herramientas/papel-generador.js`.
- **Para Gerson:** los objetos de prueba (la romana, la soga, el salero, el grano de sal) y la tabla de radios calculados.
  Si prefiere los radios covalentes de los libros del colegio, hay que cambiar la tabla de las dos unidades y de
  `atomo-y-tabla`. Recomiendo quedarse con Clementi: es una sola escala que incluye a los gases nobles, y ahora Lee la
  explica.
