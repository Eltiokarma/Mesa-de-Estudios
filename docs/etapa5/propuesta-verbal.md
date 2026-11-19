# Propuesta: «Definiciones» (`razonamiento-verbal.definiciones`)

19 nov 2026 · Etapa 5 del plan de calidad · Primera unidad de la rama «Palabras» (le siguen Analogías y Sentido
contextual). Formato: `docs/metodo/unidad/1-ideas.md` §A; modelo: `docs/etapa2/propuesta-verbal.md`. Gerson delegó el
criterio: la última sección no pregunta, dice qué se decidió y qué se descartó. La idea 1 ya está escrita con esta
propuesta como guion (`contenido/teoria/razonamiento-verbal/definiciones.js`, versión 0.3.0). **Fase 3 a 5 (19 nov):** las cinco ideas están escritas (versión 0.4.0) y la práctica tiene generador propio (`plantillas/definiciones/`); lo que cambió respecto de este guion está en la sección 11.

Leído: CLAUDE.md, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/`, las decisiones de las
etapas 2, 3 y 4, la unidad modelo del curso (`tema-e-idea-principal.js`, sus piezas, su prueba, su auditoría y su lector
en frío), la teoría actual de Definiciones, su ficha del catálogo, la matriz (`docs/teoria/matriz/razonamiento-verbal.json`),
el temario, el informe de códigos RV, `rutinas/teoria-razonamiento-verbal.md` (códigos RVD), los tres ejercicios sueltos
que hoy lleva la unidad (e004 a e006) y las 690 preguntas de verbal de San Marcos (`docs/datos/admision-unmsm.csv`).
Las ideas de Analogías y de Sentido contextual, para no pisarlas.

**Lo que pregunta la admisión, en corto.**
- **UNI.** «Definiciones» es un tipo de pregunta propio de su prueba de aptitud y ocupa las semanas 0 y 1 del sílabo
  CEPRE-UNI 2026-2 (así está en el catálogo). La pregunta da una definición de diccionario y cinco palabras del mismo
  campo, y pide la palabra que se ajusta a ella. **Esto último lo digo de memoria del formato del examen: en el repo no
  hay ningún examen de la UNI de verbal (`fuentes/examenes` está vacío); va como hipótesis hasta tener un PDF.**
- **San Marcos.** 0 de 690 preguntas son de definiciones sueltas (`docs/clasificacion-unmsm-admision.md`, punto 5: desde
  2019 verbal es solo lectura). La definición aparece **dentro de la lectura**, en cuatro preguntas que la clasificación
  puso en otras unidades, y sus trampas son de esta unidad:
  - 2019-I, «definición clínica de una enfermedad descrita en el texto»: trampa, definir por un dato numérico o
    histórico y no por su rasgo;
  - 2026-I, «sentido de un término técnico»: trampa, definiciones con absolutos («solo») o que confunden la clase
    (sistema por teoría);
  - 2019-I, «texto que define un enfoque»: trampa, confundir la definición con un elogio;
  - 2023-I, «a qué postura se acercaría una definición nueva».
- **UNA Puno, UNSA y UNSAAC:** sin material todavía.
- **Trampas que se repiten** (de la matriz, del informe y del formato de la UNI): la palabra más general, que cumple la
  clase y nada más; el vecino de la misma clase con otro rasgo; la palabra más específica, que agrega un rasgo; la
  palabra del mismo tema pero de otra clase; el rasgo frecuente tomado por necesario; el ejemplo en lugar de la
  definición (RV56).

---

## 0. Diagnóstico de la teoría actual contra el contrato

1. **Faltan los campos del contrato:** sin `calidad: 2`, sin pestaña de Ejemplos, sin `mision`, `leyenda`,
   `aprendizaje`, `actividad` ni `pregunta`; el glosario no trae `simple` ni 3 ejemplos; ningún ejercicio trae `datos`.
2. **Punto 1: la primera pantalla es una tarjeta con huecos y una lista de casos**, sin soporte: no se sabe quién
   define «silla», para quién ni para qué. Nada muestra por qué importa definir.
3. **Punto 2: el juego no tiene meta.** «Elige la clase y el rasgo. Mira qué casos entran» describe los botones.
4. **Punto 5, colores.** El género va en verde y la diferencia en naranja: juntos dan 0,011 en protanopía (molde §5b).
   Lo mal clasificado va en carmín, que es de ángulos. Ninguno es la paleta de lectura del curso (idea violeta,
   evidencia turquesa, distractor naranja).
5. **Punto 6:** «vecino», «se cuela» y «mal ubicado» no se presentan antes del juego.
6. **Punto 13:** la predicción y los seis casos de «Ahora tú» no dan ningún dato; el alumno tiene que saber de memoria
   que una banca tiene respaldo o qué es un cronómetro.
7. **La dirección es la contraria a la del examen.** Las dos ideas piden elegir la definición de una palabra; la UNI da
   la definición y pide la palabra. No hay ninguna pregunta con cinco alternativas ni nada con forma de examen.
8. **La correcta se delata.** En los seis casos de `BANCO_DEF` la correcta es la opción más larga y la única con las dos
   piezas; el distractor RV56 («Como la que uso para ir al colegio») se descarta sin pensar. En el Predice de la idea 1
   pasa lo mismo.
9. **Códigos repetidos:** en el Predice de la idea 1 hay dos incorrectas con RVD2. RVD1 a RVD4 no están en el informe
   ni en `codigos.json`.
10. **La fuente de la historia no es la que dice:** el título es «Matriz de teoría…» y el enlace lleva al diccionario
    del CVC, en la entrada de comprensión lectora (misma falla que B8 de la unidad modelo).
11. **Práctica:** la unidad solo tiene tres ejercicios de término excluido, puestos aquí «provisionalmente»
    (`rutinas/verbal.md`). Ninguno pide definir ni reconocer una definición.

Se queda: los dos `id` de idea (`genero-diferencia`, `rasgo-necesario`), el hilo «una definición buena deja fuera a los
parecidos» (temario), el caso del ave que no vuela y las mesas del laboratorio como mesas (sin calificar).

---

## 1. Las ideas en orden

Son cinco. Los ids `genero-diferencia` y `rasgo-necesario` se quedan, porque guardan el avance. Tres son nuevas.

| # | id | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) | Por qué va ahí | Qué da por sabido |
| --- | --- | --- | --- | --- | --- |
| 1 | `genero-diferencia` | **Clase y rasgo que separa** | Una definición dice la clase de la cosa y el rasgo que la separa de sus vecinos; si un vecino entra, es muy amplia. | Es la forma de toda definición de diccionario; sin ella no se puede leer la del examen. | Leer una frase. Nada de la unidad. |
| 2 | `rasgo-necesario` | **Necesario, no solo frecuente** | El rasgo de una definición está en todos los casos; si deja fuera uno, es muy estrecha. Un ejemplo no define. | Es la falla contraria a la de la idea 1; juntas dan la medida justa. | Clase, rasgo y «muy amplia». |
| 3 | `definicion-a-palabra` (nueva) | **De la definición a la palabra** | Para hallar la palabra, primero la clase y después cada rasgo: la más general no los tiene todos y la más específica agrega uno. | Es la pregunta de la UNI. Necesita la medida de las ideas 1 y 2. | Las ideas 1 y 2. |
| 4 | `definicion-defectuosa` (nueva) | **Cuando la definición no define** | Una definición falla si repite la palabra, si solo dice lo que no es o si compara en vez de dar clase y rasgo. | Cierra las fallas que no son de medida; prepara las alternativas de la idea 5. | Las ideas 1 y 2. |
| 5 | `definicion-en-texto` (nueva) | **La definición dentro del texto** | Si un texto define un término, la respuesta conserva su clase y su rasgo; un dato, un ejemplo o un «solo» no lo definen. | Es como llega la definición en San Marcos: dentro de la lectura. | Las ideas 1, 2 y 4. |

`pregunta` de cada idea, para el Resumen:
1. «¿Qué dos piezas tiene una definición?»
2. «¿Sirve para definir un rasgo que casi todos tienen?»
3. «¿Cómo se pasa de una definición a su palabra?»
4. «¿Cuándo una frase parece definición y no lo es?»
5. «¿Dónde define un texto la palabra que usa?»

`actividad` de cada idea (≤ 16 palabras):
1. «Armar la definición de «mototaxi» y ver qué vehículos del paradero entran.»
2. «Probar un rasgo para «ave» en la lámina de las aves del lago.»
3. «Tachar palabras en una hoja de simulacro hasta dejar la que se define.»
4. «Revisar las definiciones del glosario de un compañero y marcar la que sí define.»
5. «Subrayar en un folleto la oración que define y tachar las que solo dan datos.»

**Límites con las unidades vecinas** (para no adelantarles contenido):
- **Analogías** se queda con las relaciones entre dos palabras (sinónimo, antónimo, género y especie como relación,
  parte y todo, causa). Aquí «clase» y «vecino» se usan solo para armar o revisar una definición; no se pide reconocer
  una relación en un par ni se enseñan sinónimos y antónimos. «Hiperónimo» e «hipónimo» no se nombran: se dice «la más
  general» y «la más específica».
- **Sentido contextual** se queda con la acepción que elige la oración, la connotación, la precisión léxica y el
  significado que se infiere de pistas. Aquí la palabra tiene una sola acepción y, en la idea 5, el texto la define con
  todas sus letras («se llama», «es», «consiste en»); si hay que deducirla de pistas, es de la otra unidad.

---

## 2. La primera pantalla de cada idea

En verbal el objeto reconocible es el texto en su soporte, con quién lo escribe y para quién (contrato, punto 1). En
esta unidad el soporte muestra además **para qué sirve definir**: alguien necesita la definición para decidir un caso.

### Idea 1 · Clase y rasgo que separa

**Soporte:** un cartel de la municipalidad en un paradero de Juliaca, la ficha de la definición (dibujada como una
entrada de diccionario) y la tabla de los siete vehículos del paradero. Pieza nueva `rv-definicion` (objeto de prueba).

> **Comunicado.** De: la Municipalidad · Para: conductores del paradero
> ① Desde el 1 de diciembre, todo mototaxi llevará su número pintado atrás.
>
> **Ficha: mototaxi.** Clase: [vehículo · vehículo de tres ruedas] · Rasgo: [con motor] · Rasgo: [que lleva pasajeros]
>
> | Vehículo | Ruedas | Motor | Lleva |
> | --- | --- | --- | --- |
> | tricitaxi a pedal | 3 | no | pasajeros |
> | mototaxi abierto | 3 | sí | pasajeros |
> | combi | 4 | sí | pasajeros |
> | motocarga | 3 | sí | carga |
> | mototaxi cerrado | 3 | sí | pasajeros |
> | triciclo de carga | 3 | no | carga |
> | camioneta | 4 | sí | carga |

Cada pieza de la definición deja fuera a un vecino distinto: la clase cercana, a la combi y a la camioneta; «con
motor», al tricitaxi; «que lleva pasajeros», a la motocarga. Son siete vehículos y no seis porque, sin el triciclo de
carga, en la ficha de «motocarga» de la predicción «con motor» no dejaba fuera a nadie (lo encontró el script de
revisión). El cartel y su regla son inventados para el ejercicio (no
citan ninguna ordenanza real); los rasgos de cada vehículo son los que cualquiera ve en un paradero.

**Consigna** (≤ 25): «La municipalidad pide que todo mototaxi pinte su número. Falta decir qué es un mototaxi, para
saber a quién le toca.»

**Lee** (4 tarjetas): el cartel y por qué necesita una definición (con su dibujo); la clase responde «¿qué es?»; los
vecinos y «se cuela», con una ficha chica de tres instrumentos donde se ven los tres colores; qué mirar al jugar. No
dice qué pieza deja fuera a quién: eso lo descubre el juego.

### Idea 2 · Necesario, no solo frecuente

**Soporte:** una lámina de la feria de ciencias del colegio, «Aves del lago Titicaca», con su ficha: «Ave: animal
que…». Casos: zambullidor del Titicaca (ave que no vuela; real, con fuente), gaviota andina, parihuana, suri (no vuela)
y, como vecinos, murciélago y rana gigante del Titicaca.

**Lee:** qué es un rasgo; «casi siempre» no es «siempre»; qué mirar.

### Idea 3 · De la definición a la palabra

**Soporte:** una hoja de simulacro con el rótulo «Definiciones», una definición con la palabra en blanco y cinco
palabras A–E, como en la UNI.

> ________: Vasija de barro, de boca ancha, que sirve para cocinar.
> A) recipiente · B) cántaro · C) olla · D) cocina · E) olla de presión

**Lee:** así llega la pregunta en el examen; la definición empieza por la clase y esa primera palabra ya descarta (si
empieza con un verbo, define un verbo; con «persona que…», a una persona).

### Idea 4 · Cuando la definición no define

**Soporte:** el cuaderno de un compañero, con el glosario que copió para la práctica de Ciencia y Tecnología, y un lápiz
para corregirlo: «Sequía: cuando hay sequía en los campos», «Reptil: animal que no es mamífero ni ave», «El cóndor es el
rey de los Andes», y una que sí define.

### Idea 5 · La definición dentro del texto

**Soporte:** un folleto del puesto de salud sobre el soroche (o de SENAMHI sobre la helada), con cuatro o cinco
oraciones: una define el término, otra da un dato con número, otra un ejemplo y otra un consejo. Debajo, la pregunta
del simulacro: «En el texto, el término *helada* se entiende como».

---

## 3. La misión de «Juega» y lo que hay que construir

Cada misión cabe en 16 palabras, la comprueba el motor con `logrado(val)` y no está cumplida al abrir. La lectura en
vivo (≤ 12 palabras) dice la relación del caso actual.

| Idea | Controles (gesto) | Misión | `logrado` | Lectura en vivo (ejemplos) |
| --- | --- | --- | --- | --- |
| 1 | `g` clase (2), `m` con motor (sí/no), `p` lleva pasajeros (sí/no); se tocan en la ficha | «Arma la definición que deje entrar a los 2 mototaxis y a ningún otro vehículo.» | clase cercana y los dos rasgos | «Muy amplia: se cuelan 5 vehículos que no son mototaxi» · «Muy amplia: se cuela la combi» · «Justa: entran los 2 mototaxis y nadie más» |
| 2 | `r`: rasgo de «ave» (vuela · tiene pico · pone huevos · tiene plumas) | «Busca el rasgo que deje dentro a las 4 aves y fuera a los otros 2.» | `r === 'plumas'` | «Muy estrecha: quedan fuera 2 aves que no vuelan» · «Muy amplia: se cuela la rana» · «Justa: las 4 aves y nadie más» |
| 3 | Cinco interruptores, uno por palabra (tocar = tachar) | «Tacha las palabras que no se ajustan a la definición hasta dejar una.» | tachadas las 4 incorrectas | «Recipiente: cumple la clase, pero no dice barro ni cocinar» · «Olla de presión: agrega un rasgo» · «Cocina: es otra clase» |
| 4 | `d`: cuál de las 4 entradas del cuaderno se revisa; `f`: falla que se le pone (repite · niega · compara · ninguna) | «Ponle a cada entrada su falla; una no tiene ninguna.» | las 4 bien puestas | «Repite la palabra: no dice nada nuevo» · «Dice lo que no es: entra el pez» |
| 5 | Resaltador y lápiz sobre las oraciones (como en Tema e idea, idea 3) | «Subraya la oración que define y tacha la que solo da un dato.» | subrayada la que define, tachado el dato | «La 3 da un número: no dice qué es» · «La 2 dice clase y rasgo» |

**Riesgo conocido: probar a ciegas** (8, 4, 32, 256 y 30 combinaciones). No se tapa con bloqueos (la regla 3 solo
bloquea la predicción): la lectura de cada toque dice por qué falla ese caso.

### Piezas (se agregan; las de hoy no cambian su comportamiento)

- **D1. `rv-definicion` (hecha, objeto de prueba):** el soporte de `rv-soporte` arriba, una ficha de definición con
  aspecto de entrada de diccionario (palabra, una fila «Clase» y filas «Rasgo», tocables con `data-toque`) y una tabla
  de casos con anchos por columna. Marca cada caso como «entra» (turquesa, continuo), «se cuela» (naranja, a trazos) o
  «fuera» (gris). Prueba numérica de encuadre.
- **D2. Soporte `diccionario` en `rv-soporte` (hecho, objeto de prueba):** una página de diccionario escolar con lomo y
  uñeros; cada entrada es una oración numerada. Lo usan «Ahora tú» y los ejemplos.
- **D3.** Para la idea 2, una ilustración chica por ave (objetos de prueba) solo si el lector en frío no reconoce los
  nombres; primero se prueba con la tabla de rasgos.
- **D4.** Las ideas 3 y 5 no piden piezas nuevas: usan la hoja de simulacro con toques y el cuaderno con bandeja de
  `rv-soporte`.

---

## 4. La predicción de cada idea

Opciones sin justificación; dos incorrectas de una misma predicción nunca comparten código; la correcta no es ni la más
larga ni la más corta. La app las baraja, salvo cuando las letras están en la hoja (`orden: 'fijo'`).

### Idea 1

**Pregunta:** «El paradero necesita otra ficha: la de «motocarga». ¿Qué definición deja entrar solo a la motocarga de la
tabla?» (La misma tabla del juego.)

| Opción | Código | `siFuera` (empieza por lo que hizo bien) |
| --- | --- | --- |
| **Vehículo de tres ruedas, con motor, que lleva carga** | correcta | — |
| Vehículo de tres ruedas, con motor | RVD2 (falta un rasgo) | «La clase y el motor están bien, pero también entran los dos mototaxis: falta un rasgo.» |
| Vehículo con motor, que lleva carga | RVD6 (clase lejana) | «Los dos rasgos están bien, pero con esa clase tan amplia también entra la camioneta.» |
| Vehículo de tres ruedas, con motor, que lleva pasajeros | RVD7 (define al vecino) | «Tiene clase y dos rasgos, pero es la definición del mototaxi: la motocarga queda fuera.» |

- **Datos:** ninguno (todo está en la tabla).
- **Es algo que el juego no mostró:** allí las piezas venían sueltas y solo se podía pecar de amplio; aquí hay que
  reconocer la definición entera de otra palabra, y aparece la definición del vecino, que tiene las dos piezas y falla.
- **Coincide:** «La clase deja fuera a la camioneta; «con motor», al triciclo de carga; «que lleva carga», a los mototaxis.»

### Idea 2

**Pregunta:** «Todas las aves de la lámina ponen huevos. Si la ficha dijera «animal que pone huevos», ¿qué pasaría?»

| Opción | Código |
| --- | --- |
| **Entran las cuatro aves, y también la rana** | correcta |
| Entran justo las cuatro aves | RVD3 (necesario tomado por suficiente) |
| Quedan fuera el zambullidor y el suri | RVD1 (lo confunde con «vuela») |
| Entran los seis animales de la lámina | RVD2 (cree que el murciélago pone huevos) |

- **Datos:** «El murciélago es un mamífero: sus crías nacen vivas.» «La rana pone huevos en el agua.» (valores, no la regla).
- **Nuevo frente al juego:** en el juego los rasgos fallaban por dejar aves fuera; este no deja ninguna fuera y aun así falla.

### Idea 3

**Pregunta** (otra hoja, letras fijas): «________: Persona que cría y cuida ganado.» A) trabajador · B) agricultor ·
C) ganadero · D) pastor de alpacas · E) ganado. Correcta C (en el juego la correcta es otra letra).

| Opción | Código |
| --- | --- |
| trabajador | RVD9 (la más general: cumple solo la clase) |
| agricultor | RVD7 (vecino: cultiva la tierra) |
| pastor de alpacas | RVD10 (la más específica: agrega «alpacas») |
| ganado | RVD11 (mismo tema, otra clase: no es una persona) |

- **Datos:** «Ganado: conjunto de animales que se crían, como vacas, ovejas o alpacas.»

### Idea 4

**Pregunta:** «Un compañero definió «pescador» así: «Persona que no trabaja en la chacra». ¿Qué le pasa a esa
definición?» Correcta: «Dice lo que no es: también entra un profesor». Distractores: «Está bien: tiene clase y rasgo»
(RVD13, acepta la negación como rasgo), «Repite la palabra que define» (RVD12 mal aplicado), «Le falta un ejemplo»
(RV56).

### Idea 5

**Pregunta** (folleto del puesto de salud, cinco oraciones): «En el texto, el término *soroche* se entiende como».
Correcta: el malestar que causa la falta de oxígeno en la altura. Distractores: el dato con número («lo que sienten 3
de cada 10 visitantes», RVD14, inventado y con su nota), el ejemplo («el dolor de cabeza de un turista al llegar a
Puno», RV56), el absoluto («una enfermedad que solo afecta a los turistas», RV11), la clase cambiada («un remedio para
la altura», RVD6).

---

## 5. Qué es «dato» en esta unidad y qué no se da

**Entra en `datos`** (una línea por dato, ≤ 22 palabras): el criterio que se aplica y las palabras poco comunes.

| Tipo | Línea |
| --- | --- |
| Criterio (idea 1) | «Definición: dice la clase de la cosa y el rasgo que la separa de sus vecinos.» |
| Criterio (idea 1) | «Muy amplia: la definición deja entrar a un vecino, que no es la cosa.» |
| Términos (idea 1) | «Vecino: cosa parecida, de la misma clase, que no es lo que se define.» · «Clase más cercana: la más chica que contiene a todos los casos.» |
| Nombres del examen | «Género próximo: la clase más cercana. Diferencia específica: el rasgo que separa.» |
| Criterio (idea 2) | «Muy estrecha: la definición deja fuera un caso que sí es la cosa.» |
| Criterio (idea 3) | «La palabra se ajusta si cumple la clase y todos los rasgos de la definición, y ninguno más.» |
| Palabra poco común | «Imantada: que atrae al hierro, como un imán.» |
| Dato del mundo | Real y con `fuente` (el zambullidor del Titicaca no vuela; la helada, 0 °C o menos). Lo inventado, con su nota. |

**No se da** (sería el paso hecho, el atajo o el consejo):
- **Qué vecino se cuela** ni cuál es la clase de la palabra que se pregunta.
- **Atajos:** «la correcta es la definición más larga», «descarta la que empieza con *lo que*», «la más general nunca es».
- **En «Predice», tampoco el criterio de la idea que se está por aprender:** solo glosas y valores (que el murciélago es
  mamífero), y desde la idea 2 los criterios de las ideas anteriores.

---

## 6. Colores y símbolos

### Paleta de lectura (la del curso, con papel fijo en todo verbal; molde §11 y `docs/etapa2/decisiones.md`)

| Papel en esta unidad | Token | Trazo | Cuándo se ve |
| --- | --- | --- | --- |
| El caso que entra en la definición y sí es la cosa; en un resuelto, las palabras que lo sostienen (evidencia) | `i` turquesa | continuo | En el juego, en «Mira» y en la solución |
| La definición o la alternativa que se prueba o se descarta, y el vecino que se cuela (el distractor) | `o` naranja | a trazos | Mientras se prueba y en el resuelto |
| La definición justa, la palabra que se define, la respuesta | `f` violeta | punteado | Solo con la misión cumplida, en «revelar», en el último paso de «Mira» y en la respuesta |
| Lo que queda fuera | gris (tenue) | — | Siempre |

- **«Clase» y «rasgo» no llevan color:** son las dos piezas de la definición y se distinguen por su rótulo y su lugar en
  la ficha, y en la regla por su llave con nota. Gastar turquesa en una y naranja en la otra habría cambiado el papel
  que esos colores tienen en todo el curso.
- **Sin verde ni carmín.** El verde junto al naranja da 0,011 en protanopía y el carmín es de ángulos. La idea 2 vieja
  (verde, naranja y carmín) queda así solo hasta la fase 3.
- Pares que van juntos, ya medidos en el molde §5b y en la propuesta de la etapa 2: naranja–turquesa 0,114;
  naranja–violeta 0,189; turquesa–violeta 0,101. Además, cada papel tiene su trazo (WCAG 1.4.1).
- La letra de una alternativa va en negrita: naranja si se descarta y violeta si es la correcta (`mala`, `buena`).

### Símbolos (en lugar de la tabla de letras)

| Símbolo | Qué es | Leyenda (≤ 8 palabras) |
| --- | --- | --- |
| Clase | primera pieza de la ficha | «el grupo: responde «¿qué es?»» |
| Rasgo | las demás piezas | «lo que lo separa de sus vecinos» |
| 1, 2, 3 | número de cada oración o entrada | «número de cada entrada» |
| A–E | alternativas de la hoja | «las alternativas de la pregunta» |
| turquesa / naranja / gris / violeta | entra · se cuela · fuera · justa | una línea por color, con su palabra |
| ________ | la palabra que falta en la hoja (idea 3) | «la palabra que se define» |

Una sola forma en toda la unidad: «muy amplia» y «muy estrecha», de la definición (en femenino); «se cuela», del vecino;
«entra» y «queda fuera», del caso. Las palabras citadas van entre «».

---

## 7. Ejemplos resueltos (15 por idea)

**Forma.** Figura: el texto en su soporte, sin marcas (cuaderno, mural, cartel, página de diccionario, hoja de
simulacro); en los de examen las alternativas A–E van en la hoja. Enunciado: la pregunta. `datos`: el criterio y las
glosas. Solución: de 1 a 4 líneas; lo que entra en turquesa, lo que se descarta en naranja, la respuesta en violeta.

| Nivel | Idea 1 | Qué lo hace subir |
| --- | --- | --- |
| 1 | Decir la clase y el rasgo de una definición dada; decir si un vecino entra; elegir la clase más cercana | Un paso: aplicar un criterio |
| 2 | Hallar el vecino que se cuela y el rasgo que lo deja fuera; arreglar una clase lejana; un rasgo que no separa | Dos pasos: probar y corregir |
| 3 | Hoja de simulacro: «¿qué alternativa define mejor…?» con cinco alternativas, cada una con su falla (sin rasgo, clase lejana, la del vecino, sin clase); «el género próximo es»; «¿cuál es muy amplia?» | Varios pasos; verbos y sustantivos abstractos; las cinco letras |

Las correctas de las cinco hojas de la idea 1 son A, C, E, B y D. Ideas 2 a 5: mismo reparto de niveles; el nivel 3 de
la idea 3 es la pregunta de la UNI y el de la idea 5, la de San Marcos con un texto de 5 o 6 oraciones.

**Cómo se recalcula en verbal** (lo que en física son las cuentas): un script aparte describe cada caso como un mundo
chico (los seres y sus rasgos) y cada alternativa como una condición, sin usar el código de la unidad; calcula qué
entra con cada alternativa y comprueba que solo una deja dentro justo lo que debe, que cada distractor falla por lo que
dice su explicación (el vecino que nombra de verdad se cuela) y que la correcta no es la más larga ni la más corta.

---

## 8. Práctica: qué existe y qué falta, por idea; datos del mundo

**Qué existe:** `lectura-verbal` trae tres ejercicios sueltos de término excluido (e004 instrumentos, e005 aves, e006
metales), puestos en esta unidad «de forma provisional». El papel de `lectura-verbal` no trae ninguno de definiciones.
La teoría tiene tres mesas de laboratorio (silla, un rasgo, dos rasgos).

| Idea | Qué hay | Qué falta |
| --- | --- | --- |
| 1 · Clase y rasgo | e004 a e006 (término excluido: hallar la clase común) | Tipo `definicion-elegir` (palabra → definición, 4 o 5 alternativas con RVD2, RVD6, RVD7 y RVD8) y un previo `clase` («toca las palabras que dicen la clase»). Unos 10 ejercicios. |
| 2 · Necesario | e005 sirve (ave que no vuela) | Tipo `rasgo` («¿qué rasgo tienen todos y nadie más?») con RVD1, RVD3 y RV56. Unos 8. |
| 3 · De la definición a la palabra | nada | Tipo `definicion-palabra`, el de la UNI: definición y cinco palabras (RVD7, RVD9, RVD10, RVD11). Es el grueso: unos 20, con sustantivos, verbos y adjetivos, de dificultad 1 a 3. |
| 4 · Fallas | nada | Tipo `definicion-falla`: una definición y «¿qué le pasa?». Unos 6. |
| 5 · En el texto | t-textos de `sentido-contextual` cercanos, de otra unidad | 4 o 5 textos propios de 150 a 250 palabras con una pregunta «el término X se entiende como» y previo `marcar-oracion` (la que define). |
| Todas | — | Papel de la unidad (5 a 10 ítems, regla 6) con `herramientas/papel-lectura.js`; campo `idea` por ejercicio; revisión a ciegas de cada ejercicio. El término excluido se queda como práctica de la idea 1 hasta que haya unidad de series verbales. |

**Datos del mundo que se usan.** Con fuente: la helada meteorológica es temperatura del aire de 0 °C o menos (SENAMHI,
Atlas de heladas del Perú, 2010); el zambullidor del Titicaca no vuela (SERNANP, Reserva Nacional del Titicaca; lista
roja de la UICN, *Rollandia microptera*); el suri no vuela (SERFOR, Libro Rojo, 2018, ya citado en e005). De
conocimiento general, sin cifra: Taquile y Amantaní son islas y Capachica una península; el charango lleva cinco pares
de cuerdas; la quena se sopla por una muesca. Inventados y dichos como tales: el cartel de la municipalidad y su fecha,
los avisos del colegio. **Por confirmar antes de mostrarlo al alumno:** la historia de Plutón (UAI, resolución B5 de
2006) como historia de la unidad; hoy se queda la de Aristóteles con su fuente corregida.

---

## 9. Riesgos de orden (`requiere`)

- La unidad es raíz de la rama «Palabras»: `requiere: []` se queda. No usa nada de otra unidad.
- Dentro de la unidad: 2 necesita 1; 3 necesita 1 y 2; 4 necesita 1 y 2; 5 necesita 1, 2 y 4. Ningún ejemplo de la
  idea 1 usa «muy estrecha», «necesario» ni el ejemplo como falla (son de la idea 2), ni pide hallar la palabra desde
  la definición (idea 3).
- Analogías y Sentido contextual piden esta unidad y usan «rasgo», «género y especie» y «sinónimo»: el glosario
  conserva los ocho términos de hoy para no dejar referencias rotas.
- El catálogo lista tres temas (Género próximo, Diferencia específica, Rasgos mínimos de significado). Las ideas 3 a 5
  necesitan temas nuevos («Definición y palabra definida», «Defectos de la definición», «Definición en el texto»); se
  agregan al escribir esas ideas, porque una unidad «completa» tiene que cubrir todos sus temas.
- `grado: 3` es solo informativo; propongo `grado: 5` al cerrar, como en Razones trigonométricas.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas, con tres nuevas; la dirección del examen (definición → palabra) es idea propia (3).** Motivo: es lo
   único que pregunta la UNI y la unidad de hoy solo va de la palabra a la definición. Descartado: dejar las dos ideas
   de hoy y poner el formato del examen solo como nivel 3 de los ejemplos.
2. **El formato de la UNI va como hipótesis.** Motivo: no hay ningún examen de la UNI de verbal en el repo. Descartado:
   citar años o números de pregunta de memoria. Pendiente: un PDF en `fuentes/examenes` antes de escribir la idea 3.
3. **La definición dentro del texto entra aquí (idea 5).** Motivo: es la única forma en que San Marcos la pregunta, y
   sus trampas (el dato, el ejemplo, el «solo») son de esta unidad. Descartado: dejarla entera a Sentido contextual; el
   límite quedó escrito en el punto 1 (aquí el texto define de forma explícita; allá se infiere de pistas).
4. **El soporte de la idea 1 es un cartel de la municipalidad en un paradero de Juliaca, con mototaxis, triciclos y
   motocargas.** Motivo: muestra para qué sirve definir (a quién le toca la regla) con cosas que el alumno ve todos los
   días. Descartado: seguir con la silla, la banca y el taburete, que no tienen situación ni quién escribe.
5. **«Clase» y «rasgo» sin color; la paleta de lectura se usa tal cual** (entra en turquesa, se cuela en naranja, justa
   en violeta, fuera en gris). Motivo: un papel fijo por color en todo el curso. Descartado: género verde y diferencia
   naranja, como hoy.
6. **Códigos RVD como hipótesis de la unidad:** se quedan RVD1 a RVD3 y se agregan RVD6 (clase lejana), RVD7 (define al
   vecino), RVD8 (sin clase) y, para las ideas 3 a 5, RVD9 a RVD14. Motivo: cada distractor con un solo código y ningún
   par repetido en una pregunta. Descartado: renumerarlos ya como RV67 en adelante; se llevan al informe y a
   `codigos.json` junto con la práctica, en la fase 3.
7. **(Fase 2; ya no vale: las ideas 3 a 5 se escribieron en la fase 3.)** **Las ideas 3 a 5 todavía no están en el archivo.** Motivo: la app está publicada y un esqueleto con texto de
   relleno lo vería un alumno; además sus temas no existen aún en el catálogo. Quedan declaradas en la cabecera de la
   unidad y aquí. Descartado: escribir tres ideas de mentira que pasen el validador.
8. **(Fase 2; ya no vale: la idea 2 se rehízo en la fase 3.)** **La idea 2 sigue con su contenido viejo** (ave, pingüino, colores viejos) hasta la fase 3; solo cambió de lugar lo
   que compartía con la idea 1. La mesa «Arma la silla» del laboratorio conserva el juego viejo de la idea 1.
9. **El término excluido (e004 a e006) se queda en esta unidad, como práctica de la idea 1.** Motivo: es hallar la
   clase común. Descartado: abrir una unidad de series verbales, que ningún temario del catálogo pide.
10. **«Se cuela» se queda como palabra de la unidad**, presentada en «Lee» con su dibujo. Motivo: es corta y se
    entiende en todo el español. Descartado: «entra sin serlo» en cada lectura (no cabe en 12 palabras).
11. **15 ejemplos por idea también aquí** (75 en total), con el nivel 3 siempre en hoja de simulacro de cinco
    alternativas.
12. **La historia sigue siendo la de Aristóteles, con la fuente corregida** (Tópicos, libro VI, en el archivo de
    clásicos del MIT, que es la que cita la matriz). Descartado por ahora: Plutón y la definición de planeta, que es
    mejor gancho pero está «por verificar» en `docs/investigacion/historia-ganchos.md`.

---

## 11. Fase 3 a 5 (19 nov): lo que cambió al escribir las ideas 2 a 5 y la práctica

**Las cinco ideas, en una línea cada una (título · objeto · misión · predicción):**
1. Clase y rasgo que separa · cartel del paradero de Juliaca y tabla de 7 vehículos · armar la ficha de «mototaxi» sin que se cuele nadie · la ficha de «motocarga».
2. Necesario, no solo frecuente · lámina de la feria de ciencias con 4 aves del altiplano y 2 vecinos · el rasgo que deja entrar a las 4 aves y a nadie más · qué pasa con «animal que pone huevos» (entra la rana).
3. De la definición a la palabra · hoja de simulacro con una definición y cinco palabras · tachar hasta dejar la que se ajusta (olla) · la hoja de «persona que cría y cuida ganado».
4. Cuando la definición no define · el cuaderno de Mateo con cuatro entradas · tachar las que no definen · «Pescador: persona que no trabaja en la chacra».
5. La definición dentro del texto · folleto del puesto de salud del terminal de Puno sobre el soroche · tachar las oraciones que no dicen qué es · «En el folleto, el término «chuño» se entiende como».

**Formato de la UNI, como hipótesis.** La idea 3 y los tipos `palabra` y `palabra-examen` de la práctica usan el formato «definición sin su palabra y cinco palabras» como hipótesis de formato: así lo dicen el comentario de la idea en `definiciones.js` y la cabecera de `plantillas/definiciones/generador.js`. Ninguna hoja cita ni copia un examen de la UNI. Se confirma o se ajusta cuando haya un PDF de verbal de la UNI en `fuentes/examenes`.

**Decisiones nuevas (Gerson revisa después):**
13. **El ejemplo 11 de la idea 1 («helada») ya no cita al SENAMHI.** No se pudo abrir el Atlas de heladas en esta sesión (solo se vio citado por terceros en una búsqueda); la alternativa correcta dice ahora «descenso de la temperatura del aire hasta que el agua se congela», que no necesita fuente. Descartado: dejar la cifra «0 °C o menos» con una fuente sin comprobar.
14. **Plutón queda fuera; la historia sigue siendo la de Aristóteles.** Plutón sigue «por verificar» en `docs/investigacion/historia-ganchos.md`.
15. **El juego de la idea 4 no tiene ninguna definición negativa** (el cuaderno de Mateo trae una circular, una sin rasgo, la buena y una figurada): la negativa se reserva para la predicción, y «Mira» muestra cuándo negar sí vale («soltero»). Descartado: «Reptil: animal que no es mamífero ni ave» en el cuaderno, que dejaba la predicción ya vista.
16. **Idea 5 sobre el soroche y el chuño, sin cifras inventadas.** El folleto dice «unos 3800 metros» y ninguna proporción de visitantes (la propuesta tenía «3 de cada 10», inventado). La predicción usa el chuño; el «solo» de la alternativa absoluta es el error nuevo que el juego no mostró.
17. **Laboratorio de cinco mesas:** paradero (idea 1), lámina (idea 2), «Dos rasgos a la vez» (idea 2, mesa vieja pasada a la paleta de lectura), hoja de las cinco palabras (idea 3) y folleto del soroche (idea 5). La mesa vieja «Arma la silla» sale: repetía la idea 1 con verde y carmín, y el validador admite cinco mesas.
18. **Práctica propia con generador** (`plantillas/definiciones/`, 10 tipos, 2 por idea, banco de 40 ítems con su mundo chico) y `lectura-verbal` pasa a «Más mesas del tema» para esta unidad (`"rehacer"`). Los tres ejercicios de término excluido (e004 a e006) siguen en el banco de lectura. **Prueba del curso:** verbal no tiene banco en `catalogo/pruebas/` (su entrada y su salida son los textos t000a y t000b), así que no se agregan ítems; dos pares de reserva saldrían de los tipos `palabra` y `termino` con ítems que la práctica no usa.

**Códigos RVD** (en el informe y en `codigos.json`; `herramientas/codigos-verbal.js` lee ahora también las filas RVD): RVD1 a RVD15 (RVD5, «da por cumplido un rasgo que el caso no tiene», salió en la predicción de la idea 2; RVD14 es la definición figurada y RVD15 la otra oración del texto tomada por definición). Se usan además RV11 (absoluto) y RV56 (ejemplo).
