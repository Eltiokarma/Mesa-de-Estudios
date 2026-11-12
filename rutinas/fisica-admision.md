# Rutina de física para la admisión de San Marcos: reporte

Rama `rutina/fisica-admision`, sacada de `claude/awesome-wozniak-5etl1n` el 8 nov 2026, con una pausa por límite de uso del 8 al 12 nov. El 12 nov se hizo merge de la principal.

La meta era que toda pregunta de física de `docs/datos/admision-unmsm.csv` con cobertura «medio» o «no» quedara en «si». Se cumplió en 106 de 107; la que falta quedó fuera a propósito (ver «Lo que queda»).

Sobre la regla 5: no se abrió ningún PDF. Las columnas FALTA y RESUMEN del CSV sirvieron solo como mapa. Todos los enunciados, números y contextos son propios.

Cada pieza pasó por constructor, verificador a ciegas con revisor de contenido y correcciones al mismo constructor (`docs/metodo/`). Los briefs, la lista de huecos por lote y los scripts de trabajo están en `rutinas/fisica-admision-trabajo/`:
- `ciego.js` arma lo que ve el verificador, sin claves;
- `csvset.py` marca las filas del CSV.

## Cobertura de física en el CSV

| | si | medio | Total |
| --- | --- | --- | --- |
| Antes (8 nov) | 170 | 107 | 277 |
| Después (12 nov) | 276 | 1 | 277 |

Al marcar una fila como cubierta, su columna `falta` queda vacía y `modulo` pasa al id nuevo. Solo se tocaron filas de física.

## Qué se construyó

Son 18 generadores nuevos de formato «predicciones», todos en estado borrador y versión 0.1.0, más pestañas nuevas en dos escenas. Cada generador trae:
- `casos.json`, de 13 a 16 casos, verificados a ciegas;
- `papel.json`, de 7 a 9 problemas, con prueba que recalcula cada `verificar`;
- un recálculo independiente en 600 semillas, hecho por otro camino: simulación, bisección, motor nodal o Fermat.

Ninguna correcta sale de una cuenta de un modelo de lenguaje.

| Generador | Título | Unidades | Filas cubiertas | Qué genera |
| --- | --- | --- | --- | --- |
| `circuitos-mallas` | Dos pilas y una malla | corriente-y-circuitos | 7 | Kirchhoff con 2 o 3 pilas (rama, potencia, ddp con signo, fem, pila que entrega o se carga), puentes equilibrados y no equilibrados, pilas reales y la gráfica I–R |
| `circuitos-joule` | El foco que calienta | corriente-y-circuitos | 8 | Joule en J, kJ, kW·h y cal; hervidor con eficiencia; resistividad (diámetro, mm², estirado, doblado); cables de extensión; Q = I·t |
| `fluidos-hidrodinamica` | La manguera y el caño | fluidos | 9 | Caudal, continuidad, Bernoulli horizontal y en subida, Torricelli con el chorro (tan θ de llegada), densidad frente a peso específico, barómetro por ciudad con densidad media de 1 kg/m³ |
| `refraccion-snell` | El rayo que cambia de medio | optica-geometrica, ondas-electromagneticas | 4 | Snell (también desde la superficie), dos ensayos, f y λ al cambiar de medio, ángulo límite, ¿sale o no sale?, círculo de luz y profundidad aparente |
| `relatividad` | El reloj que viaja | fisica-moderna | 6 | Dilatación del tiempo, contracción, energías relativistas, Heisenberg y esfera cargada por efecto fotoeléctrico |
| `energia-potencia` | La bomba y el ascensor | trabajo-y-energia | 10 | P = Fv (con roce, en subida, con eficiencia), grúa y escaleras, bomba en kW y HP, ascensor por pisos, rebotes con pérdidas y trabajo con la cuerda |
| `mas-horaria` | La ecuación del resorte | oscilaciones | 5 | Leer y escribir x = A·sen(ωt + φ), instante, velocidad media, bloque apilado y flotador |
| `dinamica-fuerzas` | La plataforma que gira | dinamica, estatica, gravitacion | 9 | Roce como centrípeta, ruedas motrices, peralte, cuenco y embudo, otro astro, resorte entre bloques, tabla de cajas, escalera y fuerza gravitatoria neta o nula |
| `calor-escalas` | El termómetro de la chacra | temperatura-y-calor | 8 | Escalas (también una inventada), coincidencias, variaciones, catarata, dilatación de tanque, aparente y densidad, y sudor con calor latente |
| `condensadores` | Condensadores en fila y en paralelo | electrostatica | 7 | Serie, paralelo y mixtos con palabras, n iguales, ½CV², eficiencia y condensador plano |
| `cargas-sistema` | Tres cargas en el plano | electrostatica | 3 | Energía de 2 a 4 cargas, razón para energía nula, gráfica V–r y campo en el cubo |
| `cinematica-medias` | El viaje en tramos | movimiento-rectilineo, movimiento-parabolico-y-circular | 8 | Rapidez media por tramos (armónica y aritmética), ida y vuelta, tiempo mínimo en v–t, x(t) del MRUV, x(t) e y(t) del tiro, latitud |
| `velocidad-relativa` | La combi y el río | movimiento-rectilineo, magnitudes-y-vectores, impulso-y-choques | 4 | Marcos, ida y vuelta relativas, cruces, bote en el río (también con respuesta en texto) y sacos lanzados entre uno, dos o tres botes |
| `carga-en-campo` | La carga que gira en el imán | magnetismo | 8 | r y T de una carga en B, hélice, espectrómetro, campos cruzados, riel con Ohm y espira con Ohm |
| `induccion-flujo` | El flujo que va y vuelve | induccion-electromagnetica | 2 | Carga inducida al invertir, Φ(t) armónico, fem máxima y media, rpm |
| `ondas-llegadas` | El temblor y el trueno | ondas-mecanicas | 4 | Diferencia de llegadas (sismo, trueno, riel), λ en otro medio, k y ω en y(x,t) y proposiciones sobre las partículas |
| `impulso-grafica` | La patada en la gráfica | impulso-y-choques | 3 | Área F–t por vértices, trabajo con v0 ≠ 0 y rebote con e y pérdida en el aire |
| `analisis-dimensional` | La balanza de dimensiones | magnitudes-y-vectores | 1 | Exponentes, dimensión de constantes y proposiciones de homogeneidad |

### Escenas

- **`fluidos` 0.2.0**, pestaña «El tubo con estrechamiento»:
  - Se arrastra el radio de la parte angosta. Las partículas corren más rápido en lo angosto y hay dos tubitos manométricos.
  - Tiene dos predicciones que bloquean: la rapidez en lo angosto y en qué tubito sube más el agua. La trampa «más rapidez, más presión» va como distractor.
  - Motor: `caudal`, `torricelli` y `estrechamiento`. `continuidad` también acepta radios.
- **`ondas-electromagneticas` 0.2.0**, pestaña «El rayo que cambia de medio»:
  - El rayo se orienta arrastrando. Pasado el ángulo límite queda solo la reflexión total.
  - Tiene dos predicciones que bloquean: del agua al aire a 37° y a 50°.
  - Motor: `snell` y `anguloLimite`, con Fresnel para el porcentaje reflejado.
  - Ahora también aparece en `fisica.optica-geometrica`.
- **Las dos escenas** pasaron:
  - `pasada-pegatina.py` y `pasada-celular.py`;
  - Playwright a 390×844 y 1366×768, en claro y oscuro, con y sin movimiento reducido: cero errores de consola, sin desbordes, la predicción bloquea y la cabecera no regala la respuesta.

### Comprobado

- **Verificación a ciegas.** No hubo ninguna discrepancia de letra ni de valor en ninguna pieza:

  | Pieza | Coincidencias |
  | --- | --- |
  | circuitos | 45/45 y 46/46 |
  | fluidos | 46/46, más los 6 casos del motor |
  | dinámica | 46/46 |
  | calor | 46/46 |
  | potencia | 46/46 |
  | MAS | 46/46 |
  | refracción | 44/44, más 44 campos del motor |
  | relatividad | 43/43 |
  | condensadores | 46/46 |
  | cargas | 44/44 |
  | cinemática | 46/46 |
  | relativa | 46/46 |
  | magnetismo | 46/46 |
  | inducción | 46/46 |
  | ondas | 43/43 |
  | impulso | 43/43 |
  | dimensiones | 44/44 |

  Los `casos.json` que se regeneraron tras las correcciones se volvieron a resolver a ciegas el 12 nov: 260 de 260, y los de circuitos y fluidos otra vez tras el último ajuste: 48 de 48.
- **Revisión de contenido.** Se corrigió todo lo grave y lo medio. Lo que más se repitió:
  - la correcta delatada por su forma (la única redonda, la única con π, el arcsen que nunca era correcto);
  - distractores absurdos;
  - respaldos «parcial» o «documentado» que la fuente no sostenía, que se bajaron a hipótesis;
  - explicaciones que no correspondían a su número;
  - datos irreales, como un acrílico con n = 2 o un núcleo más liviano que un protón.
- **Reglas que quedaron como pruebas** en cada `generador.test.js`:
  - no lanza en las semillas 0 a 2000 ni en semillas de texto;
  - las incorrectas quedan entre 1/20 y 20 veces la correcta (en Joule, la mayor alternativa no llega a 60 veces la menor);
  - la correcta casi nunca es la única redonda, con un tope por generador;
  - formato parejo dentro de cada problema;
  - ids de error únicos;
  - variedad de datos.
- **App real.** Se probó con Playwright sobre una copia con el catálogo armado, a 390 y 1366 px: los 18 generadores cargan con 4 o 5 alternativas, sin desbordes ni errores de consola, y la cabecera no repite ninguna alternativa.
- **`herramientas/alternativas.test.js`**: 58 de 58.
- **`npm test`**: 5618 de 5619. Falla solo «app/datos/catalogo.json está al día», porque esta rutina no corre `npm run catalogo`.

## Códigos de error

- **Nuevos transversales**, en `docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md`. Todos son hipótesis:
  - U1 a U8, unidades sin convertir;
  - PR1 a PR7, proporcionalidad mal escalada: falta el cuadrado, la raíz o el ½, proporción invertida, n frente a n², diámetro como radio, periodo frente a frecuencia.

  Los generadores los usan con sufijo (`U2-mA`, `PR6-diametro`) para que la medición los junte en toda la física.
- **Por tema**, también hipótesis y declarados en la cabecera de cada generador: KIR-, PU-, PI-, JO-, RES-, CAB-, CAP-, CS-, FH-, R-, REL-, HE-, EP-, MAS-, DF-, ES-, GR-, CE-, MED-, REL-V-, CHO-, MG-, IN-, LL-, IG-, AD-.
- **Con respaldo «parcial» o «documentado»** quedaron solo los que la fuente sostiene, revisados por el verificador al abrir la fuente:
  - C6 (documentado);
  - G1 (documentado, citado a momento-gravitacion-ondas);
  - C11, C12, W15, F3, F8, R1 a R5 (solo cuando un medio es aire), ON5, G2, G4, G8, M2, M8, E8, E10, MG10 y CAP-como-resistencia en serie (parcial).

## Cambios en núcleos compartidos

Ninguno: no se tocó `nucleo/`. Tampoco se tocaron `app/` ni `VERSION`.

## Para integrar

1. Ya se agregaron los 18 ids a las unidades de `catalogo/cursos/fisica.json`, y `ondas-electromagneticas` a `fisica.optica-geometrica`. Falta correr `npm run catalogo` y subir `VERSION` en `app/sw.js`.
2. Colores nuevos para `docs/diseno.md`. Pasan ΔE00 ≥ 20 contra los otros colores de su escena y AA sobre el papel y el chip.

   | Escena | Variable | Claro | Oscuro |
   | --- | --- | --- | --- |
   | fluidos (tubo) | rapidez del agua v | granate `#57120f` | `#fabea3` |
   | ondas-electromagneticas (rayo) | ángulo de incidencia i (y de reflexión) | `#80004c` | `#fdaaec` |
   | ondas-electromagneticas (rayo) | ángulo de refracción r | `#571a0f` | `#f95a24` |

   El ángulo límite L va en tinta, con raya cortada. Los generadores usan solo las letras de color que ya existían: o, i y h para los datos, y d para lo que se pide.
3. Los 18 generadores cuentan para la prueba de entrada y salida de física. Si el banco exige rebalanceo por número de plantillas, hay que revisar `catalogo/pruebas/fisica.json`.

## Lo que queda

- **Masa efectiva del resorte** (unmsm-2023-II-solucionario-2023-04-02 #82): sigue en «medio», a propósito. La nota del CSV dice que la clave de la academia ignora la masa del resorte, y el modelo m/3 no está en los temarios de la UNI ni de San Marcos. Gerson decide si se cubre.
- **Trampas de unidades que se perdieron por la regla de ×20.** Siguen como paso de la solución y con versiones de factor 10 donde son creíbles:
  - mT sin convertir (factor 1000, 2027-I #84);
  - cm² entre 100 en el condensador plano (2025-I #84);
  - sumar 273 a una variación (calor);
  - g por kg;
  - minutos sin pasar a segundos en Joule (factor 60): queda la versión «100 s por minuto».

  Si Gerson quiere esos distractores tal como salen en el examen, hay que hacerles una excepción a la regla, con su prueba.
- **Coberturas «en espíritu»:**
  - triplicar el coeficiente lineal (2021-09-04 #84) se trabaja en un tanque sólido y no con el líquido, porque la clave del examen no tiene sentido físico;
  - el «vector velocidad» de Torricelli (2026-I #83) se pide como rapidez y tan θ, no en componentes.
- **Ajuste final de escala y redondez (12 nov), ya hecho:** en `fluidos-hidrodinamica` y `circuitos-mallas` la correcta ya no es nunca la única redonda (0 %), y no queda ningún distractor fuera de escala.
- **Variedad limitada:** `analisis-dimensional` repite unos 160 problemas de 600, por lo chico del banco de fórmulas, y latitud tiene 12 lugares.
