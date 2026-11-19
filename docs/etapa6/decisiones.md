# Etapa 6: decisiones (19 nov 2026)

**Gerson delegó el criterio** (19 nov): nada esperó su visto bueno. Cada propuesta termina en «Decisiones tomadas
(Gerson revisa después)» y cada auditoría marca lo «decidido por la sesión». Gerson revisa todo después (ideas,
ejercicios y exámenes) como control de calidad. Valen las decisiones generales de `docs/etapa2/` a `docs/etapa5/`.

Desde esta etapa una unidad entera la escribe un solo agente (`docs/metodo/unidad/etapa-delegada.md`, con las doce
lecciones de los auditores de la Etapa 5), y el cierre lo hacen otros: un auditor que rehace todas las cuentas por otro
camino y dos lectores en frío que solo ven capturas (`cierre-delegado.md`, `lector-delegado.md`). Todos los agentes
corrieron en Opus 5.5 (Gerson, 19 nov).

## Las nueve unidades (ocho del árbol; una nació al partir)

| Unidad | Ideas | Práctica nueva | Estado |
| --- | --- | --- | --- |
| aritmetica.numeros-primos-y-divisores | 6 | primos-divisores (por idea) | calidad 2 |
| algebra.division-de-polinomios | 6 | division-practica | calidad 2 |
| geometria.poligonos-y-cuadrilateros | 6 | geo-poligonos-cuadrilateros | calidad 2 |
| fisica.estatica | 6 | fis-estatica | calidad 2 |
| quimica.enlace-quimico (partida) | 5 | enlace-lewis | calidad 2 |
| quimica.geometria-molecular (nueva) | 4 | geometria-fuerzas | calidad 2 |
| trigonometria.longitud-de-arco-y-sector | 5 | trig-arco-sector | ver abajo |
| razonamiento-matematico.verdades-y-mentiras | 6 | rm-verdades | calidad 2 |
| razonamiento-verbal.analogias | 5 | analogias | calidad 2 |

Informes en `rutinas/auditoria/<unidad>.md` y `rutinas/frio/<unidad>.md`.

## Decisiones generales de la etapa
- **Partir Enlace químico** (9 ideas): Enlace químico (conserva el id) + Geometría molecular y fuerzas intermoleculares
  (`partidoEN`). Hidrocarburos y Líquidos y sólidos ahora piden Geometría molecular; «hibridación» se mudó allá.
- **Avance:** seis unidades conservaron los ids de sus ideas con otra Predice. Una predicción guardada sin huella se
  vuelve a preguntar una vez, y quien había terminado todas las ideas de antes conserva «Ya la estudié» si la unidad sumó
  ideas (`REHECHAS_E6` en `nucleo/avance.js`; Estática y Enlace tienen su bloque propio).
- **Prueba de animación:** las cinco misiones de Enlace son de buscar entre opciones; se excusan como las de Propiedades
  periódicas (un control que se mueve solo cumpliría la misión sin el alumno).
- **Herramientas:** `capturas-teoria.js` comprueba el catálogo antes de capturar y para si una pantalla muestra «No se
  pudo cargar el catálogo» (en esta etapa salieron 35 capturas del aviso); el validador dibuja con la pieza del dibujo,
  como la app; los símbolos de los átomos van en la letra con serifa de las ecuaciones (el cloro se leía «CI»).
- **Prueba del curso:** todas las formas ya tenían 10 pares; los ítems nuevos van a la reserva (qui-20/21, tri-12/13,
  rm-22/23, y los de cada propuesta).
- **Práctica de División:** MCD y MCM de polinomios salen de su práctica y su examen (son de Factorización).

## Para que Gerson mire primero (decididas por la sesión)
Cada propuesta y cada auditoría tiene su lista completa. Las que más cambian lo que ve el alumno:
1. **Enlace químico partido** en dos unidades; la EN pasa a turquesa en Enlace (en Propiedades periódicas era violeta),
   porque aquí el violeta es de los electrones. SO₂ y SO₃ con estructura de octeto (orden 3/2 y 4/3), como en las
   academias; el motor de la escena `enlace` los da con octeto expandido.
2. **Estática:** el rozamiento se dibuja con «f = ?» desde Lee, Juega y Predice (cambia la decisión 6 de la propuesta);
   las flechas pedidas van con largo fijo para que no se puedan medir.
3. **División de polinomios:** el 0 de la potencia que falta va en tinta (los dos lectores lo leyeron como cociente).
4. **Analogías:** el formato UNI de la hoja es una hipótesis (no hay examen de verbal UNI en el repo); la oración puente se
   arma con «unión + rasgo»; un solo nombre por relación, con el del catálogo entre paréntesis; códigos RVA1 a RVA8 como
   hipótesis.
5. **Verdades y mentiras:** lo generado lleva un solo par que se contradice (los ejemplos de examen con dos pares se
   quedan); la paleta de la rama sin verde ni carmín (naranja lo supuesto, turquesa lo que sale, violeta lo seguro).
6. **Longitud de arco:** la letra del arco es s (como en Física); θ en carmín en cualquier sistema (en Ángulo
   trigonométrico los radianes van en violeta).
7. **Números primos:** la tarjeta de nivel 1 de Wilson no trae el teorema en los Datos; el cartel de la rifa sin cordeles
   solo aquí.
8. **Dibujos de prueba** nuevos en todas las piezas de la etapa (el probador de conductividad, la rifa, el columpio, el
   limpiaparabrisas, las tarjetas VERAZ/MIENTE, el mural de la feria…): Gerson decide cuáles reemplaza.

## Pendientes que dejó la etapa
- `geo-objeto` (compartida con Segmentos, Triángulos y Congruencia): unos rótulos de Polígonos siguen junto a otro vértice
  (mototaxi con seis o más esquinas, el marco, algunos rombos).
- `nucleo/ecuacion.js`: la flechita de ΣF se corre en la regla del cuerpo rígido; una fracción apilada deja partir el
  renglón a su lado. Propuesta: que `ecuaciones-ancho.js` detecte cortes dentro de un paréntesis.
- App: el aire de unos 93 px entre la hoja y la pregunta en Predice de verbal (barra de la lupa y una caja `.te-lectura`
  vacía); los botones del valor inicial que salen ya marcados; las voces de acierto y error de verbal hablan de «el
  texto».
- Pieza para la caja de cartulina (División, teorema del resto) y respaldo plano de `quim-molecula-3d` apretado con
  flechas.
