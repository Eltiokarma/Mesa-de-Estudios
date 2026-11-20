# Etapa 8: decisiones (19 y 20 nov 2026)

**Gerson delegó el criterio** (19 nov): nada esperó su visto bueno. Cada propuesta termina en «Decisiones tomadas
(Gerson revisa después)» y cada auditoría marca lo «decidido por la sesión». Gerson revisa todo después como control
de calidad. Valen las decisiones generales de `docs/etapa2/` a `docs/etapa7/`.

Mismo método que las Etapas 6 y 7 (`docs/metodo/unidad/`), con las lecciones 18 (el papel de toda la ficha) y 19 (los
chequeos `icono-respuesta` y `ecuaciones-ancho`) nuevas en `etapa-delegada.md`. Un agente escribe la unidad entera;
la sesión revisa la idea 1 en capturas y le manda notas; la cierran un auditor que rehace las cuentas por otro camino y
dos lectores en frío que solo ven capturas. Todos en Opus 5.5. En cuatro cursos la rama de entrada ya estaba completa,
así que la etapa abrió la segunda rama.

## Las ocho unidades

| Unidad | Rama | Ideas | Práctica | Estado |
| --- | --- | --- | --- | --- |
| razonamiento-verbal.conectores | Oraciones y orden (nueva) | 5 | conectores (nueva) | calidad 2 |
| algebra.ecuaciones-polinomiales | Expresiones algebraicas | 6 | ecuaciones-polinomiales-practica | calidad 2 |
| quimica.mol-y-composicion | Cálculos químicos (nueva) | 6 | mol-practica | calidad 2 |
| aritmetica.numeros-racionales | Números y operaciones | 6 | racionales | calidad 2 |
| razonamiento-matematico.razonamiento-inductivo | Números y patrones (nueva) | 6 | rm-induccion | calidad 2 |
| trigonometria.angulos-en-posicion-normal | Ángulos de cualquier medida (nueva) | 5 | trig-posicion-normal | calidad 2 |
| fisica.trabajo-y-energia | Mecánica | 6 | fis-energia | calidad 2 |
| geometria.proporcionalidad-y-semejanza | Geometría plana | 6 | geo-semejanza | calidad 2 |

Informes en `rutinas/auditoria/<unidad>.md` y `rutinas/frio/<unidad>.md`.

## Lo grave que encontraron los auditores (todo corregido, con una prueba que falla con la versión de antes)
- **Conectores:** un «cierre» que reunía algo que el folleto no dijo; Datos que dejaban descartar las incorrectas
  (391 de 400 semillas) y una puntuación que delataba el conector.
- **Ecuaciones polinomiales:** en la práctica «compañera» la raíz dada salía entre las alternativas (dos correctas);
  la recta de la idea 5 ponía u sobre el eje de x, como si u = −1 diera x = −1.
- **Mol y composición:** la letra N era a la vez el nitrógeno y el número de entidades en un mismo recuadro de Datos;
  316 redondeos escritos con «=»; un dato falso (la quercetina y el morado de la cebolla).
- **Números racionales:** la regla de «del resto» decía 1/2 + 1/3 = 5/6 bajo un dibujo de 4/6.
- **Razonamiento inductivo:** tres ideas decían que una regla «se prueba con un caso más», contra lo que enseña la
  idea 2; tres explicaciones falsas.
- **Trabajo y energía:** faltaba g = 10 m/s² en muchos Datos y la parte del peso a lo largo en la cuesta; un μ
  redondeado que no cuadraba.
- **Proporcionalidad y semejanza:** Menelao enunciado al revés («si el producto vale 1, están alineados», falso con
  largos sin signo); triángulos de Ceva y Menelao que no existían (376 de 4 800 en la teoría); un LAL imposible; Datos
  con letras DEF que chocaban con los puntos del problema (en la tarjeta 11 daban 6 en vez de 5).
- **Ángulos en posición normal:** sin graves; 845 rótulos de ángulo que pisaban ejes, y la idea de los negativos casi
  sin negativos.

## Decisiones generales de la etapa
- **Avance:** las ocho van a `REHECHAS_E6` en `nucleo/avance.js` con su marca y su prueba (Razonamiento inductivo sin
  predicciones que borrar: conserva las preguntas).
- **Prueba del curso:** las formas ya tenían 10 pares; los ítems nuevos van a la reserva (ep-01/02, ari-37/38,
  fis-31/32, ps-01/02, qui-23, rm-26/27, tri-16/17).
- **Escenas viejas a «Más mesas del tema»** (`"rehacer"`): lectura-verbal, ecuaciones-polinomiales, polinomios,
  mol-composicion, fracciones, sucesiones, circunferencia-trig, energia, energia-potencia, ampliadora y
  geo-proporcionalidad. Sus papeles dicen de qué unidad es cada problema (lección 18).
- **Piezas compartidas, cambios aditivos:** `ejes` (opción `ajustado`), `balanza` (`numeros: false`),
  `arit-calculadora` (la coma), `fis-estatica` (bloque de Energía), `geo-objeto` (bloque `semejante`).
- **Glosario que se muda:** «denominador» de Probabilidades a Números racionales; «incentro» de Proporcionalidad a
  Puntos notables (la tarjeta Lee de Triángulos dice que se explica allá).

## Para que Gerson mire primero (decididas por la sesión)
Cada propuesta y cada auditoría tiene su lista completa. Las que más cambian lo que ve el alumno:
1. **Ecuaciones polinomiales:** lo de Ecuaciones lineales y cuadráticas (sin rehacer) va siempre como dato (fórmula
   general, Δ); la i solo como dato (i² = −1) y «raíz no real»; la binómica se resuelve factorizando, sin plano
   complejo.
2. **Mol y composición:** N es el número de entidades (con aviso, porque en Estructura atómica son los neutrones) y las
   masas atómicas se escriben sin «=» («N 14»); masas redondeadas como en el examen, con su tarjeta de convención.
3. **Números racionales:** colores sin verde (numerador naranja, denominador turquesa, lo buscado violeta, el resto de
   la división carmín); periódicos siempre con el bloque y «…»; la idea nueva «del resto» con AR12.
4. **Trabajo y energía:** cada trabajo lleva el color de su fuerza, como en Dinámica; E_C, E_PG, E_PE, E_M (no K y U);
   g = 10 m/s² como una línea más de Datos; los niveles del edificio por su altura (en el Perú el 1.er piso es la
   planta baja).
5. **Conectores:** formato UNI y códigos RVC1 a RVC6 como hipótesis; Datos por pregunta, con una línea por relación de
   sus alternativas; puntuación neutra («, ¿…?»).
6. **Razonamiento inductivo:** sale impares-y-cuadrados (es de Aritmética); la torta reemplaza al círculo sin la
   fórmula de las regiones; la mesa de la torta muestra 31 antes de predecir (es exploración libre).
7. **Ángulos en posición normal:** sin ángulo de referencia ni paridad (son de Reducción); el giro horario tiene idea
   propia con el reloj; p3 de circunferencia-trig (elevación) se queda aquí como repaso.
8. **Dibujos de prueba** nuevos en todas las piezas de la etapa (el queque, la calculadora con coma, la caja de Rubén,
   la balanza de cocina, los fósforos, la torta, la pulsera, el plano del pueblo, el reloj, la maleta, el tobogán…):
   Gerson decide cuáles reemplaza.

## Pendientes que dejó la etapa
- `trig-plano`: llevar el rótulo de ángulo que esquiva líneas y el radio mínimo del arco de `trig-pos` (con 180° o
  360° el rótulo cae sobre un eje en cualquier unidad).
- `balanza`: numerar solo cuando hay más de una (hoy cada unidad que la use con una sola balanza muestra un «1»).
- App: la letra sin serifa en botones y Datos («NaCI»); el botón «¿…?» de los conectores en violeta; el hueco sobre
  la lupa en Mira.
- `recta`: rotula mal con paso 0,25.
- Mol: la mesa «Átomos contra masa» deja armar CH₁₄.
- Trabajo y energía: los DCL de trabajo neto en piso horizontal sin peso ni normal (pedir sitio en `figCarrito`).
- `nucleo/ecuacion.js`: pegar el resultado corto al «=» (sigue pendiente de la Etapa 7).
