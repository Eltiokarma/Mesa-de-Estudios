/*
 * Motor de «El gráfico que no miente: tablas, gráficos y suficiencia de datos» (razonamiento matemático):
 * barras con el eje vertical que no empieza en cero, variación absoluta y porcentual en un gráfico de líneas,
 * sectores circulares (grados, porcentaje y cantidad), pictogramas, tablas de un campeonato todos contra todos y
 * problemas de suficiencia de datos con el formato de admisión.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorGraficos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Convenciones:
 *   - Todo número debe ser finito. Los porcentajes van de 0 a 100 (25 quiere decir 25 %); los ángulos, en grados
 *     sexagesimales (una vuelta = 360). Los resultados no se redondean: 12,5 % sale 12.5 y 100/3 % sale 33.33…
 *     (los campos 'exacto' traen el texto de la fracción simplificada, como '5/4' o '100/3').
 *   - Cada resultado que es la respuesta de una predicción trae 'errores' (lo que da cada error típico),
 *     'coinciden' (los nombres de los errores que en ese caso dan justo la respuesta correcta: no se ofrecen y no
 *     van en 'errores') y 'repetidos' ({ nombre: el error anterior de la lista que da lo mismo }; tampoco van en
 *     'errores'). Los errores se revisan en el orden en que se nombran abajo.
 *   - Equipos de un campeonato: numerados desde 0. Una fila de tabla es { PJ, PG, PE, PP, GF, GC, Pts }
 *     (jugados, ganados, empatados, perdidos, goles a favor, goles en contra, puntos); la victoria da 3 puntos,
 *     el empate 1 y la derrota 0. «Todos contra todos» en r ruedas: cada par de equipos juega r veces.
 *
 * Funciones (argumentos entre llaves):
 *   barras({ valores, inicio, tope })   alturas de un gráfico de barras cuyo eje vertical va de inicio (por defecto 0)
 *                               a tope (por defecto el mayor valor). Cada valor debe estar entre inicio y tope, y
 *                               tope > inicio ≥ 0. { inicio, tope, barras: [{ valor, alto }] } con alto =
 *                               (valor − inicio)/(tope − inicio): la fracción de la altura del eje que ocupa la barra.
 *   razonBarras({ a, b, inicio })   ¿cuántas veces b es a? (a > b > inicio ≥ 0; inicio por defecto 0).
 *                               { razon: a/b, exacto (texto de a/b), diferencia: a − b, porcentajeMas: (a − b)/b·100,
 *                               altoA: a − inicio, altoB: b − inicio (lo que se ve dibujado sobre el eje),
 *                               dibujada: (a − inicio)/(b − inicio), errores: alturas (dibujada: compara lo que se ve
 *                               de las barras), invertida (b/a), sobranteDibujado ((a − b)/(b − inicio): lo que A le
 *                               saca a B, medido con la barra dibujada de B) }. Con inicio 0, 'alturas' coincide.
 *   crecimientos({ valores })   un gráfico de líneas con valores > 0 (al menos 2) en orden. { tramos: [{ desde, hasta
 *                               (índices de los puntos), de, a, cambio: a − de, porcentaje: cambio/de·100,
 *                               porcentajeFinal: cambio/a·100 }], mayor (índice del tramo de mayor porcentaje entre los
 *                               que suben), porcentaje y cambio de ese tramo, exacto (texto del porcentaje), errores:
 *                               masEmpinado ({ tramo, cambio, porcentaje } del tramo que más sube en cantidad; el
 *                               primero si empatan), baseFinal ({ tramo, porcentaje }: el tramo que gana y su porcentaje
 *                               si se divide entre el valor final), puntoMasAlto ({ indice, valor }: el punto más alto
 *                               del gráfico, el primero si empatan) }. Un error de tramo coincide si señala el tramo
 *                               correcto con el mismo porcentaje; puntoMasAlto coincide si es el punto final del tramo
 *                               correcto. Debe haber al menos un tramo que sube y un solo tramo con el mayor porcentaje.
 *   dosCrecimientos({ uno, otro })   uno y otro son [de, a] con números > 0 y a > de. { porcentajes: [p1, p2],
 *                               cambios: [c1, c2], mayor: 'uno' | 'otro' | 'iguales' (en porcentaje), errores:
 *                               absoluta (el que sube más en cantidad, o 'iguales'), llegaMasAlto (el de mayor valor
 *                               final, o 'iguales'), baseFinal (el de mayor cambio/a, o 'iguales') }.
 *   sectores({ cantidades })    gráfico circular de una tabla (cantidades ≥ 0, al menos 2, total > 0).
 *                               { total, sectores: [{ cantidad, fraccion (texto de cantidad/total), porcentaje,
 *                               grados }], sumaPorcentajes, sumaGrados }.
 *   cantidadDeSector({ total, grados })   0 < grados ≤ 360, total > 0. { cantidad: grados/360·total, porcentaje:
 *                               grados/360·100, fraccion (texto de grados/360), errores: sobre100 (grados/100·total:
 *                               toma la vuelta como 100), gradosComoCantidad (grados), porcentajeComoCantidad
 *                               (porcentaje: responde el porcentaje y no la cantidad) }.
 *   gradosDeSector({ total, cantidad })   0 < cantidad ≤ total. { grados: cantidad/total·360, porcentaje, fraccion,
 *                               errores: porcentajeComoGrados (porcentaje), cantidadComoGrados (cantidad),
 *                               medioCirculo (cantidad/total·180) }.
 *   sectorAnidado({ total, porcentaje, parte })   un grupo es porcentaje % del total y, dentro de él, una parte es
 *                               parte % del grupo (los dos entre 0 y 100, sin el 0). { porcentaje: porcentaje·parte/100
 *                               (del total), grados, cantidad, errores (en grados): parteDelTotal (parte·3,6: toma el
 *                               porcentaje del grupo como si fuera del total), grupoEntero (porcentaje·3,6), suma
 *                               ((porcentaje + parte)·3,6; no va si pasa de 360) }.
 *   pictograma({ factor })      un dibujo que se agranda factor veces (factor > 0, factor ≠ 1) a lo alto y a lo ancho.
 *                               { alto: factor, area: factor², volumen: factor³, errores (para el área): lineal
 *                               (factor), doble (2·factor), cubo (factor³) }.
 *   partidos({ equipos, ruedas })   todos contra todos con equipos ≥ 2 (entero) y ruedas 1 o 2 (por defecto 1).
 *                               { partidos: ruedas·n(n − 1)/2, porEquipo: ruedas·(n − 1), errores: unaRueda (n(n − 1)/2),
 *                               cuadrado (n²), dobleConteo (ruedas·n(n − 1): cuenta cada partido dos veces) }.
 *   empates({ equipos, ruedas, puntos })   torneo terminado: puntos es la lista de los puntos finales de cada equipo
 *                               (enteros ≥ 0). { partidos, maximo: 3·partidos (si no hubiera empates), total (suma de
 *                               puntos), empates: maximo − total (cada empate reparte 2 puntos en vez de 3), ganados:
 *                               partidos − empates (partidos con ganador), errores: porEquipo (2·empates: la suma de la
 *                               columna PE, que cuenta cada empate dos veces), faltanEntreDos (empates/2) y noSePuede
 *                               ('no-se-puede') }. Error si los puntos no caben entre 2·partidos y 3·partidos.
 *   tablaDesdeResultados({ equipos, resultados })   resultados: [[i, j, gi, gj]] (equipo i hizo gi goles y j hizo
 *                               gj; i ≠ j). { filas: [{ PJ, PG, PE, PP, GF, GC, DG: GF − GC, Pts }], partidos, empates,
 *                               puntos (suma), goles (suma de GF) }.
 *   revisarTabla({ equipos, ruedas, filas })   filas completas (sin null). { coherente, fallas: lista de códigos de lo
 *                               que no cuadra: 'PJ' (algún PJ ≠ ruedas·(n − 1)), 'suma-fila' (PG + PE + PP ≠ PJ),
 *                               'puntos' (Pts ≠ 3·PG + PE), 'ganados-perdidos' (ΣPG ≠ ΣPP), 'empates' (ΣPE impar),
 *                               'partidos' (ΣPG + ΣPE/2 ≠ número de partidos), 'goles' (ΣGF ≠ ΣGC) }.
 *   deducirTabla({ equipos, ruedas, filas })   filas con null en lo que falta. Prueba TODOS los resultados posibles
 *                               (gana el primero, empate o gana el segundo) de todos los partidos (hasta 10 partidos)
 *                               y se queda con los que dan los PJ, PG, PE, PP y Pts conocidos.
 *                               { posibles (cuántas combinaciones de resultados sirven), filas (las mismas filas con
 *                               cada casilla de PJ, PG, PE, PP y Pts que vale lo mismo en todas las combinaciones,
 *                               y null si no queda fija; GF o GC se completan solo si falta uno solo de todos ellos,
 *                               con ΣGF = ΣGC), opciones ({ 'fila.campo': [valores posibles, de menor a mayor] } para
 *                               cada casilla de PJ, PG, PE, PP o Pts que venía en null), unica (true si todas esas
 *                               casillas quedaron fijas) }. Error si ninguna combinación sirve (tabla incoherente).
 *   evaluar(expresion, valores)   evalúa un texto con números, variables (las claves de valores), + − * / % ^,
 *                               paréntesis, comparaciones (== != < <= > >=), && y || y !. Devuelve un número o un
 *                               booleano. == y != comparan números con tolerancia 1e-9 (y < > dejan ese margen);
 *                               a % b es el resto con el signo de b (−7 % 3 = 2); ^ es la potencia (agrupa a la
 *                               derecha: 2^3^2 = 512) y el signo − delante va después de ella (−2^2 = −4).
 *   suficiencia({ variables, base, pregunta, I, II })   suficiencia de datos por enumeración. variables:
 *                               { nombre: [min, max] } con enteros (se prueban todas las combinaciones; hasta 200 000);
 *                               base, I y II: listas de condiciones (textos para evaluar; I y II pueden ser un solo
 *                               texto); pregunta: la expresión cuyo valor se pide. Se toman las combinaciones que
 *                               cumplen la base y se mira qué valores de la pregunta quedan con I, con II y con las dos.
 *                               Una información «basta» si deja un solo valor. { clave: 'solo-I' | 'solo-II' |
 *                               'juntas' | 'cada-una' | 'faltan', basta: { I, II, juntas }, valores: { base, I, II,
 *                               juntas } (listas ordenadas sin repetir), soluciones: { base, I, II, juntas } (cuántas
 *                               combinaciones), candidatos (si la base deja hasta 400 combinaciones: [{ valores, I, II }],
 *                               si no, null), errores (cada uno es una clave): pareceBastar (la clave si se cree que basta
 *                               cuando quedan de 1 a 3 valores: se encuentra uno y no se buscan más), soloLaPrimera
 *                               ('solo-I' si I basta; si no, 'solo-II' si II basta; si ninguna basta, no va),
 *                               juntasPorSiAcaso ('juntas': usa las dos porque están), otraTambienBasta ('cada-una',
 *                               solo si basta exactamente una), ningunaSola ('faltan'), alReves (solo con clave solo-I o
 *                               solo-II: la otra), porClave ({ clave incorrecta: nombre del primer error que la da, o
 *                               null }) }. Error si la base, I, II o las dos juntas no dejan ninguna combinación.
 *   fraccion(x)                 { num, den, texto ('5/4' o '7') } si x es una fracción de denominador ≤ 1000 (con
 *                               tolerancia 1e-9); si no, null.
 *   CLAVES                      la lista ['solo-I', 'solo-II', 'juntas', 'cada-una', 'faltan'] (las alternativas A a E
 *                               del formato de admisión, en ese orden).
 *
 * Respaldos (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md): baseFinal es AR3 (el porcentaje sobre la
 * base equivocada; parcial: Jacobs Danan y Gelman, 2018, sin cifra propia); porcentajeComoCantidad y responder el
 * cambio en vez del porcentaje se parecen a AR5 (hipótesis). Leer las alturas dibujadas con el eje truncado, el tramo
 * más empinado, el punto más alto, el pictograma, la vuelta de 100, el porcentaje del porcentaje, los errores de la
 * tabla deportiva y los de suficiencia de datos son hipótesis nuestras.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorGraficos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const EPS = 1e-9;

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.noNegativo && x < 0) throw new Error(`${que} no puede ser negativo`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser como mucho ${o.max}`);
    return x;
  }
  function objeto(o, que) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error(`${que} debe ser un objeto con los datos`);
    return o;
  }
  function lista(l, que, min) {
    if (!Array.isArray(l)) throw new Error(`${que} debe ser una lista`);
    if (l.length < (min || 0)) throw new Error(`${que} debe tener al menos ${min} elementos`);
    return l;
  }
  // Quita el ruido de coma flotante cerca de un número con hasta 6 decimales.
  function limpio(x) {
    if (typeof x !== 'number') return x;
    for (const p of [1, 100, 1e4, 1e6]) { const y = Math.round(x * p) / p; if (Math.abs(x - y) <= 1e-11 * Math.max(1, Math.abs(x))) return y + 0; }
    return x;
  }
  const casi = (a, b) => Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
  function igualBase(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return casi(a, b);
    return a === b;
  }
  // Reparte los errores en errores / coinciden / repetidos. igual(a, b) dice si dos respuestas son la misma.
  function apartar(errores, correcto, igual) {
    igual = igual || igualBase;
    const e = {}, coinciden = [], repetidos = {};
    for (const [k, v] of Object.entries(errores)) {
      if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) continue;
      if (igual(v, correcto)) { coinciden.push(k); continue; }
      const antes = Object.keys(e).find(j => igual(e[j], v));
      if (antes) { repetidos[k] = antes; continue; }
      e[k] = typeof v === 'number' ? limpio(v) : v;
    }
    return { errores: e, coinciden, repetidos };
  }
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  function fraccion(x) {
    numero(x, 'el número');
    for (let den = 1; den <= 1000; den++) {
      const num = Math.round(x * den);
      if (Math.abs(num / den - x) <= 1e-9 * Math.max(1, Math.abs(x))) {
        const g = mcd(num, den) || 1, n = num / g, d = den / g;
        return { num: n + 0, den: d, texto: d === 1 ? String(n + 0) : `${n}/${d}` };
      }
    }
    return null;
  }
  const textoDe = x => { const f = fraccion(x); return f ? f.texto : null; };

  // ---------- Barras ----------
  function barras(o) {
    objeto(o, 'barras');
    const valores = lista(o.valores, 'valores', 1).map((v, k) => numero(v, `el valor ${k + 1}`));
    const inicio = numero(o.inicio === undefined ? 0 : o.inicio, 'el inicio del eje', { noNegativo: true });
    const tope = numero(o.tope === undefined ? Math.max(...valores) : o.tope, 'el tope del eje');
    if (!(tope > inicio)) throw new Error('el tope del eje debe ser mayor que su inicio');
    for (const v of valores) if (v < inicio - EPS || v > tope + EPS) throw new Error('cada valor debe estar entre el inicio y el tope del eje');
    return { inicio, tope, barras: valores.map(v => ({ valor: v, alto: limpio((v - inicio) / (tope - inicio)) })) };
  }
  function razonBarras(o) {
    objeto(o, 'razonBarras');
    const a = numero(o.a, 'a', { positivo: true }), b = numero(o.b, 'b', { positivo: true });
    const inicio = numero(o.inicio === undefined ? 0 : o.inicio, 'el inicio del eje', { noNegativo: true });
    if (!(a > b)) throw new Error('a debe ser mayor que b');
    if (!(b > inicio)) throw new Error('las dos barras deben pasar el inicio del eje');
    const razon = a / b, dibujada = (a - inicio) / (b - inicio);
    const sep = apartar({ alturas: dibujada, invertida: b / a, sobranteDibujado: (a - b) / (b - inicio) }, razon);
    return { razon: limpio(razon), exacto: textoDe(razon), diferencia: limpio(a - b), porcentajeMas: limpio((a - b) / b * 100),
      altoA: limpio(a - inicio), altoB: limpio(b - inicio), dibujada: limpio(dibujada), ...sep };
  }

  // ---------- Líneas ----------
  function crecimientos(o) {
    objeto(o, 'crecimientos');
    const v = lista(o.valores, 'valores', 2).map((x, k) => numero(x, `el valor ${k + 1}`, { positivo: true }));
    const tramos = [];
    for (let k = 0; k + 1 < v.length; k++) {
      const cambio = v[k + 1] - v[k];
      tramos.push({ desde: k, hasta: k + 1, de: v[k], a: v[k + 1], cambio: limpio(cambio), porcentaje: limpio(cambio / v[k] * 100), porcentajeFinal: limpio(cambio / v[k + 1] * 100) });
    }
    const suben = tramos.map((t, k) => k).filter(k => tramos[k].cambio > 0);
    if (!suben.length) throw new Error('ningún tramo sube');
    const argmax = (f) => suben.reduce((m, k) => (f(k) > f(m) + EPS ? k : m), suben[0]);
    const mayor = argmax(k => tramos[k].porcentaje);
    if (suben.some(k => k !== mayor && casi(tramos[k].porcentaje, tramos[mayor].porcentaje))) throw new Error('hay tramos empatados en el mayor porcentaje');
    const emp = argmax(k => tramos[k].cambio), fin = argmax(k => tramos[k].porcentajeFinal);
    let alto = 0; v.forEach((x, k) => { if (x > v[alto] + EPS) alto = k; });
    const correcto = { tramo: mayor, porcentaje: tramos[mayor].porcentaje };
    const igual = (e, c) => (e.indice !== undefined ? e.indice === c.tramo + 1 : e.tramo === c.tramo && casi(e.porcentaje, c.porcentaje));
    const igualE = (x, y) => (x.indice !== undefined || y.indice !== undefined ? x.indice === y.indice : x.tramo === y.tramo && casi(x.porcentaje, y.porcentaje));
    const sep = apartar({
      masEmpinado: { tramo: emp, cambio: tramos[emp].cambio, porcentaje: tramos[emp].porcentaje },
      baseFinal: { tramo: fin, porcentaje: tramos[fin].porcentajeFinal },
      puntoMasAlto: { indice: alto, valor: v[alto] },
    }, correcto, (x, y) => (y === correcto ? igual(x, y) : igualE(x, y)));
    return { tramos, mayor, porcentaje: tramos[mayor].porcentaje, cambio: tramos[mayor].cambio, exacto: textoDe(tramos[mayor].porcentaje), ...sep };
  }
  function dosCrecimientos(o) {
    objeto(o, 'dosCrecimientos');
    const par = (p, que) => {
      lista(p, que, 2);
      const de = numero(p[0], `${que}: el valor inicial`, { positivo: true }), a = numero(p[1], `${que}: el valor final`, { positivo: true });
      if (!(a > de)) throw new Error(`${que} debe subir`);
      return [de, a];
    };
    const u = par(o.uno, 'uno'), w = par(o.otro, 'otro');
    const cual = (x, y) => (casi(x, y) ? 'iguales' : x > y ? 'uno' : 'otro');
    const p1 = (u[1] - u[0]) / u[0] * 100, p2 = (w[1] - w[0]) / w[0] * 100;
    const mayor = cual(p1, p2);
    const sep = apartar({
      absoluta: cual(u[1] - u[0], w[1] - w[0]),
      llegaMasAlto: cual(u[1], w[1]),
      baseFinal: cual((u[1] - u[0]) / u[1], (w[1] - w[0]) / w[1]),
    }, mayor);
    return { porcentajes: [limpio(p1), limpio(p2)], cambios: [limpio(u[1] - u[0]), limpio(w[1] - w[0])], mayor, ...sep };
  }

  // ---------- Sectores ----------
  function sectores(o) {
    objeto(o, 'sectores');
    const c = lista(o.cantidades, 'cantidades', 2).map((x, k) => numero(x, `la cantidad ${k + 1}`, { noNegativo: true }));
    const total = c.reduce((s, x) => s + x, 0);
    if (!(total > 0)) throw new Error('el total debe ser mayor que cero');
    const sec = c.map(x => ({ cantidad: x, fraccion: textoDe(x / total), porcentaje: limpio(x / total * 100), grados: limpio(x / total * 360) }));
    return { total: limpio(total), sectores: sec, sumaPorcentajes: limpio(sec.reduce((s, x) => s + x.porcentaje, 0)), sumaGrados: limpio(sec.reduce((s, x) => s + x.grados, 0)) };
  }
  function cantidadDeSector(o) {
    objeto(o, 'cantidadDeSector');
    const total = numero(o.total, 'el total', { positivo: true }), g = numero(o.grados, 'los grados', { positivo: true, max: 360 });
    const cantidad = g / 360 * total, porcentaje = g / 360 * 100;
    const sep = apartar({ sobre100: g / 100 * total, gradosComoCantidad: g, porcentajeComoCantidad: porcentaje }, cantidad);
    return { cantidad: limpio(cantidad), porcentaje: limpio(porcentaje), fraccion: textoDe(g / 360), ...sep };
  }
  function gradosDeSector(o) {
    objeto(o, 'gradosDeSector');
    const total = numero(o.total, 'el total', { positivo: true }), c = numero(o.cantidad, 'la cantidad', { positivo: true });
    if (c > total + EPS) throw new Error('la cantidad no puede pasar del total');
    const grados = c / total * 360, porcentaje = c / total * 100;
    const sep = apartar({ porcentajeComoGrados: porcentaje, cantidadComoGrados: c, medioCirculo: c / total * 180 }, grados);
    return { grados: limpio(grados), porcentaje: limpio(porcentaje), fraccion: textoDe(c / total), ...sep };
  }
  function sectorAnidado(o) {
    objeto(o, 'sectorAnidado');
    const total = numero(o.total, 'el total', { positivo: true });
    const p = numero(o.porcentaje, 'el porcentaje del grupo', { positivo: true, max: 100 });
    const s = numero(o.parte, 'el porcentaje de la parte', { positivo: true, max: 100 });
    const pc = p * s / 100, grados = pc * 3.6;
    const sep = apartar({ parteDelTotal: s * 3.6, grupoEntero: p * 3.6, suma: p + s <= 100 + EPS ? (p + s) * 3.6 : null }, grados);
    return { porcentaje: limpio(pc), grados: limpio(grados), cantidad: limpio(pc / 100 * total), ...sep };
  }
  function pictograma(o) {
    objeto(o, 'pictograma');
    const f = numero(o.factor, 'el factor', { positivo: true });
    if (casi(f, 1)) throw new Error('el factor debe ser distinto de 1');
    const sep = apartar({ lineal: f, doble: 2 * f, cubo: f * f * f }, f * f);
    return { alto: f, area: limpio(f * f), volumen: limpio(f * f * f), ...sep };
  }

  // ---------- Campeonato ----------
  function equiposYRuedas(o) {
    const n = numero(o.equipos, 'el número de equipos', { entero: true, min: 2 });
    const r = numero(o.ruedas === undefined ? 1 : o.ruedas, 'las ruedas', { entero: true, min: 1, max: 2 });
    return [n, r];
  }
  function partidos(o) {
    objeto(o, 'partidos');
    const [n, r] = equiposYRuedas(o);
    const total = r * n * (n - 1) / 2;
    const sep = apartar({ unaRueda: n * (n - 1) / 2, cuadrado: n * n, dobleConteo: r * n * (n - 1) }, total);
    return { partidos: total, porEquipo: r * (n - 1), ...sep };
  }
  function empates(o) {
    objeto(o, 'empates');
    const [n, r] = equiposYRuedas(o);
    const pts = lista(o.puntos, 'puntos', n).map((x, k) => numero(x, `los puntos del equipo ${k + 1}`, { entero: true, noNegativo: true }));
    if (pts.length !== n) throw new Error('debe haber un puntaje por equipo');
    const pj = r * n * (n - 1) / 2, total = pts.reduce((s, x) => s + x, 0), maximo = 3 * pj, e = maximo - total;
    if (e < 0 || e > pj) throw new Error('los puntos no cuadran con el número de partidos');
    const sep = apartar({ porEquipo: 2 * e, faltanEntreDos: e / 2, noSePuede: 'no-se-puede' }, e);
    return { partidos: pj, maximo, total, empates: e, ganados: pj - e, ...sep };
  }
  function tablaDesdeResultados(o) {
    objeto(o, 'tablaDesdeResultados');
    const n = numero(o.equipos, 'el número de equipos', { entero: true, min: 2 });
    const res = lista(o.resultados, 'resultados', 1);
    const filas = Array.from({ length: n }, () => ({ PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, DG: 0, Pts: 0 }));
    let emp = 0;
    for (const [k, p] of res.entries()) {
      lista(p, `el resultado ${k + 1}`, 4);
      const [i, j] = [p[0], p[1]].map(x => numero(x, `un equipo del resultado ${k + 1}`, { entero: true, min: 0, max: n - 1 }));
      const [gi, gj] = [p[2], p[3]].map(x => numero(x, `los goles del resultado ${k + 1}`, { entero: true, noNegativo: true }));
      if (i === j) throw new Error('un equipo no juega contra sí mismo');
      const A = filas[i], B = filas[j];
      A.PJ++; B.PJ++; A.GF += gi; A.GC += gj; B.GF += gj; B.GC += gi;
      if (gi > gj) { A.PG++; B.PP++; } else if (gi < gj) { B.PG++; A.PP++; } else { A.PE++; B.PE++; emp++; }
    }
    for (const f of filas) { f.DG = f.GF - f.GC; f.Pts = 3 * f.PG + f.PE; }
    return { filas, partidos: res.length, empates: emp, puntos: filas.reduce((s, f) => s + f.Pts, 0), goles: filas.reduce((s, f) => s + f.GF, 0) };
  }
  const CAMPOS = ['PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'Pts'];
  function leerFilas(o, n, conNull) {
    const filas = lista(o.filas, 'filas', n);
    if (filas.length !== n) throw new Error('debe haber una fila por equipo');
    return filas.map((f, k) => {
      objeto(f, `la fila ${k + 1}`);
      const g = {};
      for (const c of CAMPOS) {
        const v = f[c];
        if (v === null || v === undefined) { if (!conNull) throw new Error(`falta ${c} en la fila ${k + 1}`); g[c] = null; }
        else g[c] = numero(v, `${c} de la fila ${k + 1}`, { entero: true, noNegativo: true });
      }
      return g;
    });
  }
  function revisarTabla(o) {
    objeto(o, 'revisarTabla');
    const [n, r] = equiposYRuedas(o);
    const F = leerFilas(o, n, false), fallas = [];
    const suma = c => F.reduce((s, f) => s + f[c], 0);
    if (F.some(f => f.PJ !== r * (n - 1))) fallas.push('PJ');
    if (F.some(f => f.PG + f.PE + f.PP !== f.PJ)) fallas.push('suma-fila');
    if (F.some(f => f.Pts !== 3 * f.PG + f.PE)) fallas.push('puntos');
    if (suma('PG') !== suma('PP')) fallas.push('ganados-perdidos');
    if (suma('PE') % 2) fallas.push('empates');
    if (suma('PG') + suma('PE') / 2 !== r * n * (n - 1) / 2) fallas.push('partidos');
    if (suma('GF') !== suma('GC')) fallas.push('goles');
    return { coherente: fallas.length === 0, fallas };
  }
  function deducirTabla(o) {
    objeto(o, 'deducirTabla');
    const [n, r] = equiposYRuedas(o);
    const F = leerFilas(o, n, true);
    const pares = [];
    for (let v = 0; v < r; v++) for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pares.push([i, j]);
    if (pares.length > 10) throw new Error('para deducir la tabla, como mucho 10 partidos');
    const W = ['PJ', 'PG', 'PE', 'PP', 'Pts'];
    const vistos = F.map(() => Object.fromEntries(W.map(c => [c, new Set()])));
    let posibles = 0;
    const total = Math.pow(3, pares.length);
    for (let m = 0; m < total; m++) {
      const t = Array.from({ length: n }, () => ({ PJ: 0, PG: 0, PE: 0, PP: 0, Pts: 0 }));
      let x = m;
      for (const [i, j] of pares) {
        const res = x % 3; x = (x - res) / 3;
        t[i].PJ++; t[j].PJ++;
        if (res === 0) { t[i].PG++; t[j].PP++; } else if (res === 1) { t[i].PE++; t[j].PE++; } else { t[j].PG++; t[i].PP++; }
      }
      for (const f of t) f.Pts = 3 * f.PG + f.PE;
      let sirve = true;
      for (let k = 0; k < n && sirve; k++) for (const c of W) if (F[k][c] !== null && F[k][c] !== t[k][c]) { sirve = false; break; }
      if (!sirve) continue;
      posibles++;
      for (let k = 0; k < n; k++) for (const c of W) vistos[k][c].add(t[k][c]);
    }
    if (!posibles) throw new Error('la tabla no es coherente: ningún conjunto de resultados la da');
    const filas = F.map((f, k) => {
      const g = Object.assign({}, f);
      for (const c of W) if (g[c] === null && vistos[k][c].size === 1) g[c] = [...vistos[k][c]][0];
      return g;
    });
    const faltaGol = [];
    F.forEach((f, k) => ['GF', 'GC'].forEach(c => { if (f[c] === null) faltaGol.push([k, c]); }));
    if (faltaGol.length === 1) {
      const [k, c] = faltaGol[0], otro = c === 'GF' ? 'GC' : 'GF';
      const v = F.reduce((s, f) => s + f[otro], 0) - F.reduce((s, f, j) => s + (j === k ? 0 : f[c]), 0);
      if (v < 0) throw new Error('la tabla no es coherente: los goles no cuadran');
      filas[k][c] = v;
    }
    const opciones = {};
    let unica = true;
    F.forEach((f, k) => W.forEach(c => {
      if (f[c] !== null) return;
      opciones[`${k}.${c}`] = [...vistos[k][c]].sort((a, b) => a - b);
      if (vistos[k][c].size !== 1) unica = false;
    }));
    return { posibles, filas, opciones, unica };
  }

  // ---------- Expresiones (para las condiciones de suficiencia de datos) ----------
  const TOK = /\s*(\d+(?:\.\d+)?|[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ_]*|==|!=|<=|>=|&&|\|\||[-+*/%^()<>!])/y;
  const CACHE = new Map();
  function compilar(texto) {
    if (typeof texto !== 'string' || !texto.trim()) throw new Error('la expresión debe ser un texto');
    if (CACHE.has(texto)) return CACHE.get(texto);
    const toks = [];
    TOK.lastIndex = 0;
    let fin = 0;
    while (TOK.lastIndex < texto.length) {
      const m = TOK.exec(texto);
      if (!m) { if (/^\s*$/.test(texto.slice(fin))) break; throw new Error(`no se entiende la expresión cerca de «${texto.slice(fin)}»`); }
      toks.push(m[1]); fin = TOK.lastIndex;
    }
    let k = 0;
    const ver = () => toks[k], tomar = () => toks[k++];
    const esperar = t => { if (toks[k] !== t) throw new Error(`falta «${t}» en «${texto}»`); k++; };
    const num = f => v => { const x = f(v); if (typeof x !== 'number') throw new Error(`se esperaba un número en «${texto}»`); return x; };
    function prim() {
      const t = tomar();
      if (t === undefined) throw new Error(`la expresión «${texto}» termina antes de tiempo`);
      if (t === '(') { const e = o_(); esperar(')'); return e; }
      if (/^\d/.test(t)) { const c = Number(t); return () => c; }
      if (/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_]/.test(t)) return v => { if (!(t in v)) throw new Error(`no conozco la variable «${t}»`); return v[t]; };
      throw new Error(`no se entiende «${t}» en «${texto}»`);
    }
    function unario() {
      if (ver() === '-') { tomar(); const e = num(unario()); return v => -e(v); }
      if (ver() === '!') { tomar(); const e = unario(); return v => !e(v); }
      return potencia();
    }
    function potencia() {
      const b = prim();
      if (ver() === '^') { tomar(); const e = num(unario()), bb = num(b); return v => Math.pow(bb(v), e(v)); }
      return b;
    }
    function producto() {
      let a = unario();
      while (['*', '/', '%'].includes(ver())) {
        const op = tomar(), x = num(a), y = num(unario());
        a = op === '*' ? v => x(v) * y(v) : op === '/' ? v => x(v) / y(v) : v => { const p = x(v), q = y(v); return p - q * Math.floor(p / q); };
      }
      return a;
    }
    function suma() {
      let a = producto();
      while (ver() === '+' || ver() === '-') {
        const op = tomar(), x = num(a), y = num(producto());
        a = op === '+' ? v => x(v) + y(v) : v => x(v) - y(v);
      }
      return a;
    }
    function comparacion() {
      const a = suma();
      if (['==', '!=', '<', '<=', '>', '>='].includes(ver())) {
        const op = tomar(), x = num(a), y = num(suma());
        const f = { '==': (p, q) => casi(p, q), '!=': (p, q) => !casi(p, q), '<': (p, q) => p < q - EPS, '<=': (p, q) => p <= q + EPS, '>': (p, q) => p > q + EPS, '>=': (p, q) => p >= q - EPS }[op];
        return v => f(x(v), y(v));
      }
      return a;
    }
    function y_() { let a = comparacion(); while (ver() === '&&') { tomar(); const x = a, b = comparacion(); a = v => !!x(v) && !!b(v); } return a; }
    function o_() { let a = y_(); while (ver() === '||') { tomar(); const x = a, b = y_(); a = v => !!x(v) || !!b(v); } return a; }
    const f = o_();
    if (k !== toks.length) throw new Error(`sobra «${toks.slice(k).join(' ')}» en «${texto}»`);
    CACHE.set(texto, f);
    return f;
  }
  function evaluar(texto, valores) {
    objeto(valores, 'los valores');
    const x = compilar(texto)(valores);
    return typeof x === 'number' ? limpio(x) : x;
  }

  // ---------- Suficiencia de datos ----------
  const CLAVES = ['solo-I', 'solo-II', 'juntas', 'cada-una', 'faltan'];
  const conds = (c, que) => {
    if (c === undefined || c === null) return [];
    const l = typeof c === 'string' ? [c] : lista(c, que);
    return l.map(t => { if (typeof t !== 'string') throw new Error(`${que}: cada condición debe ser un texto`); return compilar(t); });
  };
  function claveDe(bI, bII, bJ) { return bI && bII ? 'cada-una' : bI ? 'solo-I' : bII ? 'solo-II' : bJ ? 'juntas' : 'faltan'; }
  function suficiencia(o) {
    objeto(o, 'suficiencia');
    const vars = Object.entries(objeto(o.variables, 'variables'));
    if (!vars.length) throw new Error('falta al menos una variable');
    let tam = 1;
    for (const [nombre, r] of vars) {
      lista(r, `el rango de ${nombre}`, 2);
      numero(r[0], `el mínimo de ${nombre}`, { entero: true }); numero(r[1], `el máximo de ${nombre}`, { entero: true });
      if (r[1] < r[0]) throw new Error(`el rango de ${nombre} está al revés`);
      tam *= r[1] - r[0] + 1;
    }
    if (tam > 200000) throw new Error('demasiadas combinaciones (hasta 200 000)');
    const base = conds(o.base, 'base'), cI = conds(o.I, 'I'), cII = conds(o.II, 'II');
    if (!cI.length || !cII.length) throw new Error('I y II deben traer al menos una condición');
    const preg = compilar(o.pregunta);
    const sets = { base: new Set(), I: new Set(), II: new Set(), juntas: new Set() }, cuenta = { base: 0, I: 0, II: 0, juntas: 0 };
    const cand = [];
    const v = {};
    const cumple = (cs) => cs.every(f => !!f(v));
    (function recorrer(k) {
      if (k === vars.length) {
        if (!cumple(base)) return;
        const q = limpio(preg(v));
        if (typeof q !== 'number') throw new Error('la pregunta debe dar un número');
        const okI = cumple(cI), okII = cumple(cII);
        cuenta.base++; sets.base.add(q);
        if (okI) { cuenta.I++; sets.I.add(q); }
        if (okII) { cuenta.II++; sets.II.add(q); }
        if (okI && okII) { cuenta.juntas++; sets.juntas.add(q); }
        if (cand.length <= 400) cand.push({ valores: Object.assign({}, v), I: okI, II: okII });
        return;
      }
      const [nombre, [a, b]] = vars[k];
      for (let x = a; x <= b; x++) { v[nombre] = x; recorrer(k + 1); }
    })(0);
    if (!cuenta.base) throw new Error('ninguna combinación cumple el enunciado');
    if (!cuenta.I) throw new Error('la información I contradice el enunciado');
    if (!cuenta.II) throw new Error('la información II contradice el enunciado');
    if (!cuenta.juntas) throw new Error('las informaciones I y II se contradicen');
    const valores = {}; for (const k of Object.keys(sets)) valores[k] = [...sets[k]].sort((p, q) => p - q);
    const basta = { I: valores.I.length === 1, II: valores.II.length === 1, juntas: valores.juntas.length === 1 };
    const clave = claveDe(basta.I, basta.II, basta.juntas);
    const parece = s => s.length >= 1 && s.length <= 3;
    const err = {
      pareceBastar: claveDe(parece(valores.I), parece(valores.II), parece(valores.juntas)),
      soloLaPrimera: basta.I ? 'solo-I' : basta.II ? 'solo-II' : null,
      juntasPorSiAcaso: 'juntas',
      otraTambienBasta: basta.I !== basta.II ? 'cada-una' : null,
      ningunaSola: 'faltan',
      alReves: clave === 'solo-I' ? 'solo-II' : clave === 'solo-II' ? 'solo-I' : null,
    };
    const sep = apartar(err, clave);
    const porClave = {};
    for (const c of CLAVES) if (c !== clave) porClave[c] = Object.keys(sep.errores).find(k => sep.errores[k] === c) || null;
    return { clave, basta, valores, soluciones: cuenta, candidatos: cuenta.base <= 400 ? cand : null, ...sep, porClave };
  }

  return { barras, razonBarras, crecimientos, dosCrecimientos, sectores, cantidadDeSector, gradosDeSector, sectorAnidado, pictograma,
    partidos, empates, tablaDesdeResultados, revisarTabla, deducirTabla, evaluar, suficiencia, fraccion, CLAVES };
});
