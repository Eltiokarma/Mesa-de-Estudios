# Etapa 9: decisiones (26 nov 2026)

**Criterio delegado** (Gerson, 19 nov): nada esperó su visto bueno. Cada propuesta termina en «Decisiones tomadas
(Gerson revisa después)» y cada auditoría marca lo «decidido por la sesión». Valen las decisiones generales de
`docs/etapa2/` a `docs/etapa8/`.

## Qué cambió en el método

- **Redactor** (Gerson, 26 nov: «muchas explicaciones son incoherentes por su brevedad»): después del escritor y antes
  del auditor, un agente con la skill Escribidor Escribano reescribe todo el texto sin tocar números, respuestas ni
  dibujos (`docs/metodo/unidad/redaccion-delegada.md`). Subieron los topes de los textos que explican (regla 45,
  condición 35, `siFuera` 30, paso de Mira 25, solución 30, paso de «Así se resuelve» 40; `docs/teoria.md` §5).
- **«Vale si»**: la app antepone «Vale si» a la condición; el redactor la hace continuar esa frase (al 26 nov había 33
  condiciones rotas en 14 unidades).
- **Lector en frío**: pregunta si el objeto que nombra el texto se reconoce en el dibujo (el columpio de Longitud de
  arco era un diagrama de líneas con `calidad: 2`).
- **Auditor**: comprueba con md5 que las capturas del lector no sean la pantalla de error (en RM un lector entero miró
  solo errores por un servidor caído).
- **Investigación de ChatGPT** (`docs/investigacion/etapa9/`): insumo por verificar. En Aritmética se descartaron cinco
  de sus seis ideas por ser de Álgebra.
- **Física la hizo Codex** (Impulso y choques, y Gravitación de la Etapa 10): cuentas bien, presentación mal (subíndices
  crudos, Datos que regalan, dibujos engañosos, texto de SVG partido por letra). Pasó el mismo cierre. Codex sigue con
  Oscilaciones y Fluidos (`docs/etapa9/encargo-codex.md`).
- **Tokens** en `docs/etapa9/tokens.md`.

## Las unidades

| Unidad | Ideas | Práctica | Estado |
| --- | --- | --- | --- |
| fisica.impulso-y-choques (Codex) | 6 | fis-impulso-choques | calidad 2 |
| fisica.gravitacion (Codex, Etapa 10) | 6 | fis-gravitacion | calidad 2 |
| algebra.binomio-de-newton | 6 | binomio-practica | calidad 2 |
| aritmetica.potenciacion-y-radicacion | 6 | potencias-raices | calidad 2 |
| geometria.puntos-notables | 6 | geo-puntos-notables | calidad 2 |
| quimica.reacciones-y-balance | 6 | reacciones-practica | calidad 2 |
| razonamiento-matematico.arreglos-numericos | 6 | rm-arreglos-ideas | calidad 2 |
| razonamiento-verbal.cohesion-y-coherencia | 5 | cohesion-coherencia | calidad 2 |
| trigonometria.reduccion-al-primer-cuadrante | 5 | trig-reduccion | calidad 2 |

Además, pasada del redactor (con verificación) sobre las 8 unidades de química ya cerradas: tanda 1 (Materia y
energía, Estructura atómica, Tabla periódica, Propiedades periódicas) subida; tanda 2 (Enlace, Geometría molecular,
Nomenclatura, Mol) en verificación.

## Lo grave que se encontró (todo corregido, con prueba que falla con la versión de antes)

- **App:** los subíndices de varias letras, con coma o paréntesis salían crudos en práctica y repaso (`m_A`, `E_PE`,
  `a_T`, `v_AB`), también en unidades viejas (v314).
- **Química:** el motor de `balance-reacciones` contaba mal los electrones (K₂Cr₂O₇ + HCl daba 14, son 6); «faltan O a
  la derecha» al revés; una semirreacción «terminada» con carga +5 contra −1; vasos de partículas sin carga neutra.
- **Álgebra:** «x³³» por (x³)³ en 138 de 400 semillas; ejercicios generados que repetían ejemplos con otras palabras.
- **Aritmética:** la calculadora de Lee mostraba √2 y respondía la Predice; «70 000 termina en tres ceros».
- **Geometría:** respuestas que se medían con regla en la figura (y «no está a escala» falso); Datos con la relación
  del caso armada; «E ve a BC más cerrado que A» falso con A < 60°; un distractor con un triángulo imposible.
- **RM:** una tabla de cubos que regalaba el centro; la cota que no se arma sin decir por qué.
- **Verbal:** dos ejemplos con dos respuestas; alternativas que se delataban por la forma (la única con «Sí», la única
  con un detalle de más): el generador ahora lo rechaza.
- **Trigonometría:** rótulos de ángulo a 80 px de su arco en `trig-pos` (bajan a 0; cierra el pendiente de la Etapa 8).
- **Física:** e usada antes de definirla; texto de las figuras partido letra por letra.

## Para que Gerson mire primero (decididas por la sesión)

1. **Aritmética:** de la investigación se quedó una idea de seis; la calculadora de Lee muestra √6 en vez de √2.
2. **Verbal:** en la predicción de la quinua, la misión presenta la cadena como «una forma entre otras».
3. **Química:** los 90 ejemplos de la unidad (y casi todos los de química) van sin dibujo; colores de las sustancias de
   prueba.
4. **Trigonometría:** Datos conservan la cuenta de α y la tabla de signos (el contrato pide la fórmula que se usa).
5. **Álgebra:** C(n, k) va siempre como dato; Análisis combinatorio todavía no está rehecha.
6. **Dibujos de prueba** que no se reconocen sin texto (veleta, válvula, cartulina y lápiz, casas y tanque, pueblos): los
   revisa la sesión «Dibujos reconocibles» en su segunda vuelta.

## Pendientes

- Las pruebas de varias prácticas exigían abrir cada explicación con «Bien» (eso creó el molde telegráfico). Se quitó en
  las de esta etapa y en las de química; falta en las demás al pasarles el redactor.
- Datos que dan la relación del caso en vez de herramientas generales: lo marcaron los lectores de física,
  trigonometría y geometría. Conviene una regla del validador.
- App: «Volver al inicio» parece una opción en los juegos; opciones largas cortadas con «…».
- `herramientas/capturas-teoria.js`: subir la espera de las tarjetas de Ejemplos (20 s no alcanza con la máquina
  cargada).
- Pasada del redactor por las unas 40 unidades cerradas que quedan.
