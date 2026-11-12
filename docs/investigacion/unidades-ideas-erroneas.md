# Unidades y magnitudes en todos los cursos

12 nov 2026, rutina unidades-notas. Decisión de Gerson: «es importante que el alumno no falle en unidades y magnitudes». Este informe extiende los códigos U1–U8 de física (`docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md`) a química, aritmética, geometría, trigonometría y razonamiento matemático.

**Respaldo: todos son hipótesis nuestras.** Salen de los distractores de los solucionarios de academia y de los exámenes de admisión (los mismos que en física: un número que solo se obtiene al no convertir). No hay un estudio que mida cuántos postulantes los eligen; los datos del colegio piloto lo dirán.

Los generadores usan el código con un sufijo que diga el caso (`QU1-gramos-como-kg`, `AU2-cm2-entre-100`, `RU1-base-100`), para que la medición los junte en todos los módulos.

## La regla de escala y su excepción

Las pruebas de los generadores botan los distractores que quedan fuera de 1/20 a 20 veces la correcta, porque un número absurdo no engaña a nadie. Las trampas de unidades son la excepción: un mT tomado como T da 1000 veces la correcta y aun así es lo que marca el postulante que no convierte. Por eso un distractor con código U1–U8, QU, AU o RU puede llegar a **1000 veces** la correcta (`P.enEscala` en `nucleo/predicciones.js`; `topeEscala` y `dentroDeEscala` en `nucleo/probar-generador.js`). `herramientas/trampas-unidades.test.js` exige que las trampas de cada generador de la lista salgan de verdad.

## QU: química

| Código | Error | Ejemplos |
| --- | --- | --- |
| QU1 | Masa en g, kg o mg sin convertir | densidad en g/cm³ con la masa en kg; los gramos que se dejan donde se piden kilogramos |
| QU2 | Volumen en mL, L, cm³ o m³ sin convertir, o con el factor lineal | molaridad con el volumen en mL; 1 L = 100 cm³; 1 m³ = 1000 cm³ |
| QU3 | Temperatura en °C donde va K (o el 273 con el signo cambiado) | gases con t en °C; restar 273 para pasar a kelvin |
| QU4 | Presión en mmHg o kPa donde va atm (falta el 760 o el 101,3) | PV = nRT con R = 0,082 y la presión en mmHg |

## AU: aritmética, álgebra, geometría y trigonometría

| Código | Error | Ejemplos |
| --- | --- | --- |
| AU1 | Longitud en cm, m o km sin convertir | perímetro en m con un lado en cm |
| AU2 | Área o volumen con el factor lineal: cm² → m² entre 100, cm³ → m³ entre 100 o 1000 | área de un terreno dibujado en cm pedida en m² |
| AU3 | Rapidez en km/h usada como m/s (o el 3,6 al revés) | distancia en m con la rapidez en km/h y el tiempo en s |
| AU4 | Tiempo en horas y minutos como si fuera decimal (1 h 30 min = 1,3 h) | velocidad media con un viaje de 2 h 15 min |

## RU: razonamiento matemático

| Código | Error | Ejemplos |
| --- | --- | --- |
| RU1 | Horas y minutos en base 100 (90 min = 1,9 h; 1,5 h = 1 h 50 min) | relojes, trenes que salen y llegan, turnos |
| RU2 | La respuesta en otra unidad que la que se pide (horas por minutos, metros por centímetros) | «¿cuántos minutos…?» respondido en horas |

## Dónde están

Ver la tabla del reporte `rutinas/unidades-notas.md`.
