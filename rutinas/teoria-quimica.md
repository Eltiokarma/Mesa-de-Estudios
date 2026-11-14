# Reporte: teoría de Química (14 nov 2026)

Sesión paralela de teoría, rama `teoria/quimica` (sale de `claude/awesome-einstein-ch5g9a`). Encargo: `rutinas/encargos/teoria-quimica.md`. No se integró a `main`: la sesión principal integra.

## Qué quedó hecho

Las **20 unidades** del catálogo de Química tienen su archivo en `contenido/teoria/quimica/`. Todas están en `estado: 'completa'`, con todos los temas del catálogo cubiertos, y suman **97 ideas** de cinco momentos. Para cada unidad:

- `Teoria.problemas()` da `[]` con 60 semillas;
- hay un commit propio;
- se recorrió en Playwright a 360 × 780 con capturas revisadas.

`npm test` completo está en verde: 8246 pruebas.

| Grado | Unidad | Ideas | Piezas |
| --- | --- | --- | --- |
| 3 | materia-y-energia | 4 | quim-particulas, ejes |
| 3 | estructura-atomica | 5 | quim-atomo, quim-cajas, quim-cadena, recta |
| 3 | tabla-periodica | 5 | quim-tabla, quim-molecula |
| 3 | enlace-quimico | 5 | quim-particulas, quim-molecula, ejes |
| 3 | nomenclatura-inorganica | 5 | quim-fichas, quim-cadena |
| 4 | mol-y-composicion | 5 | quim-particulas, balanza, quim-fichas, quim-composicion |
| 4 | reacciones-y-balance | 5 | quim-particulas, quim-cadena, recta, quim-fichas |
| 4 | estequiometria | 4 | quim-particulas, quim-cadena, barra-porcentaje, quim-fichas |
| 4 | gases | 5 | quim-particulas, ejes, quim-cadena |
| 4 | liquidos-y-solidos | 5 | quim-particulas, ejes |
| 4 | soluciones | 5 | quim-particulas, ejes |
| 4 | hidrocarburos | 6 | quim-molecula |
| 4 | funciones-organicas | 6 | quim-molecula |
| 4 | recursos-naturales | 4 | recta, quim-cadena, quim-particulas |
| 4 | ambiente-y-quimica-aplicada | 6 | quim-cadena, barra-porcentaje, quim-molecula, ejes |
| 5 | cinetica-quimica | 5 | ejes, quim-particulas |
| 5 | equilibrio-quimico | 4 | ejes, quim-particulas, recta |
| 5 | acidos-y-bases | 4 | quim-molecula, quim-particulas, recta, ejes |
| 5 | electroquimica | 4 | quim-celda, recta, ejes |
| 5 | biomoleculas-y-productos-naturales | 5 | quim-molecula, quim-cadena, ejes |

**Cómo se hizo.** La unidad 1 (materia-y-energia) y el kit los escribió la sesión. Las otras 19 las escribieron seis subagentes en paralelo, con el mismo contexto y el mismo patrón, cada uno con su revisión visual. La sesión revisó, validó y subió cada unidad.

Cada archivo trae:
- la ficha de tarea en el encabezado, con los colores de la unidad y las fuentes;
- las cinco decisiones como comentario sobre cada idea;
- la voz de Bruna en cada `voz`.

**Precisiones del expediente que se respetaron:**
- **Dilución y pH.** La dilución conserva n y la alícuota conserva c (cápsula de cantidad y concentración). Diluir diez veces sube una unidad de pH solo con un ácido fuerte; el pH no cruza a básico.
- **Agua en las uniones.** «Toda unión libera agua» es falso: en hidrocarburos se predice eteno + agua → etanol, y ambiente trae los polímeros de adición.
- **Fracciones del petróleo.** Son intervalos de ebullición, no puntos.
- **Tabla periódica.** Las tendencias se muestran con datos y sus excepciones: Be–B, N–O.
- **Le Chatelier.** Se trabaja con Q frente a K, con el gas inerte a volumen fijo y con el catalizador.
- **Electroquímica.** Por el puente salino no pasan electrones.
- **Ebullición.** No se fija 100 °C como valor universal: Juliaca hierve a 87 °C.

## Piezas nuevas del kit (`nucleo/kit/piezas/`)

Cada pieza tiene su `.test.js`, función pura `dibujar(datos, estado)`, `alt`, alto fijo y afirmación en el encabezado. Se revisaron a 360 px. En grises se revisaron las de la sesión; quim-composicion no.

| Pieza | Afirmación |
| --- | --- |
| `quim-particulas` | Lo que se cuenta son partículas enteras dentro de un volumen visible; número y volumen se leen a la vez (vaso con nivel, cilindro con émbolo, caja) |
| `quim-atomo` | El núcleo dice qué elemento es; los electrones de afuera solo dicen su carga (capas discontinuas: niveles, no trayectorias) |
| `quim-cajas` | Cada caja admite dos flechas opuestas, y los electrones desapareados se ven (Hund por defecto) |
| `quim-tabla` | El valor de cada casilla se compara con el de sus vecinas; la tendencia sale de los datos, con sus saltos |
| `quim-molecula` | Lo que define la estructura es qué átomo se une con cuál y cómo; la orientación en el papel no cambia la molécula |
| `quim-fichas` | La fórmula es neutra cuando cada carga positiva tiene una negativa enfrente |
| `quim-celda` | Los electrones solo viajan por el alambre; dentro del líquido y del puente la carga la llevan iones |
| `quim-cadena` | Cada paso causa el siguiente y solo ese; dos cadenas lado a lado no comparten flechas |
| `quim-composicion` (subagente de mol) | El porcentaje de un elemento es el largo de su tramo |

## Pedidos al molde (no se tocaron `app/` ni `nucleo/teoria.js`)

1. **Bug en `app/teoria.js`.** `vista()` lee la idea con `location.hash.split('/')[3]`, que siempre vale «teoria».
   - Consecuencia: `#/unidad/<id>/teoria/<idea>` y los chips de idea abren siempre la primera idea pendiente, no la pedida. La ficha (`/teoria/ficha`) tampoco abre.
   - Arreglo: usar el índice 4.
   - Para recorrer cada idea, el script de revisión marcó como hechas las anteriores en `localStorage`.
2. **Falso positivo en `nucleo/teoria.js`.** La revisión `/NaN|undefined|…/` marca «NaNO₃» como NaN, y se tuvo que evitar el nitrato de sodio en «Ahora tú». Arreglo: buscar con límites de palabra (`\bNaN\b`).
3. **«Ahora tú» sin dibujo.** La figura queda vacía y deja un hueco. Haría falta un respaldo en el lector, o permitir que ahí la figura se oculte.
4. **Respuesta manipulable en «Ahora tú».** No existe todavía (ya estaba en la lista del contrato). Química la pediría para tres cosas: poner fichas hasta carga cero (nomenclatura), poner coeficientes (balance) y mover el émbolo (gases).
5. **`recta` no respeta `hasta`.** Lo de un paso anterior no desaparece en la línea de tiempo; se resolvió con filas.
6. **`ejes` no tiene rótulos sueltos.** Se usó una curva de un solo punto como parche.
7. **`quim-molecula`.** Le faltan el «electrón solo» (Lewis de radicales y átomos sueltos; se usó «•» como carga) y la fórmula esquelética, la de vértices sin rótulo.
8. **`barra-porcentaje` con fracciones chicas.** Con una ley minera del 1 % los rótulos se pisan; se usó `quim-cadena`.

## Códigos de error nuevos (todos hipótesis, prefijo QM-)

Se reusaron los documentados (MA, AT, TP, EN, NO, ES, GQ, SO, CI, EQ, AB, EC, HC, FO, BM, BMH, QA, AM). Los nuevos, por unidad, están en los `error` de cada archivo; en resumen:

- **materia-y-energia:**
  - mezclas y estados: QM-HOMO, QM-AIRE, QM-VACIO, QM-NUCLEAR;
  - calor: QM-ENFRIA, QM-SIN-C, QM-SIN-M, QM-CERO;
  - masa y energía: QM-G-KG, QM-MC.
- **estructura-atomica:**
  - núcleo, carga e iones: QM-ION-ELEMENTO, QM-ION-ISOTOPO, QM-CARGA-E, QM-CARGA-N, QM-NEUTRONES;
  - modelos y números cuánticos: QM-MODELO, QM-OCTETO-NIVEL, QM-ORBITAL-ELECTRON, QM-PERIODO-NIVEL, QM-N-L;
  - configuración: QM-ULTIMO, QM-REPARTE, QM-3D-ANTES, QM-CUENTA, QM-HUND;
  - isoelectrónicos: QM-ISO-RADIO, QM-ISO-ORDEN.
- **tabla-periodica:**
  - ubicación y Lewis: QM-HUECOS, QM-PERIODO-GRUPO, QM-PERIODO, QM-GRUPO, QM-SOLO-P, QM-LEWIS-TODOS;
  - radio: QM-RADIO-NIVEL, QM-ION-RADIO, QM-FLECHA;
  - electronegatividad: QM-EN-AFINIDAD, QM-EN-ORDEN, QM-EN-SUMA.
- **enlace-quimico:** QM-NVAL-SIGNO, QM-RES-UNO, QM-RES-CUENTA, QM-POL-ENLACE, QM-GRUPO-EB.
- **nomenclatura-inorganica:**
  - estados de oxidación: QM-OX-O, QM-OX-SIGNO, QM-OX-CARGA, QM-OX-TOTAL;
  - nombres y fórmulas: QM-ROMANO, QM-PEROX, QM-FUNCION, QM-SIMPLIFICA, QM-OXACIDO-H, QM-POLI, QM-HIDRATO.
- **mol-y-composicion:** QM-PROMEDIO, QM-PROMEDIO-SIMPLE, QM-NA, QM-POR-N, QM-PORCENTAJE, QM-FACTOR, QM-PROPORCION.
- **reacciones-y-balance:** QM-PRECIP, QM-CLASIF, QM-AGENTE, QM-ION-E.
- **estequiometria:** QM-SUMA-PCT, QM-IMPURO, QM-TEORICO, QM-EQ-FIJO.
- **gases:**
  - leyes de los gases: QM-BOYLE-DIRECTA, QM-P-FIJA, QM-BOYLE-CUADRADO, QM-RESTA;
  - ecuación de estado: QM-CELSIUS, QM-PV-DESPEJE, QM-SIN-P, QM-SIN-N;
  - mezclas: QM-DALTON-FRACCION, QM-DALTON-EMPUJE, QM-DALTON-MITAD;
  - efusión: QM-GRAHAM-SIN-RAIZ.
- **liquidos-y-solidos:**
  - estados y capilaridad: QM-VIDRIO-LIQUIDO, QM-SOLIDO-LIBRE, QM-ESTADO, QM-CAPILAR-MENOS, QM-CAPILAR-IGUAL, QM-CAPILAR-AREA;
  - presión de vapor y fases: QM-PROPORCIONAL, QM-EBULLICION-INVERSA, QM-SIEMPRE-LIQUIDO, QM-FASE-LECTURA;
  - humedad: QM-HR-FRIO, QM-HR-FIJA, QM-HR-INVERTIDA, QM-GAS-HUMEDO.
- **soluciones:**
  - dispersos y solubilidad: QM-FILTRO, QM-ENFRIAR, QM-SOLUB, QM-AGITAR, QM-DISPERSO;
  - concentración: QM-ML, QM-INV, QM-SOLVENTE;
  - dilución y mezcla: QM-ALICUOTA, QM-AGUA, QM-SUMA-C, QM-COEF, QM-C1V1.
- **cinetica-quimica:**
  - rapidez y energía: QM-NORMA, QM-EA-INV, QM-SIGNO-DH;
  - factores y orden: QM-MOLER, QM-MASA, QM-FACTOR, QM-ORDEN;
  - vida media: QM-CONTEO, QM-LINEAL, QM-DIVIDE, QM-VIDA.
- **equilibrio-quimico:** QM-K, QM-KP, QM-DN, QM-EXP, QM-ALFA, QM-INERTE, QM-QK.
- **acidos-y-bases:**
  - teorías y pares conjugados: QM-AGUA-FIJA, QM-AGUA-NEUTRA, QM-CONJ-CARGA, QM-CONJ-SENTIDO;
  - fuerza y pH: QM-PH-IGUAL, QM-KAKB, QM-SIN-RAIZ, QM-PKA, QM-DILUIR-PH, QM-EXPONENTE;
  - titulación: QM-EQUIV-ACIDA, QM-CV-INVERTIDO, QM-V-IGUAL.
- **electroquimica:**
  - pila y potenciales: QM-PUENTE-PARED, QM-FEM-SUMA, QM-FEM-UNO, QM-E-ESCALA, QM-DESPLAZA, QM-NOBLE;
  - Faraday: QM-CANTIDAD, QM-FARADAY-MASA, QM-FARADAY-Z, QM-FARADAY-M, QM-T-MIN;
  - Pourbaix: QM-POURBAIX-PH, QM-POURBAIX-LINEA, QM-POURBAIX-SIGNO.
- **recursos-naturales:**
  - petróleo y octanaje: QM-FRACCION-PURA, QM-OCTANO-ENERGIA, QM-OCTANO-PORCENTAJE, QM-OCTANO-REFERENCIA;
  - combustión: QM-INCOMPLETA, QM-SIN-O2, QM-COMB-H2, QM-O2-SOLO-C, QM-O2-ATOMOS;
  - minería: QM-LEY-PUREZA, QM-SIN-RECUPERACION, QM-PORCENTAJE.
- **ambiente-y-quimica-aplicada:**
  - agua y nutrientes: QM-FILTRAR-DOBLE, QM-FOSFATO-VENENO, QM-ALGAS-O2;
  - reciclaje: QM-RECICLAJE-ULTIMO, QM-PROMEDIO, QM-RESTA-PCT;
  - polímeros y uniones: QM-AGUA-UNION, QM-POLI-H2, QM-POLI-MONOMERO, QM-POLI-CONTEO, QM-SIN-AGUA, QM-UNA-AGUA;
  - superficie: QM-AREA-CONSTANTE, QM-AREA-VOLUMEN.
- **hidrocarburos y funciones-organicas:**
  - fórmulas y anillos: QM-HIBRIDA-TODO, QM-FORMULA-GENERAL, QM-4H, QM-ANILLO, QM-ANILLO-AROM;
  - isómeros: QM-GIRO, QM-GIRO-DOBLE, QM-ISO-POSICION;
  - reacciones: QM-ADICION, QM-REACCION;
  - grupos funcionales: QM-FENOL, QM-O-ALCOHOL, QM-CARBONILO, QM-GRUPO, QM-N-AMINA, QM-ESTER-AGUA, QM-ESTER-NOMBRE;
  - nomenclatura: QM-CADENA-LARGA, QM-LOCANTE, QM-SUFIJO.
- **biomoleculas:** QM-DOS-AGUAS, QM-TRES-ACIDOS, QM-VITAMINA, QM-COLOR, QM-NATURAL.

Varios códigos se repiten entre unidades con el mismo nombre y sentidos parecidos (QM-AGUA, QM-FACTOR, QM-CONTEO, QM-PORCENTAJE, QM-PROMEDIO, QM-GRUPO). Antes de llevarlos a `docs/investigacion/` hay que unificarlos o separarlos con un sufijo de unidad.

## Lo no verificado

- **Constantes y datos citados de memoria** (fuente en el comentario de cada archivo; falta cotejarlos con el documento):
  - Ka del HF y del acético;
  - E° de Ni y Pb;
  - momentos dipolares;
  - puntos de ebullición de los hidruros del grupo 16, del etanol y del metoximetano;
  - curvas de solubilidad del KNO₃ y del NaCl;
  - tabla de presión de vapor del agua (CRC);
  - intervalos de ebullición de las fracciones del petróleo;
  - longitudes de onda de los colorantes (solo OpenStax).
- **Modelos y aproximaciones:**
  - presión de Juliaca (≈ 0,62 atm, atmósfera estándar);
  - Antoine usado hasta 120 °C;
  - curvas del CO₂ ajustadas a puntos del NIST;
  - la K = 4 «en caliente» de Le Chatelier es ilustrativa;
  - las energías de la cinética son un modelo.
- **Masas atómicas** redondeadas a la convención de examen (Cl 35,5).
- **Nombres IUPAC** de orgánica revisados a mano, sin OPSIN.
- **Historias** de las unidades: algunas salen de la matriz y no del PDF.
- **Pantalla:**
  - el tema oscuro se revisó solo en partes (soluciones, cinética y equilibrio);
  - no se probó en un celular real ni con lector de pantalla;
  - no se probó con alumnos.
- **Pulido pendiente visto en capturas:**
  - partículas algo amontonadas en la caja rígida de Dalton (gases) y en las mezclas de octanaje;
  - rótulos «O₂» y «CO₂» juntos en la curva de Graham;
  - un «1» de número de balanza que sobra en mol-y-composicion.

## Reporte de diseño

```
Ficha de tarea: una por unidad, en el encabezado de cada archivo (promesa, persona y condiciones, resultado observable,
  orden de atención, estados, duda que resuelve). Persona común: postulante de 3.º–5.º, celular de gama baja a 360 px,
  sin audio, a veces sin conexión.
Sistema: existente (tokens de variable --c-o/i/h/d, trazo del kit, escala de tiempo de kit.css). Decisiones nuevas,
  escritas en las piezas: los átomos se distinguen por color y por relleno (lleno, hueco, con punto), así el modelo se
  lee en grises; las capas del átomo van discontinuas (modelo, no trayectoria); en la cuenta de cargas, positivas
  llenas arriba y negativas huecas abajo, y lo que no tiene pareja lleva un aro discontinuo.
Carácter: acogedora, viva, precisa (docs/escena-viva.md). Firma: el hilo de color, más la lupa de partículas como
  motivo propio de Química (aparece en 12 unidades: juego, predicción y «Mira»).
Movimientos: solo los del lector y la línea de tiempo del kit (kit-nuevo/kit-aparece: «corto», «llegar», después
  del «largo» del paso). Las piezas no traen movimiento propio. Con movimiento reducido, los mismos estados fijos.
Verificación:
  - 360 px: cada unidad recorrida en Playwright a 360 × 780, con capturas de los cinco momentos de cada idea.
  - Sin desbordes: textos y rótulos ≥ 14 px en el lienzo de 320; la pieza recorta los rótulos a su caja.
  - Grises: las piezas de la sesión se revisaron en grises; quim-composicion no.
  - Contraste: no se midió aparte; se usan los tokens ya medidos de docs/diseno.md.
  - Topes de texto: los vigila teoria.test.js.
  - Partículas: scratchpad/caben.js comprobó que caben en sus casillas en las 20 unidades (octanaje se corrigió).
No verificado: celular real, lector de pantalla, personas, tema oscuro completo, otros navegadores.
Hipótesis:
  - Ver las partículas antes de la fórmula (macro → submicro → símbolo, por pasos) debería bajar MA10 y ES4.
  - Se comprobaría con las predicciones registradas (evento «teoria», momento «prediccion») frente a las pruebas
    de entrada y salida de Química.
Conflictos:
  - El molde fija la respuesta por opciones. El skill y escena-viva prefieren que la respuesta se manipule.
  - Queda como pedido 4.
```
