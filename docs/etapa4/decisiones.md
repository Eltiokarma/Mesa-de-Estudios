# Etapa 4: decisiones (Gerson, mesa de revisión, 18 nov 2026)

Gerson aprobó en la mesa de revisión (`herramientas/revision/`) las cuatro propuestas de esta carpeta **con todas sus
recomendaciones** (sección «Preguntas para Gerson» de cada una). Valen además todas las decisiones generales de
`docs/etapa2/decisiones.md` («Cambios posteriores») y de `docs/etapa3/decisiones.md` (las cinco rondas), y las reglas
del 18 nov de `docs/molde-unidad.md` §3 (el dibujo de un ejemplo muestra lo que cada dato marca por sí solo; las marcas
de igualdad van sobre una llave).

## Movimiento rectilíneo — `propuesta-fisica.md`
- **Se parte en dos**, como Magnitudes y Vectores: «Movimiento rectilíneo uniforme» (ideas A1–A5, conserva
  `fisica.movimiento-rectilineo`) y «MRUV y caída libre» (B1–B6, unidad nueva `fisica.mruv-y-caida-libre`, con el avance
  migrado con `Avance.migrar`).
- Signos con **un eje con signo**; en «La regla», una línea que lo traduce al «±» de la academia.
- En una recta, v, a y Δx van **sin flecha** (números con signo sobre el eje); la flecha se dibuja sobre el vehículo y el
  eje siempre lleva su «+». La unidad declara que no tiene magnitudes vectoriales, con el motivo.
- Colores, iguales en las dos unidades: velocidad naranja, tiempo turquesa, posición y desplazamiento violeta,
  aceleración y g carmín, distancia recorrida en tinta. Dos móviles: mismo color con trazo distinto.
- d para la distancia recorrida (aviso en «Lee» de A3) y D para la separación entre móviles; Vectores no se toca.
- Caída libre en dos ideas (B5 soltar, B6 lanzar); B4 (gráficas x–t y a–t) es idea propia.
- San Marcos 2023-I (79), el bote con ángulo, pasa a `fisica.vectores`; sale el tipo `bote` de la práctica de MRU y el
  río en una recta entra en A5.
- Objetos de prueba dibujados por la sesión (combi, gráfica junto a la combi, pista, mototaxi, ventana, regla que se
  atrapa, pelota junto al pabellón); Gerson decide después cuáles reemplaza.
- Límites de velocidad del reglamento: solo si se confirman en el D.S. 025-2021-MTC; si no, rapideces de problema.
- Códigos nuevos como hipótesis en el informe de cinemática; títulos con el nombre del tema (los `id` no cambian).

## Estructura atómica — `propuesta-quimica.md`
- Seis ideas, con `configuracion-iones` como idea propia. La configuración electrónica entra entera aquí (ideas 4 a 6);
  Tabla periódica se queda con periodo, grupo, bloque y familia.
- Juego hasta Z = 36 (con Cr y Cu); «Ahora tú» de nivel examen hasta Z = 54, con el orden de llenado en `datos`.
- Bohr solo como idea (niveles permitidos, luz de un color fijo al bajar); sus números van a `fisica.fisica-moderna`.
- Isoelectrónicos: definición y conteo aquí; la comparación de radios va a Tabla periódica. Isóbaros e isótonos: una
  línea en la regla de la idea 1, definiciones en `datos` y un caso de nivel examen.
- N para los neutrones (A = Z + N), con aviso en «Lee»; el nitrógeno siempre por su nombre o como ¹⁴N. ℓ para el
  subnivel. La convención de mₗ y mₛ en `datos` y en una tarjeta «Convención del examen», confirmada con un libro de
  `fuentes/`.
- Colores: Z naranja, N turquesa, electrones violeta, carga carmín, A y los números cuánticos en tinta, sin verde.
- Objetos de prueba (hueso de la llama, retablo con pan de oro, hotel del electrón en «Lee», sal de Maras, sulfato
  ferroso, combi), en `quim-objeto`, `quim-hotel` y `quim-lamina`.
- Práctica: `configuracion-ubicacion` separada por unidad; generadores nuevos `particulas-nucleo` y `niveles-orbitales`.
- Radiactividad α, β y γ fuera (solo el carbono-14 que pasa a nitrógeno-14 en «Mira» de la idea 1). Títulos con el
  nombre del tema.

## Las cuatro operaciones — `propuesta-aritmetica.md`
- Sigue el puesto de doña Juana (el dinero solo como tarjeta de «Lee»); cuaderno manchado (`arit-cuaderno`) y
  calculadora (`arit-calculadora`) como objetos de prueba para las ideas 4 y 7.
- **Las sumatorias salen a Sucesiones y series**, con el avance de `sumatorias` y la mesa `escaleras-a-z` migrados; el
  tema pasa a «Adición con llevadas».
- Siete ideas, con `prestamo` y `cifras-ocultas` nuevas. Operaciones en otras bases sin idea propia (predicción de la
  idea 1 y «Ahora tú» de las ideas 1, 2, 3 y 5); la división en otras bases no entra.
- Aquí las cifras ocultas con números y el reverso en la resta; en Razonamiento numérico, la criptoaritmética con letras.
- Colores: envase en turquesa, lo que se muda en naranja, lo que se busca en violeta, los números que se operan en
  tinta, sin verde ni carmín. Notación: ×, nunca «·»; 34₍₅₎ y a̅b̅c̅ con raya; D, d, q, r y rₑ.
- Glosario: «factor», «producto», «múltiplo», «llevada» y «reverso» se estrenan aquí; «consecutivo» se queda aquí.
- Práctica nueva `operaciones-cifras`; la escena vieja va a «Más mesas del tema»; ari-17 y ari-18 a la prueba.

## Triángulos — `propuesta-geometria.md`
- Seis ideas, con `angulo-exterior` e `isosceles` propias. La condición de obtusángulo va a Relaciones métricas.
- Ángulos entre bisectrices aquí, como caza de ángulos; «incentro» y «excentro» marcados «se explica en Puntos
  notables».
- Colores: interiores en carmín (1, 2 o 3 arcos), exterior en turquesa, lados dados naranja y turquesa; altura naranja,
  mediana turquesa, bisectriz carmín y mediatriz en tinta discontinua; en los ejercicios todo ángulo dado en carmín.
- Notación: m∠A, m∠BAC cuando hay varios, ∠ACD para el exterior, x sin «°», nunca C(x) ni S(x).
- Controles de la idea 1: se agregan `b` y `c` (de 5° en 5°) y salen `ax` y `ay` del juego sin borrarlos del avance.
- Objetos de prueba en `geo-objeto` (cartulina, tijeral, plaza con mototaxi, compás, techo a dos aguas, lámpara,
  caserío, pileta). Lado mayor frente al ángulo mayor dentro de la idea 3; mediatriz solo como definición.
- Códigos partidos y nuevos como hipótesis; práctica nueva `geo-triangulos`; `triangulo-estira` a «Más mesas del tema».

## Álgebra (mesa del 18 nov, tarde)
- Visto bueno de las correcciones de Productos notables.
- La escena `cuadrado-crece` va a «Más mesas del tema» en las tres unidades que la usan (`"rehacer": true`).

## Segunda ronda (mesa, 18 nov, noche)
- **Visto bueno de las cinco ideas 1** (MRU `mru`, MRUV `aceleracion`, Estructura atómica `nucleo-identidad`, Las cuatro
  operaciones `otras-bases`, Triángulos `suma-de-angulos`): se sigue igual con el resto de ideas de cada unidad. Valen
  las decisiones chicas que se tomaron solas y quedaron anotadas en las tarjetas (el eco con ida y vuelta, B y C de 40°
  a 60° en el juego de Triángulos, la mariposa como versión propia, combis de 54 a 90 km/h, el 1836 con «unas»).
- **Tope de ideas:** una unidad puede llegar a 7 ideas si declara `septimaIdea` con su motivo (`nucleo/teoria.js`);
  hoy solo Las cuatro operaciones, que entra con `prestamo` y `cifras-ocultas`.
- Visto bueno de la ronda 2 de correcciones de Productos notables.

## Orden de trabajo
Fase 2 del método: la idea 1 de cada unidad completa, para el visto bueno de Gerson en la mesa. Movimiento rectilíneo
se parte primero, con la migración del avance.
