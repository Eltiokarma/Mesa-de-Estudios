# Auditoría de contenido: «Impulso, cantidad de movimiento y choques» (fisica.impulso-y-choques)

26 nov 2026. Auditor de cierre con criterio delegado (`docs/metodo/unidad/cierre-delegado.md`; fases 7 y 8). No escribí
la unidad: la escribió Codex en la etapa 9 (`docs/etapa9/propuesta-fisica.md`, `informe-fisica.md`, `errores-fisica.md`),
sin capturas ni inspección visual; aquí todo se miró con capturas. Contrato: `docs/plan-calidad.md` §3. Vara:
`docs/molde-unidad.md` §10, las reglas de `docs/metodo/unidad/reglas-validador.md` y las lecciones 1 a 19 de
`docs/metodo/unidad/etapa-delegada.md`. Modelo: `fisica.trabajo-y-energia`. Lo que vieron los dos lectores en frío está
en `rutinas/frio/fisica.impulso-y-choques.md`; aquí se cita cuando el código lo confirma.

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/impulso-y-choques.js` (v0.4.0, sin `calidad: 2`): las 6 ideas con sus 7 momentos,
  los 90 ejemplos, «Así se resuelve» y «Ahora tú» (200 semillas de cada uno por idea), el glosario (16 términos), las 3
  mesas y la tabla de letras; sus 8 pruebas propias.
- La pieza `nucleo/kit/piezas/fis-estatica.js` (cómo dibuja los subíndices) y `ejes.js` (nombre del eje).
- La práctica `plantillas/fis-impulso-choques/` (18 tipos con `TIPOS_POR_IDEA`), sus 18 casos y sus 8 problemas de papel;
  la prueba del curso `fis-33` y `fis-34` (reserva), por sus pruebas.
- La app a 390 px con `--entera` (servidor propio, puerto 4221): 42 momentos y 90 tarjetas antes (`scratchpad/
  cierre-impulso/lector/`), a mitad (`…/rev1/`) y después (`…/despues/`).

**Cuentas** (scripts propios en `scratchpad/cierre-impulso/`; de la unidad solo leen los parámetros de cada caso
(`verificacion`) y el texto que ve el alumno; no llaman a ninguna función de cálculo de la unidad ni a sus pruebas):
- `cuentas.js`: la respuesta de los 90 ejemplos y de 200 semillas de «Así se resuelve» y de «Ahora tú» por idea (2490
  respuestas), con fórmulas escritas de nuevo por tipo: p = m·v con sus conversiones; I = área con signo y Δp; suma del
  sistema con impulso externo; unión, energía transformada, subida y frenado; choques con e por conservación más
  restitución; alturas y tiempo de vuelo; centro de masa ponderado, despejes y evolución. 0 diferencias. Además comprueba
  que cada choque se acerca antes, que los cuerpos no se atraviesan y que ninguno gana energía, que masas y duraciones
  salen positivas: 0 casos.
- `distractores.js`: los 3600 distractores de «Ahora tú» (200 semillas × 6 ideas × 3), cada uno rehecho por su error
  (signo, sin masa, suma de velocidades, solo el estado final, rectángulo por triángulo, solo un tramo, módulos,
  intercambia cuerpos, unión, piso fijo, sin raíz, alturas invertidas, solo el ascenso, promedio sin ponderar, etc.):
  0 diferencias; el número de cada `siFuera` coincide con su opción. Las 150 alternativas de los 30 ejemplos de nivel 3
  (`alt3.js`): una sola correcta en cada uno; de los 120 distractores, 99 reconocidos por la tabla y 21 rehechos a mano
  con su explicación (por ejemplo, 4.15 «439,04 J» = 7 · 11,2² / 2, toda la masa con la rapidez relativa; 3.11 «−2 m/s»
  resta dos veces lo que aportan A y B; 1.14 «60 kg·m/s» borra el signo).
- Predicciones a mano: 1) 4 · (−1,5) = −6 → 6 kg·m/s a la izquierda; 2) I = 0,5 · (0 − 8) = −4 N·s y −4 / 0,4 = −10 N;
  3) 0 = 1 · (−3) + 3 v → 1 m/s; 4) (12 − 6) / 6 = 1 m/s; 5) (después del cambio) (9,5 − 5,5) / (10 − 5) = 0,8;
  6) (2 · 3 + 4 · 3) / 6 = 3 m/s. Distractores de cada una, rehechos. Misiones por fuerza bruta sobre los controles: una
  sola combinación en cada una (3 kg y 2 m/s; −4 N; c = 0,2 m; 6 m/s con 2 kg; e = 0,75; 4 kg en 6 m).
- Papel (8) y casos (18) de la práctica, a mano: los 26 coinciden (p4: P = 7, separación 6, v_A = (7 − 18) / 5 = −2,2;
  p7: ½ · 0,3 · 40 − 10 · 0,2 = 4 N·s, −3 + 8 = 5 m/s; caso 11: (60 − 12) / 10 = 4,8, 4,8² / (2 · 0,5 · 10) = 2,304 m).
- Validador simulando `calidad: 2` con 200 semillas (`val.js`): 0 problemas antes y después. Reglas del papel
  simulando la marca: 0. `ecuaciones-ancho.js`: 0 ecuaciones que no caben; 12 resultados solos después de «=» y uno
  después de «;» (lección 19: lo arregla la app); después de las correcciones, 10 y uno.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3, 5 | Datos, ecuaciones y pasos de las ideas 3 a 6 (ejemplos y las 200 semillas); rótulos de las figuras de las seis ideas; eje de las gráficas F–t | El lector de la teoría no convierte «_» en texto: «m_A·v_A,x + m_B·v_B,x», «x_A = 0 m», «P_f,x = …», «v_rebote = e·v_llegada», «t_vuelo», «E_transformada», «v_acercamiento» salen con guion bajo (lectores A y B; tarjetas 07–09, 11, 14, 15, 18). En las figuras, la pieza solo bajaba 1 a 3 letras: «v_f,x» queda con «,x» arriba, «P_total,x» se lee «P_tot al,x», «m_total» «m_tot al», «x_CM(t)» partido. El eje dice «F_x (N)». | En la unidad, un paso final convierte «letra_sub» a nodos `{ sub }` con el color de su magnitud (sin tocar figuras); en la pieza, el subíndice acepta comas y paréntesis; el eje, «Fₓ». |
| A2 | Predice (lecciones 4 y 16), 13 | Predice de restitución | Pide el coeficiente de dos carritos que ya avanzaban y nada antes dice qué es e en velocidades: Lee solo dice que «no tiene unidad», el juego solo muestra alturas (lector B: «lo pude hacer porque adiviné»). Además, la figura de Lee y el valor inicial del juego muestran «e = 0,5», que era justo la respuesta. | Lee define e (separación entre acercamiento; con piso fijo, salida entre llegada) y la predicción pasa a 10 y 5 m/s → 5,5 y 9,5 m/s: e = 0,8, con distractores exactos 0,95, 0,55 y 1,25. Mira y la regla, con esos números. |
| A3 | 3, 5 (fuera de mi alcance: `app/`) | Práctica `fis-impulso-choques` (y repaso) | El generador escribe «m_A», «v_A,i», «P_i,x», «F_media,x», «x_CM» en texto; `conSub` de `app/practica.js` (igual en `app/app.js` y `app/repaso.js`) solo baja de 1 a 3 minúsculas: «m_A» sale crudo, «P_i,x» con «,x» arriba, «F_media,x» como «F» con «med» abajo e «ia,x». | Cambio de una línea en la app (decide la sesión): `/([A-Za-zÁÉÍÓÚáéíóúθρ\)])_([A-Za-z0-9]{1,14}(?:,[A-Za-z0-9]{1,14})*(?:\([A-Za-z0-9]{1,3}\))?)/g`. No corregido. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 1, 10 | Idea 4 (Lee, Predice, Mira, regla, ejemplos y casos) e idea 6 (Lee, Predice, Mira, ejemplos y casos) | Los dos carritos del choque iban en dos pistas, uno sobre otro: «no parece que vayan a chocar» (lector B). En el centro de masa todos los carritos iban en la misma columna aunque estén en −2 y 6 m. | Choque en una sola pista, A a la izquierda y B a la derecha, con sus rótulos encima; en el centro de masa, cada carrito en su pista y en el orden de su posición (sin escala). |
| M2 | Figuras (lección 5) | Ideas 1, 2, 3, 5 y 6 | La flecha de p⃗ montada sobre el carrito y su letra (juego y regla 1); flechas de 6 a 10 px que se ven como un triangulito (ideas 2, 3 y 4); la pelota flotando, sin cotas de H ni de h (idea 5 y 5.3); el resorte que desaparece en Predice, Mira y la regla 3 y las cajas del sistema abiertas por abajo; el carrito A cortado por el borde y su rótulo encima (juego 6); el rótulo «Impulso de la fuerza neta: I_x» colgado, sin valor, en todas las figuras de la idea 2. | Flecha de p⃗ más arriba; flechas de 16 px o más; pelota con piso y cotas H y h; resorte en las tres; caja cerrada; carrito dentro del lienzo; el rótulo del impulso solo en el juego, con su valor. |
| M3 | Molde §2 (Así se resuelve ≠ Ahora tú) | Las seis ideas | La app abre «Así se resuelve» y «Ahora tú» con la semilla 0, y los dos generadores sacan el tipo de la semilla: el primer «Ahora tú» era siempre el mismo problema que el resuelto con otros números (lector B, ideas 4 a 6). | «Así se resuelve» entra con la semilla corrida en uno: su primer caso es de otro tipo. |
| M4 | Una sola respuesta (lección 16) | «Ahora tú» de las ideas 4, 5 y 6; Predice 4; ejemplos 4.12, 5.13, 6.14 y 6.15 | El «≈» delataba: en 26 de 200 semillas de la idea 4 la única opción con «≈» era la correcta; en 79 de la idea 5 la única con «≈» era un distractor; en 24 de la idea 6 la única sin «≈» era un distractor; en 6.14 la correcta era la única con «≈». En Predice 4, «≈ 3,674 m/s» «suena raro» (lector B). | Las alternativas van sin «≈» (la respuesta sí lo lleva). En Predice 4, el distractor de la energía cambia por el promedio sin masas (2,25 m/s). |
| M5 | Pasos (molde §3) | 4.4, 4.5, 4.8, 4.9, 5.7, 5.8, 5.13, 5.14 y «Así se resuelve» de choques con e | Saltaba de «v_B,f − v_A,f = …» a «(20 − 3·5) ÷ 5» sin decir de dónde sale 20 ni cómo se despeja; en los elásticos, «1·(7 − 2)» sin decir que ese 1 es e (lector B: tarjetas 11, 14 y 15, «las que peor se entienden»). | Paso con la cantidad de movimiento total, el de la separación (sin «1·» en los elásticos) y «Reemplazamos v_A,f = v_B,f − 1,75 en 14 = 5·v_A,f + 2·v_B,f y despejamos». |
| M6 | Texto falso | Centro de masa (ejemplos y semillas); 3.11 y 3.14 | «A, B y C nombran carritos» en todos los casos de dos carritos; «incluida la situada en el origen» cuando ningún carrito está en el origen (6.3, lector B); en tres carritos, Datos «A y B nombran los carritos» y el resuelto «P_f,x = 1·5 + 2·(−1) + 3·0» con las velocidades iniciales (lector A: «me pierdo»). | Cada frase según el caso; en tres carritos, «A, B y C» y el paso «P_f,x = P_i,x = …»; la resta muestra lo que aportan A y B. |
| M7 | 13 (el atajo) | Datos de 2.1 a 2.3, 2.8, 2.9, 2.10, 2.11, 2.15 y semillas de la idea 2 | «I_x = F_p,x · Δt / 2 (pulso triangular)» y «I_x = F_x · Δt (rectángulo)»: la fórmula ya adaptada al caso (lector A, tarjetas 04 y 05). | «I_x = área con signo bajo la gráfica de F_x frente a t» y «Área de un rectángulo: base · altura. Área de un triángulo: base · altura ÷ 2». |
| M8 | 7, 12 | La regla de las ideas 4, 5 y 6 | Idea 4: «usa la solución con separación». Idea 5: el dibujo es la pelota y la fórmula, la de los carritos; «impacto frontal pasivo», «después aplica cinemática». Idea 6: la figura armaba la fórmula con rótulos sueltos a posiciones fijas: con los subíndices rotos quedaban huecos grandes. | Condiciones en palabras («se separan con la rapidez relativa con que se acercaban»); dibujo de los carritos después del choque con acercamiento y separación; la fórmula del centro en dos renglones enteros. |
| M9 | 2, 3 | Juego de la idea 2 | La consigna no decía la velocidad inicial (4 m/s) ni la masa; el deslizador va de −8 a −2 y arranca en el tope derecho sin decir que negativo es izquierda (lector A: «no sé si alcanza la misión»). | Consigna «La pelota de 0,5 kg llega a 4 m/s hacia la derecha…»; control «Fuerza neta horizontal (negativa: hacia la izquierda)». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Títulos y rótulos | 1.8, 4.14, 1.11 y 1.14, 4.12 y 4.14, 6.12 y 6.14 | «La rapidez del medidor» (no hay medidor); «Alcance antes del frenado» (subraya «alcance» de otro glosario); «m_L» colgado bajo la pista; M sin definir en el frenado; «1 kg = 1000 g» cuando solo se convierten centímetros. | Título «Velocidad en kilómetros por hora» y «Choque antes del frenado»; m_L junto a los demás datos; «M es la masa conjunta»; solo la equivalencia que se usa. |
| B2 | Microtexto | Juegos 4 y 5; «Así se resuelve» de la idea 6; explicación de 5.14 | «Progreso del ensayo 0,06» (lector B); «¿Qué me piden?» genérico («la posición, la velocidad o la masa»); «1 (supone piso fijo)». | «Avance de la animación»; «Piden …» según el tipo; «multiplica e por la llegada de A, como si el otro carrito fuera un piso fijo». |
| B3 | Ecuaciones a 390 px | 13 renglones (ideas 1, 4, 5 y 6) | Resultado corto solo después de «=» (12) o de «;» (1). | Lección 19: lo arregla la app. No se cambia. |
| B4 | Glosario (app) | Símbolos «F_media», «I_ext», «P_total», «x_CM» | La app los muestra con «_» (igual que «W_g» y «E_PG» en Trabajo y energía, ya con `calidad: 2`). | Lo mismo que A3, en `app/teoria.js`. No corregido. |
| B5 | Lo que queda | Regla 2; resuelve 6; 6.14 | La gráfica de la regla del impulso es positiva cuando todo lo anterior era negativo y no escribe su área (2 N·s); resultados como 2,977… m en el centro de masa; «igualamos los aportes a ambos lados» es un método que la idea no presenta. | Pendiente, barato en otra pasada. |
| B6 | Prueba propia | `impulso-y-choques-unidad.test.js:14` | Exige `def.calidad !== 2` («la marca pertenece a la sesión auditora»): al marcar, esa línea falla. | La sesión la quita cuando ponga la marca. |

## Lo que está bien y hay que copiar al molde

- Una idea nueva al inicio (cantidad de movimiento) con su migración del avance probada (`impulso-y-choques-avance.test.js`).
- Todos los errores salen de una operación escrita (`errores-fisica.md`) y cada `siFuera` da el valor de su opción: los
  3600 de «Ahora tú» coinciden con su error rehecho aparte.
- Física con sus condiciones dichas: fuerza media frente a máxima, impulso externo nulo frente a fuerza externa nula
  todo el intervalo, piso fijo y alturas del centro, ruedas bloqueadas para el rozamiento cinético.
- Familias de números disjuntas entre «Así se resuelve» y «Ahora tú» (masas 9/11/13 contra 2/4/6/8).
- Pruebas propias que recalculan por otra vía (oráculos por idea) y la geometría de miles de figuras.

## Reglas que faltan en el contrato o el validador

| Regla | Qué pide | ¿Automática? |
|---|---|---|
| `subindice-crudo` | Ningún texto que se lee fuera de una figura trae «letra_sub» (el lector no lo convierte). | Sí: la misma búsqueda de `impulso-y-choques-auditoria.test.js`, sobre ideas, ejemplos y 60 semillas. |
| `rotulo-subindice` | En las figuras, ningún «_» queda después del reemplazo de la pieza; los nombres de eje no llevan «_». | Sí, en la prueba de cada pieza o en el validador (recorre `dibujo`, `figura` y `cortes`). |
| `aprox-alternativas` | En una pregunta con alternativas, todas llevan «≈» o ninguna. | Sí. |
| `resuelve-tipo` | El primer caso de «Así se resuelve» y el de «Ahora tú» son de distinto tipo (no solo de otros números). | A medias: con `verificacion.tipo` cuando existe; si no, comparando el enunciado sin números. |
| `flecha-minima` | Ninguna flecha de una figura mide menos de 16 px (si no, se ve solo la cabeza). | Sí, en la prueba de la pieza. |
| `predice-sin-definicion` | Si Predice pide una magnitud que se define con una fórmula, Lee o el glosario la definen en palabras antes. | No: lo mira el auditor. |

## Correcciones (26 nov)

Todo en `contenido/teoria/fisica/impulso-y-choques.js` salvo lo que se dice. Prueba nueva:
`contenido/teoria/fisica/impulso-y-choques-auditoria.test.js` (12 pruebas; las 12 fallan con la versión de la etapa 9,
comprobado con una copia del archivo de `HEAD` en el scratchpad, y pasan ahora). Cuentas rehechas otra vez después de los
cambios: 2490 respuestas, 3600 distractores, 150 alternativas de nivel 3, las seis predicciones y las seis misiones,
sin diferencias. Validador simulando `calidad: 2` con 200 semillas: 0. Capturas de después en
`scratchpad/cierre-impulso/despues/`.

### Alta
- **A1.** Función `notar` al final de la unidad: convierte «letra_sub» de todo texto que no sea figura en `{ sub }` con
  el color de su magnitud (m violeta, v y u naranja, p, P e I turquesa, F carmín, t verde), también en lo que generan
  «Así se resuelve», «Ahora tú» y la lectura del juego y de las mesas. En la pieza `fis-estatica` (compartida, cambio de
  una línea con su prueba en `fis-estatica.test.js`): el subíndice acepta comas y paréntesis y hasta 14 caracteres por
  tramo («v_f,x», «P_total,x», «x_CM(t)»). Mejora también rótulos de otras unidades que ya usaban «_» largo; sus
  pruebas siguen en verde (Estática, Dinámica, Trabajo y energía, las tres de la pieza). Eje «Fₓ».
- **A2.** Lee 2 de restitución define e en palabras; Predice con 10 y 5 m/s → 5,5 y 9,5 m/s (e = 0,8; distractores
  0,95, 0,55 y 1,25); Mira y la regla con esos números. Ajusté la prueba de Codex que fijaba los números viejos
  (`impulso-y-choques-choques.test.js`).
- **A3.** No corregido (es `app/`). Propuesta de una línea en el hallazgo, para `app/practica.js`, `app/app.js` y
  `app/repaso.js`; con ella también se ven bien las de las unidades de calidad 2 que escriben «_» largo.

### Media
- **M1.** `crCarros` reescrita: una pista, A a la izquierda y B a la derecha, rótulos encima («v_A,i», «v_B,f», «v_f» del
  conjunto). `ctFigura`: cada carrito en su pista, en el orden de su posición, con flecha si tiene velocidad.
- **M2.** Flecha de p⃗ más arriba; toda flecha de velocidad de 16 px o más; `crPelota` con piso, cotas H y h (h
  proporcional solo cuando ya se muestra); resorte en Predice, Mira y regla 3; caja del sistema cerrada; carrito A y la
  regla del juego 6 dentro del lienzo; el rótulo del impulso solo en el juego («Impulso del pulso: I_x = −1 N·s»).
- **M3.** «Así se resuelve» entra con `s + 1` en las seis ideas.
- **M4.** `sinAprox` en las alternativas de choques, restitución y centro de masa; Predice 4 con «promedio» (2,25 m/s).
- **M5.** Tres pasos en los choques con e: total, separación (sin «1·» si es elástico) y el reemplazo con su despeje.
- **M6.** Frases según el caso; en tres carritos, Datos con C y el resuelto con P_i,x, P_f,x y lo que aportan A y B.
- **M7.** `icAreas` en los Datos de la idea 2.
- **M8.** Condición de la regla 4 en palabras; regla 5 con texto nuevo, condición corta y el dibujo de los carritos;
  regla 6 en dos renglones enteros.
- **M9.** Consigna con 0,5 kg y 4 m/s; control con el sentido del signo.

### Baja
- B1 y B2 corregidos. B3 y B4 quedan para la app. B5 queda pendiente. B6: aviso a la sesión.

### Decidido por la sesión, Gerson revisa después
- Restitución: e se define en Lee (antes la unidad lo dejaba para la regla). Predice sigue preguntando algo que el
  alumno no vio: aplicarlo a dos cuerpos que se mueven, donde la trampa es dividir velocidades sueltas.
- Predice de choques: el distractor «conserva la energía cinética» (≈ 3,674 m/s) se cambió por «promedio sin masas»;
  el error de la energía sigue en los ejemplos (4.11 a 4.14) y en «Ahora tú».
- Las alternativas se escriben sin «≈», como en los exámenes; la respuesta y el resuelto sí lo llevan.
