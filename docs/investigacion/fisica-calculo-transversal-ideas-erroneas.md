# Física: errores de cálculo transversales (unidades y proporcionalidad)

8 nov 2026, rutina de física para la admisión de San Marcos. Sale de las trampas 1, 2, 5 y 6 de `docs/clasificacion/trampas-admision-unmsm/fisica.md`, que se deducen del distractor que da el número de un error reconocible en unas 45 preguntas de admisión (2019-I a 2027-I). Ningún informe de `docs/investigacion/` los codificaba, porque los estudios de ideas erróneas miden conceptos, no cuentas.

**Respaldo: todos son hipótesis nuestras.** Sabemos que las academias ponen estos distractores (los vimos en los solucionarios), pero no hay un estudio que mida con qué frecuencia los eligen los postulantes. Los datos del colegio piloto lo dirán. En pantalla se dicen «hipótesis nuestra».

Los generadores y escenas de física usan estos códigos tal cual, o con un sufijo que diga el caso (`U1-kmh`, `PR2-raiz`), para que la medición los junte en todos los módulos.

## U: unidades sin convertir

| Código | Error | Ejemplos |
| --- | --- | --- |
| U1 | Usa km/h como si fueran m/s (o al revés: divide o multiplica por 3,6 en el sentido equivocado) | P = F·v con 72 km/h; caudal con la rapidez en km/h |
| U2 | No pasa un prefijo: kilo, mili, micro, nano, mega (kJ, mA, µF, nC, MHz, mT, ms) | energía de un condensador en µF tomada como F; corriente en mA |
| U3 | Áreas y volúmenes con el factor lineal: cm² → m² dividiendo entre 100, L ↔ m³ entre 100, mm² entre 1000 | resistividad con la sección en mm²; caudal en L/s |
| U4 | Masa en gramos donde va kilogramos (o al revés) | energía cinética con la masa en g |
| U5 | Calorías y joules mezclados (falta el 4,18 o se usa al revés) | equivalente mecánico del calor; Joule en calorías |
| U6 | Tiempo en minutos u horas donde va segundos | potencia en kW·h; carga Q = I·t con t en minutos |
| U7 | Frecuencia o rpm usadas como ω (falta el 2π, o el 60 en rpm) | ecuación del MAS con f en lugar de ω |
| U8 | Grados Celsius donde va kelvin (o una variación ΔT convertida sumando 273 o restando 32) | escalas termométricas, gases |

## PR: proporcionalidad mal escalada

| Código | Error | Ejemplos |
| --- | --- | --- |
| PR1 | Falta el cuadrado: trata como lineal lo que va con el cuadrado | energía cinética con v, energía del condensador con V, Joule con I, presión dinámica de Bernoulli con v, área de una sección con el radio |
| PR2 | Falta la raíz: trata como lineal lo que va con la raíz | periodo del péndulo con L, rapidez de Torricelli con h, periodo del resorte con m |
| PR3 | Falta el ½ (o se pone dos veces) | ½·m·v², ½·C·V², ½·k·x² |
| PR4 | Invierte la proporción: directa en lugar de inversa | resistencia con la sección, rapidez con el área del tubo, capacidad con la separación de las placas |
| PR5 | n en lugar de n² (o al revés) al juntar n piezas iguales | n resistencias o condensadores iguales en serie y luego en paralelo |
| PR6 | Diámetro usado como radio (el área sale 4 veces mayor) | caudal en un tubo, resistividad de un alambre, sección de un émbolo |
| PR7 | Confunde periodo con frecuencia, o medio periodo con periodo entero | MAS, ondas, carga en un campo magnético |

## Cómo se usan

- Cada opción incorrecta de un generador o escena de física que salga de estos errores lleva `respaldo: "hipotesis"` y `fuente: "docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md"`.
- La explicación dice qué conversión o qué potencia faltó y muestra la cuenta bien hecha.
- Si un error de cálculo no calza en esta lista, el módulo usa un código propio con prefijo del tema (por ejemplo `KIR-` en circuitos de dos fuentes) y lo deja como hipótesis en su cabecera.
