# Reporte: teoría de Geometría (sesión paralela, 14 nov 2026)

Rama `teoria/geometria`, salida de `claude/awesome-einstein-ch5g9a`. Encargo: `rutinas/encargos/teoria-geometria.md`.
Compañera: Neri (nutria). Contrato: `docs/teoria.md`.

## Unidades hechas

| Unidad | Grado | Ideas | Estado | Temas cubiertos |
| --- | --- | --- | --- | --- |
| segmentos-y-angulos | 3 | 5 | completa | 6 de 6 |
| triangulos | 3 | 4 | completa | 5 de 5 |
| congruencia | 3 | 5 | completa | 5 de 5 |
| poligonos-y-cuadrilateros | 3 | 5 | completa | 5 de 5 |
| circunferencia | 3 | 6 | completa | 5 de 5 |
| razonamiento-con-figuras | 3 | 6 | completa | 4 de 4 |

(Se completa al terminar 4.º y 5.º.)

## Pieza nueva

`nucleo/kit/piezas/geo-figura.js` (+ `geo-figura.test.js`), con prefijo del curso.

- **Afirmación:** lo que se dibuja mide lo que dice el problema; la relación que se enseña se ve pegada a su objeto, y lo
  que la hipótesis no garantiza se dibuja distinto (discontinuo o en otro color).
- Dibuja a escala, con una sola escala y marco fijo (`vista`), puntos, segmentos y rectas recortadas al marco, regiones
  (con `fondo` opaco para apilar cubos), circunferencias, arcos, ángulos (cuadradito en 90°, arcos múltiples y
  `rayita` de igualdad), rayitas de igualdad y puntas de paralelismo en segmentos, curvas, rótulos y sólidos en
  proyección ortogonal (`tresD: { giro, alza }`) con aristas ocultas discontinuas. `desde`/`hasta` con `estado.corte`
  para la línea de tiempo. Trae `util` (polar, distancia, ángulo, pie de perpendicular, corte de rectas, área con signo,
  arcos muestreados) para que los archivos de teoría calculen sus datos (regla 1).
- Revisada renderizada a 340–360 px en claro, en grises (filtro) y en oscuro dentro de la app.
- Única excepción de color: `fill="var(--card)"` en las caras con `fondo`, para tapar lo que queda detrás. La prueba de
  la pieza la admite de forma explícita.
