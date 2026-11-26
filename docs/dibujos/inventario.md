# Inventario de dibujos de prueba (26 nov 2026)

Encargo: `docs/metodo/dibujos-reconocibles.md`, paso 1. Sale de `node herramientas/dibujos-objetos.js <carpeta> --json <salida>`,
que recorre la teoría (`contenido/teoria/`) y junta cada pareja pieza + objeto de las piezas con `data-prueba`.
«(sin objeto)»: la pieza dibuja una sola cosa y sus datos no llevan `objeto`. «Usos»: cuántas figuras de la teoría
(tarjetas, ejemplos, juego, mira, resuelve) dibujan ese objeto. En **negrita**, las piezas de la Etapa 9 (solo diagnóstico).

57 piezas con `data-prueba`; 55 se usan en la teoría (`fis-medida` y `rm-pruebas` no aparecen) y dibujan 185 objetos.
No existe la carpeta `nucleo/kit/objetos/`: los objetos viven en las piezas `*-objeto.js` (alg, fis, geo, quim, rm,
trig), que entran aquí como cualquier otra.

| Pieza | Objeto | Usos | Unidades (ideas) |
|---|---|---:|---|
| alg-caja | (sin objeto) | 2 | algebra.ecuaciones-polinomiales (viete) |
| alg-caja | caja | 8 | algebra.ecuaciones-polinomiales (viete, raices-racionales) |
| alg-losetas | (sin objeto) | 1 | algebra.polinomios (operaciones) |
| alg-losetas | casillero | 16 | algebra.polinomios (completo-ordenado, igualdad) |
| alg-losetas | deposito | 4 | algebra.polinomios (grados) |
| alg-losetas | giro | 4 | algebra.polinomios (terminos-semejantes) |
| alg-losetas | lote | 1 | algebra.polinomios (terminos-semejantes) |
| alg-losetas | medidas | 9 | algebra.polinomios (grados, completo-ordenado) |
| alg-losetas | pedido | 20 | algebra.division-de-polinomios (algoritmo); algebra.factorizacion (factor-comun, identidades, aspa-simple, mcd-mcm); algebra.polinomios (terminos-semejantes) |
| alg-losetas | piezas | 4 | algebra.polinomios (terminos-semejantes) |
| alg-losetas | piso | 5 | algebra.polinomios (operaciones) |
| alg-losetas | tamano | 14 | algebra.polinomios (valor-numerico, igualdad) |
| alg-objeto | (sin objeto) | 1 | algebra.productos-notables (suma-por-diferencia) |
| alg-objeto | caja | 10 | algebra.ecuaciones-polinomiales (binomica); algebra.exponentes-y-productos-notables (exponente-fraccionario) |
| alg-objeto | cometa | 4 | algebra.productos-notables (racionalizar) |
| alg-objeto | hoja | 8 | algebra.exponentes-y-productos-notables (leyes-exponentes) |
| alg-objeto | huertos | 13 | algebra.ecuaciones-polinomiales (conjugadas, cambio-de-variable); algebra.exponentes-y-productos-notables (radicales) |
| alg-objeto | mesa | 5 | algebra.productos-notables (radicales-dobles) |
| alg-objeto | taco | 10 | algebra.productos-notables (cubo-binomio) |
| alg-objeto | terreno | 10 | algebra.productos-notables (cuadrado-suma) |
| alg-objeto | triplay | 8 | algebra.productos-notables (suma-por-diferencia) |
| alg-reparto | (sin objeto) | 7 | algebra.division-de-polinomios (algoritmo); algebra.ecuaciones-polinomiales (raices-racionales); algebra.factorizacion (factor-comun, identidades, aspa-simple) |
| alg-reparto | angosto | 6 | algebra.division-de-polinomios (teorema-resto) |
| alg-reparto | cuaderno | 53 | algebra.division-de-polinomios (horner, ruffini, divisor-k, teorema-resto, cocientes-notables); algebra.ecuaciones-polinomiales (raices-racionales); algebra.factorizacion (teorema-factor) |
| alg-reparto | pasadizo | 26 | algebra.division-de-polinomios (algoritmo, divisor-k); algebra.ecuaciones-polinomiales (grado-raices); algebra.factorizacion (factor-comun, identidades, aspa-simple, mcd-mcm) |
| arit-arbol | (sin objeto) | 7 | aritmetica.numeros-primos-y-divisores (factorizacion) |
| arit-bandejas | (sin objeto) | 13 | aritmetica.numeros-primos-y-divisores (rectangulos, factorizacion, divisores) |
| arit-boleto | (sin objeto) | 10 | aritmetica.divisibilidad (criterios, criterios-pesos) |
| arit-boletos | (sin objeto) | 47 | aritmetica.divisibilidad (filas-de-m); aritmetica.mcd-y-mcm (mcm-coinciden, multiplos-tramo); aritmetica.numeros-primos-y-divisores (rectangulos, criba, euler) |
| **arit-calculadora** | (sin objeto) | 17 | algebra.division-de-polinomios (cocientes-notables); aritmetica.cuatro-operaciones (cifras-producto); aritmetica.numeros-racionales (exacto-periodico, generatriz) |
| **arit-calculadora** | cuaderno | 2 | algebra.division-de-polinomios (cocientes-notables) |
| arit-cintas | (sin objeto) | 27 | aritmetica.mcd-y-mcm (mcd-cintas, mcd-por-mcm, euclides) |
| arit-monedas | (sin objeto) | 8 | aritmetica.divisibilidad (diofanticas) |
| arit-puesto | (sin objeto) | 171 | aritmetica.cuatro-operaciones (otras-bases, prestamo, complemento, cifras-ocultas, multiplicar-partes, defecto-exceso); aritmetica.divisibilidad (filas-de-m, restos-suman, criterios, restos-potenciales); aritmetica.numeracion (agrupar, descomposicion, cambio-base, base-desconocida); aritmetica.numeros-primos-y-divisores (fermat-wilson) |
| arit-queque | (sin objeto) | 34 | aritmetica.numeros-racionales (equivalentes, orden-recta, del-resto, otras-bases) |
| arit-reparto | (sin objeto) | 10 | aritmetica.mcd-y-mcm (mismo-resto) |
| arit-talonario | (sin objeto) | 15 | aritmetica.numeracion (conteo-cifras) |
| fis-combi | (sin objeto) | 88 | fisica.magnitudes-y-vectores (unidades); fisica.movimiento-rectilineo (mru, grafica-xt, desplazamiento-distancia, encuentro); fisica.mruv-y-caida-libre (aceleracion, ecuaciones-mruv) |
| fis-dron | (sin objeto) | 5 | fisica.vectores (escalar-vector) |
| **fis-estatica** | (sin objeto) | 406 | fisica.dinamica (fuerza-neta-acelera, masa-y-peso, rozamiento-en-movimiento, plano-y-polea, ascensor-y-marcos, centripeta-es-resultante); fisica.estatica (diagrama-y-parejas, nudo-en-equilibrio, rozamiento-se-ajusta, resorte-proporcional, torque-y-brazo, cuerpo-rigido); fisica.trabajo-y-energia (trabajo-y-angulo, trabajo-energia-cinetica, energia-potencial, conservacion-energia, energia-y-rozamiento, potencia-y-eficiencia) |
| fis-fuerzas | avion | 2 | fisica.vectores (componentes, resultante) |
| fis-fuerzas | bote | 2 | fisica.vectores (escalar-vector, resultante) |
| fis-fuerzas | caja | 12 | fisica.vectores (escalar-vector, componentes, resultante, productos) |
| fis-fuerzas | carretilla | 4 | fisica.vectores (escalar-vector, componentes, productos) |
| fis-fuerzas | cuadras | 8 | fisica.vectores (escalar-vector) |
| fis-fuerzas | nudo | 3 | fisica.vectores (resultante) |
| fis-giro | (sin objeto) | 128 | fisica.movimiento-circular (arco-y-radian, periodo-y-frecuencia, velocidad-tangencial, rapidez-constante-acelera, mcuv, dos-aceleraciones) |
| fis-mruv | (sin objeto) | 77 | fisica.mruv-y-caida-libre (aceleracion, pendiente-aceleracion, graficas-xt-at, caida-reposo, caida-libre) |
| fis-objeto | atleta | 2 | fisica.magnitudes-y-vectores (unidades, homogeneidad) |
| fis-objeto | bebe | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | bloque | 3 | fisica.magnitudes-y-vectores (areas-volumenes, homogeneidad) |
| fis-objeto | botella | 2 | fisica.magnitudes-y-vectores (unidades, areas-volumenes) |
| fis-objeto | cabello | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | caja | 1 | fisica.magnitudes-y-vectores (homogeneidad) |
| fis-objeto | camion | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | cancha | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | cano | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | caracol | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | comparar | 2 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | corazon | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | deposito | 1 | fisica.magnitudes-y-vectores (homogeneidad) |
| fis-objeto | hoja | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | jeringa | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | lago | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | pendulo | 1 | fisica.magnitudes-y-vectores (homogeneidad) |
| fis-objeto | piscina | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | piso | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | planetas | 1 | fisica.magnitudes-y-vectores (homogeneidad) |
| fis-objeto | plano | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | presion | 1 | fisica.magnitudes-y-vectores (homogeneidad) |
| fis-objeto | reloj | 2 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | sol | 1 | fisica.magnitudes-y-vectores (unidades) |
| fis-objeto | tanque | 2 | fisica.magnitudes-y-vectores (areas-volumenes, homogeneidad) |
| fis-objeto | techo | 1 | fisica.magnitudes-y-vectores (areas-volumenes) |
| fis-objeto | terreno | 3 | fisica.magnitudes-y-vectores (areas-volumenes, homogeneidad) |
| fis-objeto | viento | 1 | fisica.magnitudes-y-vectores (homogeneidad) |
| fis-pista | (sin objeto) | 17 | fisica.movimiento-rectilineo (desplazamiento-distancia, velocidad-relativa) |
| fis-rio | (sin objeto) | 10 | fisica.movimiento-rectilineo (velocidad-relativa) |
| fis-sonido | eco | 1 | fisica.movimiento-rectilineo (mru) |
| fis-sonido | trueno | 1 | fisica.movimiento-rectilineo (mru) |
| fis-tiro | (sin objeto) | 41 | fisica.movimiento-parabolico-y-circular (un-reloj-dos-ejes, velocidad-en-vuelo, ecuaciones-en-el-plano) |
| fis-tiro | agua | 11 | fisica.movimiento-parabolico-y-circular (un-reloj-dos-ejes, altura-y-alcance) |
| fis-tiro | canica | 5 | fisica.movimiento-parabolico-y-circular (un-reloj-dos-ejes, velocidad-en-vuelo) |
| fis-tiro | paquete | 2 | fisica.movimiento-parabolico-y-circular (un-reloj-dos-ejes, velocidad-en-vuelo) |
| fis-tiro | pelota | 51 | fisica.movimiento-parabolico-y-circular (un-reloj-dos-ejes, velocidad-en-vuelo, tiro-oblicuo, altura-y-alcance, ecuaciones-en-el-plano) |
| fis-tiro | piedra | 3 | fisica.movimiento-parabolico-y-circular (un-reloj-dos-ejes, velocidad-en-vuelo, altura-y-alcance) |
| fis-ventana | (sin objeto) | 10 | fisica.movimiento-rectilineo (velocidad-relativa) |
| fis-xt | (sin objeto) | 24 | fisica.movimiento-rectilineo (grafica-xt, desplazamiento-distancia, encuentro) |
| **geo-objeto** | angulos | 164 | geometria.congruencia (criterios, partes-correspondientes, mediatriz-bisectriz, base-media, mediana-hipotenusa, notables); geometria.poligonos-y-cuadrilateros (suma-de-angulos, angulos-exteriores, paralelogramos, rectangulo-rombo-cuadrado, trapecios); geometria.segmentos-y-angulos (abertura, bisectrices, paralelas, quiebre); geometria.triangulos (suma-de-angulos, angulo-exterior, isosceles, desigualdad, angulo-de-bisectrices) |
| **geo-objeto** | armazon | 74 | geometria.congruencia (criterios, partes-correspondientes, mediatriz-bisectriz, base-media, mediana-hipotenusa, notables); geometria.poligonos-y-cuadrilateros (paralelogramos, rectangulo-rombo-cuadrado) |
| **geo-objeto** | carretera | 27 | geometria.segmentos-y-angulos (suma-de-segmentos, punto-medio) |
| **geo-objeto** | cartulina | 12 | geometria.triangulos (suma-de-angulos) |
| **geo-objeto** | caserio | 26 | geometria.triangulos (lineas-notables) |
| **geo-objeto** | compas | 3 | geometria.triangulos (isosceles) |
| **geo-objeto** | lampara | 7 | geometria.triangulos (desigualdad) |
| **geo-objeto** | parcela | 44 | geometria.poligonos-y-cuadrilateros (suma-de-angulos, angulos-exteriores, diagonales, trapecios); geometria.proporcionalidad-y-semejanza (bisectriz, area-y-escala, ceva-menelao) |
| **geo-objeto** | parque | 20 | geometria.triangulos (angulo-de-bisectrices) |
| **geo-objeto** | pasaje | 22 | geometria.segmentos-y-angulos (quiebre) |
| **geo-objeto** | plaza | 36 | geometria.triangulos (angulo-exterior, isosceles, lineas-notables, angulo-de-bisectrices) |
| **geo-objeto** | recta | 15 | geometria.segmentos-y-angulos (suma-de-segmentos, punto-medio) |
| **geo-objeto** | redondo | 56 | geometria.circunferencia (tangentes, poncelet-pitot, posiciones, inscrito, interior-exterior, cuadrilatero-inscrito) |
| **geo-objeto** | reloj | 11 | geometria.segmentos-y-angulos (abertura) |
| **geo-objeto** | rieles | 14 | geometria.segmentos-y-angulos (paralelas) |
| **geo-objeto** | semejante | 59 | geometria.proporcionalidad-y-semejanza (thales, bisectriz, semejanza, encajados, area-y-escala, ceva-menelao) |
| **geo-objeto** | soga | 7 | geometria.segmentos-y-angulos (punto-medio) |
| **geo-objeto** | tijeral | 7 | geometria.triangulos (suma-de-angulos, isosceles) |
| **geo-objeto** | tranquera | 9 | geometria.segmentos-y-angulos (bisectrices) |
| quim-cocina | (sin objeto) | 38 | quimica.materia-y-energia (propiedades, calor-sensible-latente, masa-energia, vida-media) |
| quim-enlace | (sin objeto) | 11 | quimica.enlace-quimico (tres-enlaces, enlace-ionico) |
| quim-enlace | chorro | 2 | quimica.geometria-molecular (forma-polaridad) |
| quim-enlace | globos | 2 | quimica.geometria-molecular (forma-repulsion) |
| quim-enlace | limpiador | 2 | quimica.enlace-quimico (dativo-excepciones) |
| quim-enlace | olla | 2 | quimica.geometria-molecular (fuerzas-intermoleculares) |
| quim-enlace | probador | 3 | quimica.enlace-quimico (tres-enlaces) |
| quim-enlace | sal | 2 | quimica.enlace-quimico (enlace-ionico) |
| quim-enlace | soplete | 2 | quimica.geometria-molecular (hibridacion) |
| quim-enlace | tiza | 2 | quimica.enlace-quimico (resonancia) |
| quim-enlace | ventana | 2 | quimica.enlace-quimico (lewis-octeto) |
| quim-hotel | (sin objeto) | 23 | quimica.estructura-atomica (numeros-cuanticos, configuracion-electronica) |
| quim-lamina | (sin objeto) | 13 | quimica.estructura-atomica (modelos-atomicos) |
| quim-mol | (sin objeto) | 8 | quimica.mol-y-composicion (mol-masa-molar, relaciones-en-formula) |
| quim-mol | balanza | 2 | quimica.mol-y-composicion (mol-masa-molar) |
| quim-mol | frasco | 2 | quimica.mol-y-composicion (leyes-ponderales) |
| quim-mol | sal | 2 | quimica.mol-y-composicion (composicion-formula-empirica) |
| quim-mol | tabla | 2 | quimica.mol-y-composicion (masa-atomica-promedio) |
| quim-mol | tiza | 2 | quimica.mol-y-composicion (relaciones-en-formula) |
| quim-mol | vinagre | 2 | quimica.mol-y-composicion (formula-empirica-molecular) |
| quim-nomenclatura | (sin objeto) | 11 | quimica.nomenclatura-inorganica (tres-nombres, peroxidos-hidruros, sales) |
| quim-nomenclatura | agua-oxigenada | 3 | quimica.nomenclatura-inorganica (peroxidos-hidruros) |
| quim-nomenclatura | bicarbonato | 2 | quimica.nomenclatura-inorganica (sales-acidas-basicas-hidratadas) |
| quim-nomenclatura | clavo | 2 | quimica.nomenclatura-inorganica (tres-nombres) |
| quim-nomenclatura | magnesia | 2 | quimica.nomenclatura-inorganica (arbol-funciones) |
| quim-nomenclatura | permanganato | 2 | quimica.nomenclatura-inorganica (estados-oxidacion) |
| quim-nomenclatura | salero | 2 | quimica.nomenclatura-inorganica (sales) |
| quim-objeto | (sin objeto) | 3 | quimica.estructura-atomica (nucleo-identidad, configuracion-iones, desapareados-isoelectronicos) |
| quim-objeto | combi | 3 | quimica.estructura-atomica (desapareados-isoelectronicos) |
| quim-objeto | frasco | 7 | quimica.estructura-atomica (configuracion-iones, desapareados-isoelectronicos) |
| quim-objeto | hueso | 3 | quimica.estructura-atomica (nucleo-identidad) |
| quim-objeto | salero | 3 | quimica.estructura-atomica (configuracion-iones) |
| quim-tira | (sin objeto) | 69 | quimica.propiedades-periodicas (radio-atomico-ionico, radio-ionico, energia-ionizacion, electronegatividad); quimica.tabla-periodica (periodos-grupos-bloques, ubicacion-lewis, bloques-transicion, metales-no-metales) |
| quim-vasos | (sin objeto) | 40 | quimica.materia-y-energia (sustancia-mezcla, fisico-quimico-nuclear, vida-media) |
| rm-aros | (sin objeto) | 21 | razonamiento-matematico.razonamiento-deductivo (conclusion-necesaria) |
| rm-casos | (sin objeto) | 18 | razonamiento-matematico.razonamiento-deductivo (si-entonces) |
| rm-certeza | (sin objeto) | 121 | razonamiento-matematico.certezas (peor-caso, palomar, una-de-cada, condicion, parejas, llaves) |
| rm-familia | (sin objeto) | 16 | razonamiento-matematico.razonamiento-deductivo (parentesco) |
| rm-objeto | (sin objeto) | 49 | razonamiento-matematico.razonamiento-deductivo (doble-entrada, dos-atributos, si-entonces) |
| rm-orden | (sin objeto) | 142 | razonamiento-matematico.ordenamiento-de-informacion (orden-lineal, posiciones, comparaciones, con-numeros, orden-circular, mesa-cuadrada) |
| rm-patrones | (sin objeto) | 111 | razonamiento-matematico.razonamiento-inductivo (figuras-que-crecen, tres-casos-no-prueban, cada-caso-con-su-lugar, arreglo-triangular, cuenta-larga, lo-que-se-repite) |
| rm-veraz | (sin objeto) | 130 | razonamiento-matematico.verdades-y-mentiras (suposicion, negar-bien, contradictorias, solo-uno-veraz, verdad-y-mentira, cuantos-mienten) |
| rm-veraz | caja | 2 | razonamiento-matematico.verdades-y-mentiras (contradictorias, solo-uno-veraz) |
| rv-definicion | (sin objeto) | 14 | razonamiento-verbal.analogias (puente-justa); razonamiento-verbal.definiciones (genero-diferencia, rasgo-necesario) |
| rv-escalera | (sin objeto) | 4 | razonamiento-verbal.tema-e-idea-principal (tema) |
| rv-soporte | (sin objeto) | 489 | razonamiento-verbal.analogias (relacion-no-tema, parte-o-clase, clase-y-causa, sinonimo-antonimo, puente-justa); razonamiento-verbal.conectores (relacion-primero, causa-consecuencia, clases, locuciones, varios-espacios); razonamiento-verbal.definiciones (genero-diferencia, rasgo-necesario, definicion-a-palabra, definicion-defectuosa, definicion-en-texto); razonamiento-verbal.sentido-contextual (acepcion, denota-connota, palabra-precisa, sentido-figurado, inferir-significado); razonamiento-verbal.tema-e-idea-principal (tema, tema-e-idea, jerarquia, alternativas) |
| trig-arco | abanico | 7 | trigonometria.longitud-de-arco-y-sector (sector) |
| trig-arco | bici | 8 | trigonometria.longitud-de-arco-y-sector (faja-y-eje) |
| trig-arco | columpio | 8 | trigonometria.longitud-de-arco-y-sector (arco) |
| trig-arco | engranajes | 3 | trigonometria.longitud-de-arco-y-sector (faja-y-eje) |
| trig-arco | figura | 36 | trigonometria.longitud-de-arco-y-sector (arco, sector, trapecio-circular) |
| trig-arco | limpia | 8 | trigonometria.longitud-de-arco-y-sector (trapecio-circular) |
| trig-arco | monedas | 4 | trigonometria.longitud-de-arco-y-sector (vueltas-rueda) |
| trig-arco | rueda | 3 | trigonometria.longitud-de-arco-y-sector (vueltas-rueda) |
| trig-giro | llave | 3 | trigonometria.angulo-trigonometrico (sentido-signo) |
| trig-giro | rayos | 4 | trigonometria.angulo-trigonometrico (sentido-signo) |
| trig-giro | reloj | 5 | trigonometria.angulo-trigonometrico (sentido-signo, tres-sistemas, minutos-decimales) |
| trig-giro | tapa | 1 | trigonometria.angulo-trigonometrico (sentido-signo) |
| trig-giro | timon | 15 | trigonometria.angulo-trigonometrico (sentido-signo, tres-sistemas) |
| trig-giro | transportador | 12 | trigonometria.angulo-trigonometrico (tres-sistemas, radian) |
| trig-medida | calculadora | 11 | trigonometria.angulo-trigonometrico (formula-general) |
| trig-medida | lupa | 11 | trigonometria.angulo-trigonometrico (minutos-decimales) |
| trig-medida | rueda | 12 | trigonometria.angulo-trigonometrico (radian) |
| trig-objeto | chacra | 1 | trigonometria.razones-trigonometricas-agudas (lados-desde-angulo) |
| trig-objeto | cuerda | 10 | trigonometria.razones-trigonometricas-agudas (aproximados) |
| trig-objeto | escalera | 23 | trigonometria.razones-trigonometricas-agudas (lados-desde-angulo, razon-cociente, notables, aproximados, complementarias) |
| trig-objeto | escuadras | 5 | trigonometria.razones-trigonometricas-agudas (notables) |
| trig-objeto | figura | 6 | trigonometria.razones-trigonometricas-agudas (razon-cociente, aproximados) |
| trig-objeto | loseta | 2 | trigonometria.razones-trigonometricas-agudas (notables) |
| trig-objeto | poste | 13 | trigonometria.razones-trigonometricas-agudas (lados-desde-angulo, razon-cociente, notables, aproximados, complementarias) |
| trig-objeto | rampa | 7 | trigonometria.razones-trigonometricas-agudas (lados-desde-angulo, razon-cociente, aproximados, complementarias) |
| trig-objeto | repisa | 2 | trigonometria.razones-trigonometricas-agudas (lados-desde-angulo) |
| trig-objeto | senal | 8 | trigonometria.razones-trigonometricas-agudas (notables) |
| trig-objeto | sombras | 5 | trigonometria.razones-trigonometricas-agudas (razon-cociente) |
| trig-objeto | techo | 8 | trigonometria.razones-trigonometricas-agudas (complementarias) |
| trig-objeto | triangulo | 1 | trigonometria.razones-trigonometricas-agudas (lados-desde-angulo) |
| **trig-pos** | (sin objeto) | 115 | trigonometria.angulos-en-posicion-normal (razones-coordenadas, signos-cuadrante, cuadrantales, giro-horario, coterminales-negativos) |
| trig-vista | (sin objeto) | 113 | trigonometria.triangulos-rectangulos (un-lado-un-angulo, cateto-y-angulo, elevacion-depresion, dos-angulos, angulo-observacion) |
