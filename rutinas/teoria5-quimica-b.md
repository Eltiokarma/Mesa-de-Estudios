# Ronda 5, química animada (parte B): reporte

**Rama:** `teoria5/quimica-b` · **Fecha:** 15 nov 2026 · **Encargo:** `rutinas/encargos/teoria5-quimica-b.md`.

Diez unidades: cada idea se anima sola al abrir (control con `auto`), la lectura muestra los números del momento, «⏸ Pausa» la congela, arrastrar o tocar el control pausa, y con movimiento reducido arranca quieta. La primera mesa de cada laboratorio quedó animada. No se cambió ninguna pregunta de «Predice», ni «Mira», «La regla» ni «Ahora tú».

**Cómo se comprobó:** `npm run catalogo`, `node --test contenido/teoria/teoria.test.js 'nucleo/**/*.test.js'` y `npm test` en verde; recorrido con `rutinas/teoria5-quimica-b/pw-anim.js` (Playwright, 360 × 780, swiftshader) en cada idea y en la primera mesa: hay pausa, la lectura y la figura cambian solas en 700 ms, la pausa congela, con `reducedMotion: 'reduce'` arranca quieta, sin desborde. Alumno de prueba en `lab-v1`: `uni: 'unmsm'`, `grado: '5'`. Capturas miradas.

## Pieza común: `quim-particulas`

- Campo opcional nuevo `agita: t` (y `agitaAmp`, px): cada partícula tiembla alrededor de su casilla con fase y frecuencia propias sacadas del hash (puro de los datos, sin reloj). Sin el campo, el dibujo es idéntico al de antes. Prueba nueva en `quim-particulas.test.js` (mismo número de partículas, pura, alto igual, amplitud acotada).
- **Aviso a la sesión A:** si en `gases` o `liquidos-y-solidos` agregaste un campo parecido, son independientes; `agita` solo se activa si la unidad lo pasa.

## Por unidad

### soluciones (0.2.0)
| Idea | Qué se anima | Control |
| --- | --- | --- |
| Solución, coloide o suspensión | Una hora de reposo en 6 s: los grumos de la suspensión caen a rapidez constante y tocan fondo a los 30 min; iones y coloide solo tiemblan | `t` (0–60 min, `auto` 10 min/s); reemplaza al botón «Reposo», que el tiempo volvía redundante |
| Cuánto cabe en el agua | La temperatura sube y baja sola; el punto cruza la curva del KNO₃ y una raya roja marca lo que sobra | `T` con `auto` `rebota` |
| Concentración | El volumen sube y baja con las mismas bolitas; c cambia en la lectura | `v` con `auto` `rebota` |
| Diluir no es retirar | El agua entra sola de 100 a 250 mL, una y otra vez | `v` con `auto` |
| Reaccionar en solución | La base cae sola; cada par H⁺–OH⁻ se vuelve agua cuando se completa | `v` (mL de NaOH) con `auto` |

- **Mesa «Mezcla dos soluciones»** (primera): control `t` nuevo. Las bolitas de A empiezan en su lado del tercer vaso y las de B en el otro, y se mezclan solas (fracción 1 − e^(−t/1,2), modelo cualitativo de difusión). Reto nuevo de pausa: «Pausa la mezcla cuando ya esté casi pareja: más del 95 % mezclado», comprobado con la misma función que mueve las bolitas.
- Modelos cualitativos declarados en comentarios: los 30 min de asentamiento y la curva de mezcla.
