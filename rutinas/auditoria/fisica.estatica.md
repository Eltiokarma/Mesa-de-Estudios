# Auditoría de contenido: «Estática: equilibrio y torque» (fisica.estatica)

19 nov 2026. Auditor externo con criterio delegado (`docs/metodo/unidad/cierre-delegado.md`; fases 7 y 8), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`, y la lista «Lo que encontraron los auditores de la Etapa 5» de
`docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa6/propuesta-fisica.md` (§9 y «Decisiones nuevas de las
fases 2 a 5»). Lo que vieron los dos lectores en frío está en `rutinas/frio/fisica.estatica.md`; aquí se cita cuando el
código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/estatica.js` (v0.3.0, sin `calidad: 2`): las 6 ideas con sus 7 momentos, los 90
  ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea), el glosario (22 términos), las 3 mesas y
  la tabla de letras; su prueba `estatica.test.js`.
- La pieza `nucleo/kit/piezas/fis-estatica.js` con su prueba (no se tocó: lo que falla está en cómo la usa la unidad).
- La práctica `plantillas/fis-estatica/` (18 tipos con `TIPOS_POR_IDEA`, sobre el motor de `plantillas/estatica`), su
  `casos.json` y su `papel.json`; las reglas del papel con `calidad: 2` simulada en `fis-estatica`, `estatica` y
  `dinamica-fuerzas` (limpias).
- La app a 390 px con `--entera` (servidor propio en el puerto 4414): los 42 momentos y las 90 tarjetas, antes
  (`scratchpad/e6-cierre-est/lector/`) y después (`…/despues/`); `herramientas/ecuaciones-ancho.js` sobre la unidad
  (62 pantallas, 518 renglones: nada se sale ni se parte).

**Cuentas** (scripts propios en el scratchpad `e6-cierre-est/`, que del contenido solo leen el texto que ve el alumno o,
en la práctica, los parámetros `_datos`):
- `cuentas.js`: un resolvedor de equilibrio propio. Cada caso se arma como una lista de fuerzas (vector y punto de
  aplicación) y se resuelve ΣFx = 0, ΣFy = 0 y Στ = 0 por eliminación de Gauss, con sen 37° = 3/5 definido aparte; el
  resorte se estira de a 0,01 mm hasta igualar lo que lo jala; el sube y baja y el voladizo, por bisección. Ninguna
  fórmula despejada de la unidad. **4 800 casos** (400 semillas × 6 ideas × «Ahora tú» y «Así se resuelve») y **6 900
  distractores** comparados, más las 100 parejas de la tercera ley contra una tabla propia. Antes de corregir: **50
  casos imposibles** (A2) y **14 semillas** donde un error daba la correcta (M4); lo demás cuadra.
- `ejemplos.js`: los 90 ejemplos contra valores calculados a mano con su DCL; en los 30 de nivel 3, cada alternativa
  con el error que nombra el resuelto. Cuadran las 90 respuestas; **siete explicaciones de distractores no dan su
  valor** (M3).
- `practica.js`: los 18 tipos de `fis-estatica` (2 418 problemas: 400 semillas por idea, más `casos.json`) con el mismo
  resolvedor, y una copia del generador que avisa cuando un error da la correcta. Cuadran todos; **seis errores daban la
  correcta y se borraban en silencio** (M4). El papel (8), a mano: cuadra.
- Las 6 predicciones con cada distractor (500/400/300/100 N; 80 N contra 60 N; 120/200/0/80 N; 21/45/9/18 cm; la escoba,
  2 · 0,45 = 6 · 0,15; 100/0/400/200 N) y las 6 misiones en toda su grilla: cada una se logra (3, 1, 1, 1, 2 y 1
  maneras) y ninguna al abrir.
- La segunda ley: ningún ejercicio la usa. Donde algo desliza con fuerza neta (Mira de la idea 3, «Empujar de más»,
  «Ahora tú» que desliza, la mesa «Caja de masa variable») solo se pide el rozamiento cinético, μ_k · N, y nunca una
  aceleración.
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 y 400 semillas): **0 problemas, 0 pendientes**, antes y
  después. Ninguna de las faltas de abajo la ve una regla de hoy.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3, 5 | Regla de la idea 3 (`conMu` pasaba `regla.texto` y `condicion` a arreglo) | La app escribe la regla como texto plano (`esc(r.texto)`, `app/teoria.js:770`): salía «hasta su tope ,[object Object], · N. Al deslizar, el cinético vale ,[object Object], · N» (lector A). No se lee el tope. | La regla en palabras («su coeficiente por la normal»), sin pasar por `conMu`; prueba de que regla, misión y títulos son cadenas. |
| A2 | 10; regla 3 | «Ahora tú» de la idea 3, k = 2 (50 de 400 semillas) | «Una caja … está quieta en una rampa de 53°; entre ellas, μ_s = 0,9»: el tope es 0,9 · 0,6 P = 0,54 P y hace falta 0,8 P. La caja no puede estar quieta; el ejercicio pide su rozamiento. «Así se resuelve» impar: quieta a 53° sin μ, que pide μ_s ≥ 1,33. | Solo 37° con μ_s de 0,8 o 0,9; «Así se resuelve», a 37°. |
| A3 | 5; figuras | Ejemplo 3.14 «Subir la caja por la rampa» | La flecha del rozamiento sale hacia arriba de la rampa, igual que F, y el resuelto dice «el rozamiento apunta hacia abajo de la rampa». | `figRampa` con `fAbajo`. |
| A4 | 1, 13; idea 1 | DCL del rozamiento sin f (Lee, Juega, Predice, ejemplos 3.1, 3.5, 3.7, 3.11, 3.12 y 3.15, «Así se resuelve» y «Ahora tú»; en 3.1, 3.15 y los generadores el rótulo «f = ?» no se dibujaba). DCL de la balanza sin N (ejemplo 1.3, Predice, «Así se resuelve» y «Ahora tú»); 1.6 sin P. | Un cuerpo quieto con F de un lado y nada del otro: el DCL no suma cero, justo lo que enseña la idea 1 (lectores A y B: «no debería quedarse quieto»). | Toda fuerza en su DCL; lo pedido con «?». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Figuras (Etapa 5, 5) | Idea 4: la regla en centímetros en todas las figuras; la punteada en 4.7 y 4.14 | Con la regla al lado, 4.1 (x = ?), 4.6 (L = ?), 4.7 y 4.14 (el largo natural, marcado por la punteada) y «Ahora tú» k = 0 se leen en el dibujo. Las flechas pedidas («N = ?», «f = ?») iban a escala: se medían contra las conocidas. | Regla solo en Juega y Mira; sin punteada donde se pide el largo natural; lo pedido con largo fijo. |
| M2 | Figuras; misión | 2.14 dibujado a 30°, que es la respuesta y la misión; 5.6 y 5.12 con el niño en su sitio (Carla a 2 m, igual que la cota de Ana) | El dibujo da la respuesta. | 2.14 pasa a «cada cable jala 75 N: ¿qué ángulo?» (53°), dibujado a 37° y «no está a escala»; 5.6 y 5.12, con el niño en otro sitio y el aviso. |
| M3 | Distractores (Etapa 5, 2) | 3.13 E (0,5: «un valor redondo»), 4.13 E (100 N: «4 · 500 / 20»), 5.11 E (4000 N: «multiplica en vez de dividir» da 3 200), 5.12 B y C (2,5 m y 1 m: «suma las distancias», «iguala pesos»), 6.13 C (0,25 m: «divide 300 entre 1200»), 6.14 E (25 N: «parte el peso en cuatro») | La explicación no rehace el valor de la alternativa. | Cada alternativa con un error de verdad y su cuenta (abajo). |
| M4 | Una sola respuesta (Etapa 5, 3) | «Ahora tú»: idea 3 k = 0 (14 semillas: μ_k · N = F) y k = 3 (6: F ÷ P = μ_k); idea 4 k = 0 (7: k ÷ P = x); idea 1 k = 2 (b = 2a); idea 6 k = 1 (L = 4a). Práctica: `quieto` (F = tope/2), `simetrico` a 30° (ST-P), `caballete` L = 4a, `apiladas` b = 2a, `estira`, `balancin` | `opciones()` y `cerrar()` borraban el distractor repetido y seguían: quien comete ese error acierta (lector A: «el error acierta»). | Los casos se eligen sin choques; `cerrar()` descarta el caso; `opciones()` marca `repiteCorrecta` y una prueba lo busca en 400 semillas. |
| M5 | Repetición (Etapa 5, 8) | «Ahora tú» idea 2 k = 0 a 30° (= la misión, T = P); idea 6 k = 2 con 300 N y 600 N (= ejemplo 6.13); idea 6 k = 3 (puede salir el ejemplo 6.11); idea 4 k = 0 con 200 N/m y 2 kg (= la misión) | Lector A: «es el mismo caso que la misión». | Fuera de sus listas. |
| M6 | 10 | «Ahora tú» de la idea 5 k = 1 (2,88 m y 3,2 m del apoyo); `balancin` de la práctica hasta 3 m | Un sube y baja no tiene 3 m de cada lado (el juego llega a 2,5 m). | Hasta 2,5 m. |
| M7 | 13; 3 | Juega de las ideas 4 y 5 | No dicen que un kilo pesa 10 N; la lectura del torque, «τ de Ana: 450 N·m; Beto: 200 N·m: baja Ana», telegráfica (lector B). Juega de la idea 6 no dice que los caballetes están en las puntas. | g en la consigna; lectura en frase; caballetes en las puntas. |
| M8 | Colores (regla 4) | 5.11 la piedra que empuja la barreta en carmín (peso); 1.8 el 50 N de B sobre A en carmín y después en violeta; la regla del torque con F naranja frente a pesos (lector B) | Un color por clase de fuerza. | Violeta las de contacto; F de la regla y de los Datos del torque en tinta («un peso o una mano»). |
| M9 | «Vale si» | Las seis reglas | La app escribe «Vale si» + `condicion`: salían aclaraciones con mayúscula («Vale si La pareja…», «Vale si El punto…»), no condiciones (lector B). | Seis condiciones en minúscula; prueba. |
| M10 | 8; figuras | Rótulos encimados (lectores A y B): 36 N y 64 N en la misma línea (regla de la idea 2); T de 2.8 como un «moño»; «N = 400 N» sobre el título «DCL»; F que sale de la esquina baja del costal; la mano que no toca el baúl; P_b tachado por el piso; N_A = ? lejos del caballete; L, F y el ángulo de la llave encimados; la cota de 6.8 sobre la caja | | Cada uno en su sitio (Correcciones). |
| M11 | 12 | «Así se resuelve» de las ideas 5 y 6 sin dibujo (lector B) | | Palanca, puerta, tablón con balde y barra sobre un apoyo. |
| M12 | 3, 13 | Mira de la idea 3 usa 0,4 y 0,3 sin decirlos; Datos de las rampas con «lo horizontal y lo vertical» y el resuelto a lo largo de la rampa (lector B); 3.14 con un «·» suelto; 3.3 con F = 90 N que no está en el enunciado; 1.8 «con las mismas cajas» remite a otra tarjeta | | μ_s y μ_k en Mira; dato `eqRampa`; pasos partidos; F sin valor; el enunciado entero. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Redacción | «Ahora tú» de las ideas 1, 3 y 4 | «la pareja de el peso»; «Una mesa / una refrigeradora … Lo empujas»; «con 1 kg colgados»; «con la mano, con 60 N». | Hecho. |
| B2 | Distractores | Idea 5 k = 0 («0 N·m»: el error al revés redondeaba a cero), k = 2 y `inclinada` («usa los tres datos», «revisa la cuenta») | No son errores con nombre. | TQ-DIV con centímetros y TQ-ENTRE-SEN (anotado en el informe de investigación). |
| B3 | Objetos | 6.15 «el bate» que es un palo y se dibuja como escoba; Lee de la idea 2 «en muchas calles de Puno» | | Escoba en título, texto y dibujo; sin Puno. |
| B4 | Figuras | El juego de la idea 6 («x» sobre la pata del caballete A), «N = 500 N» que toca la punta, P_B sobre la raya del piso en Juega de la idea 5, «eje» pegado a la cota en 6.3, la mesa del libro que parece piso (1.14), la flecha de 200 N sobre la persona en 1.11 (es la fuerza sobre la cuerda), N = P dibujado en 3.8 | Lectores A y B. | Quedan (no traban; ver Correcciones). |
| B5 | App | La flechita de ΣF⃗ corrida sobre el Σ en la regla de la idea 6 y sobre «quieto» en los Datos (lector B) | Es `nucleo/ecuacion.js` al partir el renglón. | Los Datos ya no la dejan bajo «quieto»; lo de la regla, para la sesión. |

**Lo que el lector en frío vio y el código confirma** (arriba): A1, A4, M2 (2.14), M4, M5, M7, M8, M9, M10, M11, M12, B1.
Predice sin «No sé» (lector A) no es falla: «No sé» va en «Ahora tú» y en las pruebas, nunca en las escenas (CLAUDE.md,
8 nov); es igual en todas las unidades.

## Lo que está bien y hay que copiar al molde

- **Las cuentas**: 4 800 casos, 6 900 distractores, 90 ejemplos, 2 418 problemas de práctica y los 18 casos cuadran por
  otro camino; la prueba de la unidad ya traía un resolvedor de Gauss propio.
- **Un color por clase de fuerza** (peso carmín, apoyos violeta, lo que jala desde afuera naranja, rozamiento turquesa)
  y su prueba con el campo `m` de cada ficha: el criterio sirve para Dinámica.
- **Predicciones con el dato más fuerte** (E10, E8, E1) y opciones solo numéricas, con la explicación en `siFuera`.
- **Valores exactos** en todo lo que se escribe con «=» (`exacto()` y `elegir()`): ninguna igualdad falsa en 400
  semillas.
- **La práctica sobre el motor de la escena**, sin copiarlo, con `TIPOS_POR_IDEA` y `datos` por tipo.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Los campos que la app escribe como texto plano son cadenas** (`regla.texto`, `regla.condicion`, misión, título, pregunta, actividad): un arreglo sale «[object Object]». | Sí (el tipo del campo). |
| **«Vale si» lleva una condición en minúscula**, no una aclaración con mayúscula. | Semi (la minúscula, sí; que sea condición, a mano). |
| **Ningún error da la correcta**: `opciones()` y `cerrar()` descartan en silencio el distractor que repite la correcta. Que avisen (o que el caso se descarte) y una prueba lo busque. | Sí. |
| **En un DCL, toda fuerza que actúa**: si un cuerpo quieto tiene una fuerza de lado, va el rozamiento; si se apoya, la normal. | Semi (por la pieza: flechas por color en las figuras con caja del DCL). |
| **Lo pedido no se mide en la figura**: flechas con «?» sin escala, sin regla graduada en un ejercicio, sin la punteada del dato pedido. | Semi (las flechas con «?», sí; lo demás, por pieza). |
| **Un caso físicamente posible**: lo «quieto» cumple f ≤ μ_s · N con los datos que se dan. | Sí en la prueba de la unidad (resolvedor). |
| **«Ahora tú» no repite la misión** (además de Predice y los ejemplos). | Semi (la misión se puede evaluar sobre los números del caso). |

## Correcciones (19 nov)

Hechas por el mismo auditor (fase 8), con las notas de los dos lectores en frío de la ronda 1. Archivos tocados:
`contenido/teoria/fisica/estatica.js` y su `.test.js`; `plantillas/fis-estatica/generador.js`, `generador.test.js`,
`casos.json` (la semilla 6) y `papel.json` (regenerado: cambió p3); `docs/investigacion/estatica-energia-ideas-erroneas.md`
(TQ-ENTRE-SEN). No toqué la pieza, `app/`, `nucleo/teoria.js`, el catálogo ni otras unidades.

**Pruebas.** Ocho pruebas nuevas en `estatica.test.js` («auditoría A1» a «M6 y M7») y una en `generador.test.js`; las
nueve fallan con la versión de antes (copias en `scratchpad/e6-cierre-est/prueba-antes/` y `prueba-antes-gen/`) y pasan
con la nueva. En verde: la unidad (19), la pieza, el generador (26), el motor de `estatica` y `papel-reglas`; el validador
común (`teoria.test.js`) falla solo en unidades de otras sesiones (enlace químico, analogías) y en `app/datos/glosario`
sin regenerar. Validador con `calidad: 2` simulada, 400 semillas: 0 problemas. Cuentas otra vez por mi camino: 4 800
casos y 6 900 distractores, 90 ejemplos, 2 418 problemas de práctica y los 18 casos: todo cuadra; ningún error da la
correcta. Ecuaciones a 390 px: todo cabe. Capturas de después: `scratchpad/e6-cierre-est/despues/`.

### Alta

- **A1.** Hecho: la regla de la idea 3 dice el tope en palabras y no pasa por `conMu`. Prueba «auditoría A1».
- **A2.** Hecho: «Ahora tú» k = 2, solo a 37° con μ_s de 0,8 o 0,9; «Así se resuelve» impar a 37° (rozamiento 3/5 del
  peso). Prueba «auditoría A2» (resolvedor contra el tope en 400 semillas).
- **A3.** Hecho: `figRampa({ fAbajo })`, la flecha baja por la rampa. Prueba «auditoría A3».
- **A4.** Hecho: `dclRoce` dibuja el rozamiento cuando hay rótulo «?» y los ejemplos traen su f; los DCL de la balanza
  traen N (con «?») y 1.6 su P. **Decidido por la sesión, Gerson revisa después:** Lee, Juega y Predice de la idea 3
  dibujan también el rozamiento, con «f⃗ = ?» y sin escala, y la leyenda lo nombra («cuánto frena, en Mira»). Cambia la
  decisión 6 de la propuesta (no dibujarlo hasta Mira): la flecha no da su valor, y la tarjeta 1 de Lee ya decía que el
  piso frena. Prueba «auditoría A4».

### Media

- **M1.** Hecho: la regla graduada solo en Juega y Mira (`regla: true`); sin punteada en 4.7 y 4.14 (`natural: false`);
  toda flecha con «?» de los DCL, de la rampa, del sube y baja y del tablón mide 30 px (`largoDe`), y las figuras con
  datos que no da el enunciado van sin escala (`sinEscala`). Prueba «auditoría M1».
- **M2.** Hecho: 2.14 «¿Con qué ángulo cuelgan los cables?» (120 N, cada cable 75 N: 2 · 75 · sen θ = 120, 53°; C
  toma el coseno, D deja los cables verticales, A y B dan unos 85 N y 69 N), dibujado a 37° con «no está a escala»; 5.6
  y 5.12 con el niño a 1,4 m y el aviso. Prueba «los 90 ejemplos» (53°) y «auditoría M1».
- **M3.** Hecho: 3.13 E 1,25 (iguala el rozamiento al peso entero); 4.13 E 58 N (0,004 m: el resorte daría 2 N); 5.11 E
  3 200 N (invierte los brazos: 800 · 1,2 ÷ 0,3); 5.12 B 2,5 m (Beto también a 2 m: 500 · 2 ÷ 400) y C 3 m (2 + 1);
  6.13 C (0,5 m de brazo al tablón: 300 · 0,5 ÷ 600); 6.14 E (multiplica por sen 30° en vez de dividir). Las letras
  correctas no cambian (A–E, 6 veces cada una). Prueba «auditoría M3».
- **M4.** Hecho: los casos se eligen sin choques (`elegir` con la lista de errores en la idea 3, k ÷ P ≠ x en la 4,
  b ≠ 2a en la 1, L ≠ 4a en la 6, F ÷ P ≠ μ_k en el examen de la 3); `opciones()` marca `repiteCorrecta`; en la
  práctica, `cerrar()` descarta el caso si un error da la correcta. `casos.json` (semilla 6: 40 kg, μ_s = 0,5, 120 N;
  frena 120 N, rehecho con `practica.js`) y el papel p3 (20 kg, μ_s = 0,5, 40 N; frena 40 N) cambiaron. Pruebas
  «auditoría M4 y M5» y la del generador.
- **M5.** Hecho: sin 30° en la idea 2 k = 0 (todas sus opciones con dos decimales exactos: ya no sale «46,19 N»), sin
  300/600 en la idea 6 k = 2, sin el caso de 6.11 en k = 3, sin 200 N/m con 2 kg en la idea 4. Misma prueba.
- **M6.** Hecho: hasta 2,5 m en la idea 5 y en `balancin`. Pruebas «auditoría M6 y M7» y la del generador.
- **M7.** Hecho: «Cada kilo pesa 10 N» en las consignas de las ideas 4 y 5 («Un kilo pesa 10 N» en la 5); lectura «Ana,
  τ = 450 N·m; Beto, τ = 200 N·m: baja Ana»; la consigna de la idea 6 dice que los caballetes están en las puntas.
- **M8.** Hecho: la piedra de 5.11 en violeta y en el enunciado; N_{B→A} de 1.8 en violeta (P = 5 · 10 = 50 N); F de la
  regla y de los Datos del torque en tinta, «un peso o una mano». Prueba «auditoría M6 y M7».
- **M9.** Hecho: las seis condiciones, en minúscula y como condición (dentro de 22 palabras). Prueba «auditoría A1».
- **M10.** Hecho: la parte vertical de cada cable corrida 9 px a su lado y la escala del caso asimétrico más chica; las
  figuras colgadas se alargan en vez de achicar las flechas (2.8); el DCL del ropero más abajo (el título ya no choca); F
  de la mano llega a la cara de arriba del costal, con su rótulo al lado; la mano toca el baúl; el piso del tablón baja a
  214 y los rótulos de P_b y del pintor van de lado; N_A = ? sobre su caballete; la llave con la cota abajo y la flecha
  más larga; en 6.8 las cotas sobre la caja; los rótulos de Predice de la idea 4, abajo; 6.14 marca la bisagra.
- **M11.** Hecho: `figPuerta` (vista de arriba con la fuerza inclinada), la palanca con el saco, el tablón con el balde
  y la barra sobre un apoyo. Prueba «auditoría M6 y M7».
- **M12.** Hecho: Mira de la idea 3 dice μ_s = 0,4 y μ_k = 0,3; las rampas usan el dato `eqRampa` («a lo largo de la
  rampa suma cero, y contra ella también»); 3.14 en dos pasos; 3.3 con F sin valor; 1.8 con el enunciado entero.

### Baja

- B1, B2 y B3: hechos. B4: quedan (no traban la lectura; la «x» del juego y la flecha de 1.11 son de la pieza o de un
  rediseño del dibujo). B5: los Datos ya no dejan ΣF⃗ bajo «quieto»; la flechita corrida de la regla de la idea 6 es de
  `nucleo/ecuacion.js`, fuera de mi alcance: queda para la sesión.

### Decidido por la sesión, Gerson revisa después

1. El rozamiento se dibuja con «?» desde Lee, Juega y Predice de la idea 3 (cambia la decisión 6 de la propuesta).
2. Las flechas pedidas de un DCL van con un largo fijo de 30 px y sin escala; las demás, a escala con un mínimo de 18 px
   para que se vea el palo.
3. El ejemplo 2.14 deja la misión (T = P a 30°) y pide el ángulo con T = 75 N: la misión no se repite en ningún ejercicio.
