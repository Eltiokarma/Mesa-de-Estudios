# Esquema de clasificación de preguntas (física y química, simulacros UNMSM)

Una línea JSON por pregunta de física o de química, en el archivo de salida que te asignen (JSONL, UTF-8). Campos:

| Campo | Valores |
| --- | --- |
| `periodo` | "2022-II", "2023-II", ... (de la carpeta) |
| `area` | "A", "B", "C", "D", "E" (para el PDF "SIN RESOLVER" de 2022-II, la que diga la carátula, o "?" si no se sabe) |
| `archivo` | nombre del PDF |
| `numero` | número de la pregunta en el examen (entero) |
| `pagina` | página del PDF donde está (entero, 1 = primera) |
| `curso` | "fisica" o "quimica" |
| `tema_temario` | número de tema del temario CEPRE-UNMSM 2026-I (1 a 18), ver lista abajo |
| `plantilla` | una de la lista de abajo (la que mejor la cubra) |
| `tipo` | "calculo" (pide un número), "conceptual" (V/F, qué pasa si, cuál es correcta, sin cuentas), "grafica" (leer o construir una gráfica), "mixta" |
| `figura` | true si la pregunta depende de una figura, false si no |
| `visual` | "alto" (una escena animada ayudaría mucho a pasar del enunciado al modelo), "medio", "bajo" (memoria, definiciones, nomenclatura) |
| `resumen` | descripción PROPIA, máximo 20 palabras, sin copiar el enunciado. Ejemplo: "Bloque en plano inclinado con roce; hallar aceleración" |
| `datos_clave` | los números o condiciones físicas que definen el problema, en tus palabras (ejemplo: "θ=37°, μ=0,5, m=10 kg") o "" |
| `inicio` | las primeras 8 palabras del enunciado tal como salen del OCR (solo para detectar preguntas repetidas entre áreas; no se publica) |
| `ocr` | "ok" (se entiende con el texto), "imagen" (tuviste que mirar la página como imagen), "ilegible" |
| `nota` | cualquier observación breve, o "" |

## Temas del temario de física (CEPRE-UNMSM 2026-I)
1 magnitudes, análisis dimensional, vectores · 2 MRU, gráficas, velocidad relativa · 3 MRUV, gráficas, caída libre · 4 parabólico, MCU, MCUV · 5 leyes de Newton, rozamiento, dinámica rectilínea y circular · 6 equilibrio, fuerza elástica, torque · 7 trabajo, potencia, energía · 8 cantidad de movimiento, choques, gravitación, Kepler · 9 hidrostática, Pascal, Arquímedes, tensión superficial, caudal, Bernoulli · 10 temperatura, dilatación, calorimetría, cambios de fase · 11 carga, Coulomb, campo eléctrico · 12 potencial, condensadores · 13 corriente, Ohm, circuitos, potencia eléctrica · 14 campo magnético, fuerza magnética · 15 inducción, Faraday, Lenz, transformador · 16 MAS, péndulo, ondas, sonido · 17 ondas EM, reflexión, refracción, espejos, lentes · 18 relatividad, Planck, fotoeléctrico, rayos X, láser

## Temas del temario de química (CEPRE-UNMSM 2026-I)
1 materia, mezclas, SI, calor · 2 átomo, números cuánticos, configuración, tabla periódica · 3 enlace, fuerzas intermoleculares · 4 nomenclatura I, mol, masa molar · 5 nomenclatura II, composición, fórmula empírica · 6 reacciones, balance, redox, estequiometría, limitante, rendimiento · 7 electroquímica · 8 gases, líquidos, sólidos · 9 soluciones, concentración · 10 cinética, equilibrio, Le Chatelier · 11 ácidos, bases, pH · 12-16 química orgánica · 17 recursos naturales, metalurgia · 18 contaminación, agua

## Plantillas (elige una)
Física: `vectores`, `analisis_dimensional`, `mru_encuentros`, `mruv_graficas`, `caida_libre_vertical`, `tiro_parabolico`, `movimiento_circular`, `dcl_plano_inclinado`, `poleas_sistemas`, `dinamica_circular`, `equilibrio_torque`, `resorte_elastica`, `energia_trabajo_potencia`, `choques_impulso`, `gravitacion_kepler`, `mas_resorte_pendulo`, `ondas_sonido`, `hidrostatica_flotacion`, `bernoulli_caudal`, `calorimetria_dilatacion`, `electrostatica_campo_potencial`, `condensadores`, `circuitos_cc`, `magnetismo_fuerza`, `induccion`, `reflexion_refraccion`, `espejos_esfericos`, `lente_delgada`, `fisica_moderna`, `otra_fisica`.
Química: `materia_mezclas`, `atomo_configuracion`, `tabla_periodica`, `enlace_geometria`, `nomenclatura`, `mol_composicion_formula`, `reacciones_balance_redox`, `estequiometria_limitante`, `gases_quimica`, `soluciones_concentracion`, `cinetica`, `equilibrio_lechatelier`, `acidos_bases_ph`, `electroquimica`, `organica`, `recursos_metalurgia`, `ambiente`, `otra_quimica`.

## Reglas
- Solo física y química. Biología no (aunque mencione fenómenos físicos o químicos). Si una pregunta de otro curso es claramente física (por ejemplo, en razonamiento matemático), no la incluyas.
- No inventes: si no puedes leer una pregunta, regístrala con `ocr: "ilegible"` y lo que sí sepas.
- Si un área no trae física ni química (puede pasar en las de humanidades o economía), escribe una sola línea `{"periodo":..., "area":..., "archivo":..., "sin_fisica_quimica": true}`.
