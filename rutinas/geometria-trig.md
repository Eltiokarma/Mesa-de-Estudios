# Rutina de geometría y trigonometría (8 y 12 nov 2026)

Rama `rutina/geometria-trig`, creada desde `claude/awesome-wozniak-5etl1n` y con la principal mezclada el 12 nov. Encargo: llevar al 100 % la cobertura de geometría y trigonometría en la admisión real de San Marcos (`docs/datos/admision-unmsm.csv`). Regla 5: el CSV y los solucionarios solo sirvieron de mapa; todos los enunciados, números y soluciones son propios.

## Cobertura, contada en el CSV

| Curso | Antes («si» / total) | Después |
| --- | --- | --- |
| Geometría | 78 / 169 (91 «medio») | 169 / 169 |
| Trigonometría | 59 / 113 (54 «medio») | 113 / 113 |

Cambié 145 filas, solo de mis dos cursos y solo las columnas `cobertura` y `modulo` (comprobado con un script contra `HEAD`). No rehíce `docs/datos/admision-unmsm-tablas.md` para no chocar con las otras rutinas. Se rehace al integrar con `python3 -I herramientas/agregar_admision.py docs/datos/admision-unmsm.csv docs/datos/admision-unmsm.csv docs/datos/admision-unmsm-tablas.md`.

Filas por módulo nuevo: geo-revolucion 18, trig-angulos-verticales 13, geo-areas-triangulares 11, geo-relaciones-metricas 11, trig-identidades 10, geo-triangulos-notables 9, geo-proporcionalidad 9, geo-areas-circulares 9, geo-poligonos 8, trig-ecuaciones 8, trig-oblicuangulos 8, trig-extremos 8, geo-troncos-prismas 6, geo-circunferencia-metrica 6, geo-analitica 5, trig-inversas 5 y trig-polares 1.

## Qué construí

**17 generadores de formato «predicciones»**, porque casi todos los huecos eran tipos paramétricos. Cada uno trae:
- `generador.js` con `calc` exportado y una cabecera que describe cada tipo y cada campo de `_datos`;
- `casos.json` verificado a ciegas;
- `papel.json` con 6 a 9 problemas propios, verificados contra `calc`;
- `generador.test.js` con:
  - `probarGenerador` sobre 600 semillas, con un recálculo independiente por otro camino (coordenadas, bisección, integración numérica, fuerza bruta, Pappus);
  - `probarFugas` (ver «Núcleo»);
  - casos y papel, y que salgan todos los subtipos.

Están en `catalogo/cursos/geometria.json` y `catalogo/cursos/trigonometria.json`, detrás de la escena de cada unidad.

| Módulo | Título | Unidades | Casos | Papel | Pruebas |
| --- | --- | --- | --- | --- | --- |
| `geo-revolucion` | Sólidos de revolución: troncos, regiones que giran y esferas | solidos-de-revolucion | 25 | 9 | 31 |
| `geo-troncos-prismas` | Troncos de pirámide, prismas oblicuos y troncos de prisma | prisma-y-piramide | 20 | 8 | 26 |
| `geo-relaciones-metricas` | Relaciones métricas en triángulos y cuadriláteros | relaciones-metricas | 25 | 9 | 41 |
| `geo-circunferencia-metrica` | Relaciones métricas en la circunferencia | circunferencia, relaciones-metricas | 24 | 8 | 39 |
| `geo-areas-circulares` | Coronas, sectores y regiones con arcos | longitud-y-areas-circulares, longitud-de-arco-y-sector | 24 | 8 | 29 |
| `geo-areas-triangulares` | Áreas de triángulos y polígonos por partes | areas-poligonales | 23 | 8 | 28 |
| `geo-proporcionalidad` | Paralelas, bisectrices y semejanza | proporcionalidad-y-semejanza, geometria-del-espacio | 22 | 8 | 37 |
| `geo-triangulos-notables` | Lados posibles y ángulos en los puntos notables | triangulos, puntos-notables | 25 | 8 | 40 |
| `geo-poligonos` | Polígonos regulares, trapecios y cuadriláteros | poligonos-y-cuadrilateros, poligonos-regulares | 25 | 8 | 39 |
| `geo-analitica` | Geometría analítica: baricentro, rectas, elipse y parábolas | geometria-analitica | 22 | 7 | 35 |
| `trig-angulos-verticales` | Ángulos verticales: dos visuales a la vez | triangulos-rectangulos, arcos-compuestos | 25 | 8 | 39 |
| `trig-oblicuangulos` | Triángulos oblicuángulos: cosenos, senos, tangentes y áreas | triangulos-oblicuangulos, areas-y-lineas-notables, reduccion-al-primer-cuadrante | 25 | 8 | 40 |
| `trig-ecuaciones` | Ecuaciones trigonométricas en un intervalo | ecuaciones-trigonometricas | 25 | 8 | 38 |
| `trig-extremos` | Máximos, mínimos y rangos trigonométricos | funciones-trigonometricas, circunferencia-trigonometrica, identidades-fundamentales | 25 | 8 | 38 |
| `trig-identidades` | Ángulo doble, triple y condiciones entre ángulos | arcos-multiples, arcos-compuestos, identidades-fundamentales | 24 | 9 | 30 |
| `trig-inversas` | Funciones trigonométricas inversas: rangos, sumas y gráficas | funciones-trigonometricas-inversas | 25 | 9 | 31 |
| `trig-polares` | De cartesianas a polares y al revés | coordenadas-polares-y-complejos | 22 | 6 | 35 |

**Escena `solidos` 0.2.0**, pestaña «Troncos y esferas», con 5 pasos y una predicción que bloquea el avance en cada uno:
- el vaso llenado hasta la mitad de su altura (k³ y el radio intermedio);
- la bola que sube el agua (Δh = V/πR²);
- el trapecio rectángulo que gira sobre cualquiera de sus tres lados;
- el globo inscrito en un cono;
- el casquete de Arquímedes.

El motor trae funciones nuevas (`troncoLlenado`, `desplazamiento`, `revolucionTrapecio`, `esferaInscritaCono`, `casquete`, `girarPerfil`, `nivelTronco` y `nivelConEsfera`), 5 casos nuevos verificados a ciegas y 51 pruebas. En papel cambiaron p4, p6 y p7. Color nuevo: `--c-rho` (#572c0f en claro y #f98806 en oscuro, AA de sobra), solo para ρ. Queda a ΔE00 7 del naranja de A_B en oscuro, pero nunca salen juntos. **Al integrar:** agregarlo a `docs/diseno.md` y correr `npm run catalogo` por la versión 0.2.0.

## Método

Cada pieza pasó por cuatro manos: constructor, verificador a ciegas, revisor de contenido y correcciones. El verificador resolvía desde el enunciado visible, con solo la cabecera.
- **Verificaciones:** todos los `casos.json` tienen su texto de `verificacion` y no quedó ninguna discrepancia abierta. Cuando una corrección cambió casos, la verificación se rehízo, a veces dos o tres veces.
- **Salvedades:** en `trig-polares` la segunda verificación no fue del todo a ciegas; está dicho en su `casos.json`, y la primera, que sí lo fue, cuadró 22 de 22. En `solidos`, la verificación del caso 21 encontró un error mal definido: con el eje perpendicular, el «rectángulo completo» valía 90π (era el de otro eje). Ahora vale 300π.
- **Revisiones:** los 17 generadores y la escena tuvieron revisión de contenido, y todos los hallazgos graves y medios están aplicados. Los graves fueron:
  - geometría mal descrita en el hexágono equiángulo, en dos generadores (los números estaban bien, el texto no);
  - «null» en pantalla en `trig-identidades`;
  - explicaciones que no daban el valor de su alternativa;
  - y, sobre todo, correctas que se adivinaban sin resolver (ver «Núcleo»).
- **Playwright:** `rutinas/geometria-trig/pw.js` recorre los 17 generadores a 390 y 1366 px, en claro y en oscuro. Responde la prueba de entrada y un problema de práctica, y comprueba que no haya errores de consola, desborde horizontal, «null», «NaN» ni «undefined», solución visible antes de elegir, ni una cabecera que contenga una alternativa. Resultado: todo bien. La escena `solidos` se probó aparte, con y sin movimiento reducido, también al redimensionar.
- **`npm test`:** 5760 en verde. Solo falla «app/datos/catalogo.json está al día», que se arregla con `npm run catalogo` al integrar. `herramientas/alternativas.test.js` pasa con mis generadores.

**Distractores.** Salen de las trampas de `docs/clasificacion/trampas-admision-unmsm/geometria-trigonometria.md`:
- escala lineal en vez de k² o k³;
- radio por diámetro;
- falta el 1/3;
- el valor límite que una desigualdad estricta excluye;
- la raíz extraña o fuera del intervalo;
- el signo por cuadrante;
- a + b como máximo;
- suma de cotangentes por diferencia.

Los respaldos son `parcial` solo donde el informe trae ese error: GE1, GE2, GE7, GE8, GE11 y TR9, TR11, TR12, TR16, TR21, CP3. Los demás van como hipótesis, con códigos nuevos por prefijo:
- **Geometría:** GE-tronco-*, GE-llenado-*, GE-desplaza-*, GE-gira-*, GE-casquete-*, GE-inscrita-*, GE-tercio-de-mas, RM-*, CM-*, GE-circ-*, GE-tri-*, GP-*, GT-*, EQ, AR, PO, HX, TP, CE, RO, CS y GA-*.
- **Trigonometría:** AV-*, OB-*, TE-*, TX-*, TRI-*, INV-* y TP-*.
- **Combinaciones:** los errores dobles se marcan «A+B».

## Cambios en núcleos compartidos (mínimos y compatibles, con pruebas)

`nucleo/probar-generador.js`:
1. **Texto roto.** `probarGenerador` ahora falla si el texto que ve el alumno (enunciado, pregunta, solución, alternativas o explicaciones) muestra «null», «NaN» o «undefined». Lo pasan todos los generadores de todas las rutinas.
2. **`probarFugas(gen, opciones)`, opcional.** Falla si, en algún grupo tipo/sub con al menos 15 problemas en 1500 semillas, la correcta:
   - es la alternativa «central», la que comparte más rasgos con las demás, en más del 40 %;
   - o, con respuesta numérica, es la mayor o la menor en más del 75 %.

   Exporta también `medirFugas` y `distancia`, con pruebas en `nucleo/probar-generador.test.js`. Ningún generador ajeno lo usa todavía; los 17 míos sí, sin excluir grupos. Lo saqué porque aparecían patrones que delatan sin resolver: en conteos con enteros la correcta era siempre la menor, en respuestas simbólicas siempre la central, en sombreadas siempre la mayor o la menor. **Sugerencia para las otras rutinas:** medir sus generadores con `medirFugas` y, si pasan, agregar `probarFugas` a su test.

## Lo que queda

- **Al integrar:**
  - `npm run catalogo` y subir `VERSION` en `app/sw.js`;
  - rehacer las tablas del CSV;
  - el color `--c-rho` en `docs/diseno.md`;
  - `docs/pendientes.md`, la hoja de ruta y `CLAUDE.md`.
- **Salvedades de cobertura** (marcadas «si» porque el tipo practica lo que pide el problema, aunque no es igual):
  - 2026-II #44 (trig-inversas): el examen pide elegir una gráfica de arctan. La práctica, sin figuras, pide su rango y si crece o decrece.
  - 2023-I #36 del 11 dic (geo-revolucion): el líquido inclinado está en un vaso cilíndrico, no troncocónico.
  - 2027-I #36 (geo-troncos-prismas): la condición del lado mínimo («perímetro mayor que P0») es nuestra.
  - 2020-I #41 (geo-proporcionalidad): rombo por el incentro, sin haber visto la figura original.
- **Menores:**
  - en `trig-oblicuangulos` la semilla 3039 de `casos.json` repite el problema de `entrada-1`;
  - en `geo-troncos-prismas`, el hueco con dato «lateral» no comprueba que el cilindro quepa en la base menor;
  - en tres grupos de trigonometría la correcta casi nunca es la mayor ni la menor (`tangente/menor` e `interseccion/ordenada` con 0 % de extremo, `mitad-cima/mitad` con 10 %), y `probarFugas` solo pone techo. Se podría agregar un piso.
- **Limpieza:** queda un `git stash@{0}` local, de un subagente del 8 nov. Todo su contenido ya está en la rama; se puede borrar.
