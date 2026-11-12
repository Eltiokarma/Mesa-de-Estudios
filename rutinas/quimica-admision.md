# Rutina de química-admisión: reporte

Rama `rutina/quimica-admision`, sacada de `claude/awesome-wozniak-5etl1n` (8 nov 2026), pausada por límite de uso y retomada el 12 nov 2026 con la principal fusionada. Meta: llevar a «si» las preguntas de química de `docs/datos/admision-unmsm.csv` que estaban en «medio» o «no». Regla 5: el CSV y los PDF fueron solo un mapa; los problemas, moléculas y números son propios.

Cada pieza pasó por el método de `docs/metodo/`: constructor, verificador a ciegas (aparte, sin leer el código), revisor de contenido y correcciones al mismo constructor. Los casos que cambiaron después de la verificación los recalculó a mano la conversación principal.

## Cobertura de química en el CSV (307 preguntas)

| | si | medio | no |
| --- | --- | --- | --- |
| Antes | 196 | 110 | 1 |
| Después | 299 | 8 | 0 |

Se marcaron 103 filas, solo de química. La columna `modulo` lleva el módulo principal de cada una; cuando una pregunta mezcla temas, el resto lo cubren módulos que ya existían (por ejemplo, el limitante de `limitante-particulas` o la electrólisis de `celda-galvanica`).

## Qué se construyó

### Escena nueva: `molecula-grande` 0.1.0, «La lupa de las moléculas grandes»

- **Motor:** lee SMILES y calcula hibridación (convención escolar), enlaces σ y π, electrones π, pares libres, polaridad de enlace (ΔEN ≥ 0,4), octeto, anillos y aromaticidad (Hückel), grupos funcionales con la función principal, carbonos quirales, número de oxidación y forma según el pH.
- **Biblioteca:** 30 moléculas reales: aminoácidos, azúcares abiertos y cíclicos, sacarosa, vitaminas A, C, D y E, β-caroteno, esteroides, flavonoide, curcumina, cafeína, tiroxina, alicina, penicilina, ácidos grasos y otras.
- **Escena:**
  - Paso a paso con 9 predicciones que bloquean.
  - Explorar: 30 moléculas × 11 lupas; se predice antes de iluminar, y la posición de la correcta va repartida.
  - 5 experimentos en «¿Qué pasa si…?».
- **Casos:** 40, verificados a ciegas con RDKit (fórmula, InChIKey con estereoquímica, centros quirales): 40/40.
- **Pruebas y papel:** 9 problemas de papel; 117 pruebas, contando la de elementos.
- **Átomos en tinta:** los átomos van en tinta en todas las vistas. Con 12 colores de lupa no hay paleta que pase AA y quede a ΔE00 ≥ 20 de los elementos; así ningún color nombra dos cosas.

### Pestaña nueva: `cinetica` 0.3.0, «Mecanismos»

- **Contenido:** 6 predicciones sobre intermediario, catalizador, ley y orden de la etapa lenta (con equilibrio previo), etapa lenta en un perfil de dos lomas, cimas y valle, y velocidad media con cambio de unidades.
- **Casos y papel:** 14 casos nuevos (mec-01 a mec-14), verificados a ciegas: 134/134 campos. 3 problemas de papel nuevos.

### Generadores nuevos (formato «predicciones»)

| Módulo | Qué cubre | Casos | Pruebas | Papel | Verificación ciega |
| --- | --- | --- | --- | --- | --- |
| `soluciones-meq-ppm` | mEq, ppm en masa y de gases, % m/v y % v/v, jarabes, valoración de cloruros, ácido para un carbonato | 25 | 32 | 10 | 65/65 |
| `configuracion-ubicacion` | configuración hasta Z = 86, iones de transición, anómalas, periodo y grupo, cuánticos, desapareados, partículas, vida media | 24 | 43 | 9 | 64/64, contrastada con `mendeleev` |
| `quimica-conceptos` | verdadero o falso, incorrecta, correcta y relacionar: 348 proposiciones propias en 35 temas y 7 conjuntos de pares | 20 | 33 | 10 | 250/250 y luego 98/98 |
| `clasificar-reacciones` | 60 ecuaciones: clase, redox, agentes, dismutación, calor, «a la vez», V/F y aguas duras | 26 | 40 | 8 | 64/64 |
| `estequiometria-admision` | ley de mineral y flotación, conservación de átomos, termoquímica con limitante, redox con dicromato, hidróxidos e iones, hidrólisis de triglicéridos | 23 | 41 | 8 | 50/50 |
| `conversiones-quimica` | variaciones y lecturas de temperatura, densidad y longitudes, calor latente molar, vida media | 25 | 42 | 8 | 51/51 |
| `nombre-polifuncional` | nombres IUPAC con varios grupos (hidroxi/oxo/amino, -dioico, -tricarboxílico, en/ino, azúcares, aminoácidos, ácido benzoico), cadena, sufijo, clase de amina, origen del éster, secuencia de oxidación | 25 | 35 | 10 | 55/55 con OPSIN y RDKit |

Los siete están en sus unidades de `catalogo/cursos/quimica.json`. No se corrió `npm run catalogo` sobre `app/datos/` ni se subió `VERSION` de `app/sw.js`: eso lo hace la integración.

## Cambios en núcleos compartidos

- **`nucleo/predicciones.js`, `formatear`:** redondea la mitad hacia afuera con un margen para el error binario. Antes, 1,035 salía «1,03» y 1,275 salía «1,27». Comparé las semillas 0 a 199 de todos los generadores: solo cambian esos redondeos (8 en `porcentajes-sucesivos`, 8 en `estequiometria-admision` y 1 en `conversiones-quimica`). Tiene una prueba nueva en `nucleo/predicciones.test.js`.
- **`nucleo/elementos-escenas.test.js`:** `molecula-grande` entra con `vistas: []`, porque los átomos van en tinta. El O (#c4284e) y el I de la paleta están en `Elementos.CERCANOS` a ΔE00 16,3: si alguna escena los muestra juntos, hay que separarlos en `nucleo/elementos.js`.

## Códigos de error

- **Prefijo `AQ-`:** los códigos nuevos de esta rutina van con `AQ-` («admisión, química») y respaldo «hipótesis». Se renombraron desde `QA-` porque QA1 a QA17 son los del informe de química ambiental.
- **Ids comunes entre módulos:** vida media `AQ-vm-*`, calor `AQ-calor-*`.
- **Códigos de los informes con respaldo:** ES20, ES21, ES6, ES19, ES7, SO7, SO14, SO15, EC8, EC9, EN1, EN3, EN12, AB1, AB3, EQ3, EQ13, AT5, AT6, TP4, QA8, HC3, HC4, FO3, FO4, BMH4 y otros. Van como «parcial», salvo un «documentado» por proposición en `quimica-conceptos` cuando el informe trae la cifra de ese mismo ítem.
- **BM8:** estaba citado al revés y se reemplazó por `AQ-desnaturalizacion-reversible`.
- **EC9-oxidar-es-ganar-oxigeno:** queda «documentado» en `balance-reacciones` (pregunta equivalente) y «parcial» en `clasificar-reacciones` (otra cara del error).

## Lo que queda (8 filas en «medio»)

1. `unmsm-2023-I-solucionario-2022-10-23#90`: la hidratación de un alqueno y la isomería en una secuencia de hidratación y oxidación. La oxidación está en `nombre-polifuncional`.
2. `unmsm-2023-I-solucionario-2022-12-10#89`: la estructura de un oxácido en una dismutación. La dismutación está en `clasificar-reacciones`; falta su estructura de Lewis.
3. `unmsm-2023-II-solucionario-2023-03-25#95`: contar sustituyentes (metilos) de un carotenoide y escalar su contenido en un fruto. Falta una lupa de sustituyentes en `molecula-grande`.
4. `unmsm-2024-II-solucionario-2024-03-16-area-a#90`: la sal de un ácido aromático y la sustitución electrofílica aromática. El nombre y la hibridación ya están.
5. `unmsm-2024-II-solucionario-2024-03-17-medicina#90`: derivados oxidados, reducidos y ésteres de la glucosa (glucónico, sorbitol, glucosa fosfato).
6. `unmsm-2026-I-solucionario-2025-10-12-medicina#89`: la estructura de Lewis del radical •OH. La especie oxidada y el agente reductor de la Fenton están en `clasificar-reacciones`.
7. `unmsm-2026-II-solucionario-2026-03-08-area-c#89`: una molécula tetrapirrólica (grupos carboxilo, quirales, pares libres). Bastaría sumar una porfirina propia a la biblioteca de `molecula-grande`.
8. `unmsm-2026-II-solucionario-2026-03-15-medicina#88`: diagrama de Pourbaix (potencial-pH). Pide una escena o una pestaña con un diagrama que se lea.

## Para decidir (Gerson)

- **Moléculas reales en los generadores:** en `nombre-polifuncional` pueden salir algunas moléculas conocidas: serina, homoserina, ácido aspártico, gliceraldehído y ácido 4-aminobenzoico. No salen el cítrico, el isocítrico, la fenilalanina, la tirosina ni los azúcares completos, que son los de las filas del examen. ¿Se excluyen también los aminoácidos proteinogénicos y los ácidos del ciclo de Krebs?
- **Convenciones de academia que la app dice en pantalla:**
  - hibridación escolar;
  - octeto del S con S=O, que da 10 electrones en la alicina;
  - Lewis con octeto para los dativos de los oxoaniones;
  - lectura de la etapa lenta desde el valle cuando este queda por debajo de los reactivos.

## Estado de las pruebas

`npm test`: 5518 pruebas, 5517 en verde. Falla solo «app/datos/catalogo.json está al día con catalogo/», porque falta `npm run catalogo` (lo hace la integración).

Playwright: las dos escenas tocadas (`molecula-grande` y la pestaña nueva de `cinetica`) se recorrieron a 390×844 y 1366×768, en claro y oscuro, con y sin movimiento reducido. No hubo errores de consola ni desbordes.
