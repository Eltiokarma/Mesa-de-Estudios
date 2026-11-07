/*
 * Motor de «Del pozo al cielo»: combustión, petróleo, metalurgia y la química del aire y del agua.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorAmbiente) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: masa en g (la metalurgia acepta cualquier unidad de masa y devuelve la misma); moles en mol; volumen en L
 * (la densidad en g/mL); temperatura en °C; concentración en mol/L; ppm y ppb en masa (en agua, 1 ppm = 1 mg/L y
 * 1 ppb = 1 µg/L, porque 1 L de agua pesa 1 kg); ozono en unidades Dobson (DU); CO₂ del aire en ppm.
 * Masas atómicas de academia: H = 1, C = 12, N = 14, O = 16, S = 32, Fe = 56, Cu = 63,5, Zn = 65.
 *
 * Funciones (una fórmula es un objeto { C: 8, H: 18 }; un hidrocarburo es un nombre de HIDROCARBUROS o { C, H }):
 *  - masaMolar(f). balance(reactivos, productos), con cada lado [[coeficiente, fórmula], ...]: { atomos { el: [izq,
 *    der] }, balanceada, masas [izq, der] }.
 *  - combustion(hc, tipo): ecuación balanceada con enteros mínimos. tipo 'completa' (CO₂ y H₂O), 'incompleta' (todo el
 *    C como CO) u 'hollin' (todo el C como C sólido). { coef { comb, O2, CO2, CO, C, H2O }, texto, atomos, masas }.
 *  - repartoO2(hc, nComb, nO2): con el O₂ que hay. El O alcanza primero para el H₂O, después para el CO y, si sobra,
 *    pasa el CO a CO₂. Si no alcanza ni para el agua, se quema solo una parte del combustible (el resto sobra).
 *    { H2O, CO, CO2, C, O2, comb (sobrantes), productos [especies con cantidad > 0], razon (O₂ por combustible),
 *    umbrales { hollin, todoCO, todoCO2 } (O₂ por mol de combustible), masas [antes, después], errores {
 *    'menos-de-lo-mismo': solo CO₂ y H₂O, en la proporción de la completa, sin sobrante; 'no-hay-reaccion': nada
 *    cambia; 'sobra-combustible': la ecuación completa con el O₂ como limitante } }.
 *  - balanzaCombustion(hc, masaComb, masaO2, masaFrasco, cerrado): { antes, despues, comparada ('igual' | 'menor'),
 *    gases (masa de CO₂ y H₂O que se forma), O2usado, errores { 'gases-no-pesan', 'se-vuelve-energia',
 *    'se-suma-oxigeno' } }. Abierto: el O₂ sale del aire (sin límite) y los gases se van; queda el frasco.
 *  - co2DeCombustible(masa, hc): combustión completa. { n, CO2, O2, H2O, razon (CO₂/combustible) }.
 *    co2PorLitro(L, densidad, hc): lo mismo con masa = 1000·L·densidad; errores { 'no-supera-al-combustible',
 *    'olvida-los-carbonos', 'litro-como-kilo' }.
 *  - octanaje(fraccionIsooctano). mezclaOctanaje([{ vol, oct }, ...]): { octanaje, regla, errores
 *    { 'promedio-simple', 'manda-la-mejor', 'manda-la-peor' } }. paraLlegar(oA, oB, objetivo): fracción de B.
 *  - ppm(mgSoluto, litros): { mgL, ppm, ppb, porcentaje, errores { 'g-por-litro', 'ppb-entre-mil',
 *    'porcentaje-entre-100' } }. dosisPpm(ppm, litros): { mg, g, errores }. ppmAPorcentaje(ppm): { porcentaje, errores }.
 *  - pH(H). acidoFuerte(c, nH): { H, pH, errores { 'un-H' } }. compararPH(pHa, pHb): { veces (cuántas veces más H⁺
 *    tiene a que b), errores { 'lineal' } }. lluvia({ SO2, NO2 }): concentraciones en mol/L de lo que se disolvió y
 *    oxidó en la gota; { acidos, H, pH, errores { 'culpa-al-CO2', 'un-H-del-sulfurico' } }. LLUVIA_NORMAL = 5,6.
 *    so2AAcido(m), no2AAcido(m): masa de H₂SO₄ o HNO₃ que sale de m gramos del gas.
 *  - torre(bandejas?, sustancias?, Thorno?): destilación fraccionada. { destino { s: índice | 'gases' | 'fondo' },
 *    fraccion { s: nombre }, bandejas [{ T, nombre, sustancias }], errores { 'por-densidad', 'el-calor-sube',
 *    'invierte-la-regla' } }, cada error con el lugar que daría a cada sustancia: 'por-densidad', las de 12 C o más
 *    al fondo y las demás en su lugar real; 'el-calor-sube', se ordenan por punto de ebullición y cada una va al lugar
 *    real de la que ocupa la posición simétrica (la que hierve más alto, donde va la que hierve más bajo), DENTRO
 *    de la lista de sustancias que se pasa (con otra lista cambia la simetría);
 *    'invierte-la-regla', la bandeja más fría de las que están MÁS calientes que su punto de ebullición, sin contar
 *    el horno (si ninguna, 'gases'). Sustancias por omisión (SUST_TORRE): metano, pentano, octano, dodecano,
 *    hexadecano, tetracosano y residuo. La bandeja de abajo tiene que estar más fría que el horno. condensaEn(s, bandejas?, Thorno?).
 *    fraccionPorCarbonos(n).
 *  - metalurgia(mena, masa, ley, rendimiento): { puro, teorico, real, gas, errores { 'sin-ley', 'sin-rendimiento',
 *    'suma-perdidas' } }. MENAS: blenda (ZnS), calcosina (Cu₂S) y hematita (Fe₂O₃).
 *  - oxidarHierro(masaFe, fraccion?): 4Fe + 3O₂ → 2Fe₂O₃. { Fe2O3, O, masaFinal, errores { 'resta-oxigeno',
 *    'no-cambia', 'uno-a-uno' } }. corrosion({ agua, oxigeno, sal }): { seOxida, rapidez } (QA17).
 *  - cielo({ ozono, co2 }): { uv (índice relativo, 1 con 300 DU), T (°C, media de equilibrio del modelo) }.
 *    cambioCielo(a, b): { uv, T } en 'sube' | 'igual' | 'baja', errores para el agujero de ozono.
 *  - eutrofizacion(nutrientes, dias?): serie diaria { algas, muertas, O2 (mg/L), peces (fracción viva) }.
 *  - smog(trafico, sol?): 24 horas de { sol, NO2 (los NOₓ del aire), O3 } (unidades relativas); horaPico; errores
 *    { 'sale-del-escape': la hora con más NOₓ, donde estaría el pico si el ozono saliera del escape }.
 *  - MOLECULAS[s]: dibujo 2D de cada especie ({ el, x, y } en largos de enlace). caja(lista, W, H, semilla): posiciones
 *    sin enciman. reacomodo(antes, despues, W, H, semilla): cada átomo de antes con su lugar en después (los mismos
 *    átomos: si no cuadran, error).
 *
 * Datos declarados (por verificar con la tabla que use el colegio):
 *  - Puntos de ebullición (°C, de tabla, redondeados): metano −161,5; propano −42,1; butano −0,5; pentano 36,1;
 *    n-heptano 98,4; isooctano 99,2; octano 125,7; dodecano 216,3; hexadecano 286,9; tetracosano (C₂₄) 391. El residuo es un C₃₀H₆₂ de modelo
 *    a 450 °C. Torre de modelo: bandejas de abajo arriba a 350, 250, 150 y 30 °C (aceites y fuel, diésel, queroseno y
 *    gasolina), el horno a 400 °C. Lo que hierve sobre el horno queda en el fondo (residuo); lo que no se condensa en
 *    ninguna bandeja sale arriba como gas. Fracciones por número de carbonos: gases 1–4, gasolina 5–10, queroseno
 *    11–15, diésel 16–20, aceites y fuel 21–29, residuo 30 o más.
 *  - Gasolina modelada como octano puro, 0,70 g/mL. Octanaje: regla lineal por volumen, la de academia (la mezcla real
 *    no es lineal).
 *  - Lluvia «normal» (solo con el CO₂ del aire): pH 5,6. La gota se modela con [H⁺]² − cA·[H⁺] − K = 0, con
 *    K = 10^−11,2 (el CO₂ disuelto, ajustado para dar 5,6 sin otros ácidos) y cA = 2·[H₂SO₄] + [HNO₃], ácidos fuertes
 *    disociados por completo (el segundo H⁺ del H₂SO₄ también, como en academia).
 *  - Cielo (modelo de juguete, solo para comparar): ultravioleta en el suelo ∝ (300/DU)^1,1; temperatura media
 *    T = 14 + 3·log₂(CO₂/280) °C (3 °C por cada vez que se duplica el CO₂, valor central del IPCC). El ozono casi no
 *    cambia la temperatura media: el modelo lo toma como cero.
 *  - Eutrofización (modelo de juguete, por día): algas logísticas (crecen 90 % por día) con techo de 10 unidades por
 *    unidad de nutriente, que se acaban en 10 días; después las algas mueren (20 % por día); las bacterias gastan
 *    2 mg/L de O₂ por unidad de alga que se descompone (25 % de las muertas por día); el aire repone el 15 % de lo que falta hasta 8 mg/L. Los peces
 *    mueren (30 % por día) con menos de 2 mg/L.
 *  - Smog (modelo de juguete, por hora): sol = sen(π(h − 6)/12) de 6 a 18 h; los autos echan NOₓ con dos horas punta
 *    (8 y 18 h) y el 8 % se va cada hora; el O₃ se forma con 0,35·sol·NOₓ (gastando ese NOₓ) y se pierde un 20 % por
 *    hora. Se corren dos días y se devuelve el segundo.
 *
 * Errores típicos (campo 'errores'): QA9 (la masa baja en el frasco cerrado), QA10 (el combustible se vuelve energía),
 * QA11 (el hierro oxidado pesa menos), QA13 (la torre separa por densidad), QA1 y QA2 (el agujero de ozono calienta),
 * QA3 y QA4 (el CO o el CO₂ dan la lluvia ácida) y los de cálculo de «Lo que no tiene respaldo» del informe.
 * CABECERA: líneas 1 a 85 (funciones, unidades, datos declarados y errores).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorAmbiente = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = { H: 1, C: 12, N: 14, O: 16, S: 32, Fe: 56, Cu: 63.5, Zn: 65 };
  const num = (x, que) => {
    const v = Number(x);
    if (!Number.isFinite(v)) throw new Error(`${que} no es un número`);
    return v;
  };
  const pos = (x, que) => { const v = num(x, que); if (!(v > 0)) throw new Error(`${que} tiene que ser positivo`); return v; };
  const frac = (x, que) => { const v = num(x, que); if (v < 0 || v > 1) throw new Error(`${que} va de 0 a 1`); return v; };
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  function masaMolar(f) {
    let m = 0;
    for (const [el, n] of Object.entries(f)) {
      if (!(el in MASAS)) throw new Error(`elemento desconocido: ${el}`);
      m += MASAS[el] * n;
    }
    return m;
  }
  const F = { O2: { O: 2 }, CO2: { C: 1, O: 2 }, CO: { C: 1, O: 1 }, C: { C: 1 }, H2O: { H: 2, O: 1 }, SO2: { S: 1, O: 2 },
    SO3: { S: 1, O: 3 }, H2SO4: { H: 2, S: 1, O: 4 }, NO2: { N: 1, O: 2 }, HNO3: { H: 1, N: 1, O: 3 }, Fe: { Fe: 1 },
    Fe2O3: { Fe: 2, O: 3 }, ZnS: { Zn: 1, S: 1 }, ZnO: { Zn: 1, O: 1 }, Zn: { Zn: 1 }, Cu2S: { Cu: 2, S: 1 }, Cu: { Cu: 1 } };
  const M = k => masaMolar(F[k]);

  function balance(reactivos, productos) {
    const atomos = {}, masas = [0, 0];
    [reactivos, productos].forEach((lado, i) => {
      for (const [c, f] of lado) {
        for (const [el, n] of Object.entries(f)) { atomos[el] = atomos[el] || [0, 0]; atomos[el][i] += c * n; }
        masas[i] += c * masaMolar(f);
      }
    });
    const balanceada = Object.values(atomos).every(([a, b]) => Math.abs(a - b) < 1e-9);
    return { atomos, balanceada, masas };
  }

  // ---------------- Hidrocarburos y combustión ----------------
  const HIDROCARBUROS = {
    metano: { C: 1, H: 4, nombre: 'metano', Teb: -161.5 },
    propano: { C: 3, H: 8, nombre: 'propano', Teb: -42.1 },
    butano: { C: 4, H: 10, nombre: 'butano', Teb: -0.5 },
    pentano: { C: 5, H: 12, nombre: 'pentano', Teb: 36.1 },
    heptano: { C: 7, H: 16, nombre: 'n-heptano', Teb: 98.4 },
    isooctano: { C: 8, H: 18, nombre: 'isooctano', Teb: 99.2 },
    octano: { C: 8, H: 18, nombre: 'octano', Teb: 125.7 },
    dodecano: { C: 12, H: 26, nombre: 'dodecano', Teb: 216.3 },
    hexadecano: { C: 16, H: 34, nombre: 'hexadecano', Teb: 286.9 },
    tetracosano: { C: 24, H: 50, nombre: 'tetracosano', Teb: 391 },
    residuo: { C: 30, H: 62, nombre: 'residuo (C₃₀)', Teb: 450 },
  };
  function hc(x) {
    if (typeof x === 'string') {
      const h = HIDROCARBUROS[x];
      if (!h) throw new Error(`hidrocarburo desconocido: ${x}`);
      return h;
    }
    if (!x || !Number.isInteger(x.C) || !Number.isInteger(x.H) || x.C < 1 || x.H < 1) throw new Error('el hidrocarburo necesita C y H enteros');
    return x;
  }
  const formulaTxt = h => {
    const sub = n => String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
    return `C${h.C > 1 ? sub(h.C) : ''}H${sub(h.H)}`;
  };

  function combustion(x, tipo) {
    const h = hc(x), t = tipo || 'completa';
    // O₂ por combustible, en cuartos para trabajar con enteros.
    const o4 = { completa: 4 * h.C + h.H, incompleta: 2 * h.C + h.H, hollin: h.H }[t];
    if (o4 === undefined) throw new Error(`tipo desconocido: ${t}`);
    let k = [4, o4, t === 'completa' ? 4 * h.C : 0, t === 'incompleta' ? 4 * h.C : 0, t === 'hollin' ? 4 * h.C : 0, 2 * h.H];
    const g = k.filter(v => v).reduce(mcd);
    k = k.map(v => v / g);
    const coef = { comb: k[0], O2: k[1], CO2: k[2], CO: k[3], C: k[4], H2O: k[5] };
    const fc = { C: h.C, H: h.H };
    const prod = [['CO2', coef.CO2], ['CO', coef.CO], ['C', coef.C], ['H2O', coef.H2O]].filter(p => p[1]);
    const b = balance([[coef.comb, fc], [coef.O2, F.O2]], prod.map(([s, c]) => [c, F[s]]));
    const nom = { CO2: 'CO₂', CO: 'CO', C: 'C', H2O: 'H₂O' }, c1 = c => (c === 1 ? '' : c);
    const texto = `${c1(coef.comb)}${formulaTxt(h)} + ${c1(coef.O2)}O₂ → ${prod.map(([s, c]) => c1(c) + nom[s]).join(' + ')}`;
    return { coef, texto, atomos: b.atomos, balanceada: b.balanceada, masas: b.masas };
  }

  function repartoO2(x, nComb, nO2) {
    const h = hc(x); nComb = pos(nComb, 'nComb'); nO2 = num(nO2, 'nO2');
    if (nO2 < 0) throw new Error('nO2 no puede ser negativo');
    const umbrales = { hollin: h.H / 4, todoCO: h.C / 2 + h.H / 4, todoCO2: h.C + h.H / 4 };
    let O = 2 * nO2;
    const aguaO = nComb * h.H / 2;
    const r = { H2O: 0, CO: 0, CO2: 0, C: 0, O2: 0, comb: 0 };
    if (O < aguaO) {
      const f = O / aguaO;
      r.H2O = O; r.C = f * nComb * h.C; r.comb = nComb * (1 - f); O = 0;
    } else {
      r.H2O = aguaO; O -= aguaO;
      const co = Math.min(O, nComb * h.C); O -= co;
      const pasa = Math.min(O, co); O -= pasa;
      r.CO = co - pasa; r.CO2 = pasa; r.C = nComb * h.C - co; r.O2 = O / 2;
    }
    const limpio = v => (Math.abs(v) < 1e-12 ? 0 : v);
    for (const k of Object.keys(r)) r[k] = limpio(r[k]);
    const fc = { C: h.C, H: h.H };
    const masaDe = o => o.comb * masaMolar(fc) + o.O2 * M('O2') + o.CO2 * M('CO2') + o.CO * M('CO') + o.C * MASAS.C + o.H2O * M('H2O');
    const productos = ['CO2', 'CO', 'C', 'H2O', 'O2', 'comb'].filter(k => r[k] > 0);
    // Errores: lo que diría cada idea.
    const lim = Math.min(nComb, nO2 / umbrales.todoCO2);
    const errores = {
      'menos-de-lo-mismo': { CO2: nComb * h.C, H2O: nComb * h.H / 2, CO: 0, C: 0, comb: 0 },
      'no-hay-reaccion': { CO2: 0, H2O: 0, CO: 0, C: 0, comb: nComb, O2: nO2 },
      'sobra-combustible': { CO2: lim * h.C, H2O: lim * h.H / 2, CO: 0, C: 0, comb: nComb - lim, O2: nO2 - lim * umbrales.todoCO2 },
    };
    return Object.assign(r, { productos, razon: nO2 / nComb, umbrales,
      masas: [nComb * masaMolar(fc) + nO2 * M('O2'), masaDe(r)], errores });
  }

  function balanzaCombustion(x, masaComb, masaO2, masaFrasco, cerrado) {
    const h = hc(x), Mc = masaMolar({ C: h.C, H: h.H });
    masaComb = pos(masaComb, 'masaComb'); masaFrasco = num(masaFrasco, 'masaFrasco');
    const n = masaComb / Mc;
    if (cerrado) {
      masaO2 = num(masaO2, 'masaO2');
      const r = repartoO2(h, n, masaO2 / M('O2'));
      const antes = masaFrasco + masaComb + masaO2, despues = masaFrasco + r.masas[1];
      const gases = r.CO2 * M('CO2') + r.CO * M('CO') + r.H2O * M('H2O');
      const O2usado = masaO2 - r.O2 * M('O2');
      return { antes, despues, comparada: Math.abs(despues - antes) < 1e-9 ? 'igual' : despues < antes ? 'menor' : 'mayor',
        gases, O2usado, reparto: r,
        errores: { 'gases-no-pesan': antes - gases, 'se-vuelve-energia': antes - masaComb, 'se-suma-oxigeno': antes + O2usado } };
    }
    const c = co2DeCombustible(masaComb, h);
    const antes = masaFrasco + masaComb, despues = masaFrasco;
    return { antes, despues, comparada: 'menor', gases: c.CO2 + c.H2O, O2usado: c.O2, reparto: null,
      errores: { 'gases-no-pesan': antes, 'se-vuelve-energia': despues, 'se-suma-oxigeno': antes + c.O2 } };
  }

  function co2DeCombustible(masa, x) {
    const h = hc(x); masa = pos(masa, 'masa');
    const n = masa / masaMolar({ C: h.C, H: h.H });
    const CO2 = n * h.C * M('CO2'), O2 = n * (h.C + h.H / 4) * M('O2'), H2O = n * h.H / 2 * M('H2O');
    return { n, CO2, O2, H2O, razon: CO2 / masa };
  }
  function co2PorLitro(L, densidad, x) {
    L = pos(L, 'L'); densidad = pos(densidad === undefined ? 0.7 : densidad, 'densidad');
    const h = hc(x || 'octano'), masa = 1000 * L * densidad;
    const r = co2DeCombustible(masa, h);
    return Object.assign({ masa }, r, { errores: {
      'no-supera-al-combustible': masa,
      'olvida-los-carbonos': r.n * M('CO2'),
      'litro-como-kilo': co2DeCombustible(1000 * L, h).CO2 } });
  }

  // ---------------- Octanaje ----------------
  function octanaje(fIso) { return 100 * frac(fIso, 'fraccionIsooctano'); }
  function mezclaOctanaje(partes) {
    if (!Array.isArray(partes) || partes.length < 2) throw new Error('la mezcla necesita al menos dos partes');
    let v = 0, s = 0;
    for (const p of partes) { const vol = pos(p.vol, 'vol'), o = num(p.oct, 'oct'); v += vol; s += vol * o; }
    const octs = partes.map(p => p.oct);
    const errores = { 'promedio-simple': octs.reduce((t, o) => t + o, 0) / partes.length,
      'manda-la-mejor': Math.max(...octs), 'manda-la-peor': Math.min(...octs) };
    return { octanaje: s / v, regla: 'lineal por volumen (regla de academia; la mezcla real no es lineal)', errores };
  }
  function paraLlegar(oA, oB, objetivo) {
    oA = num(oA, 'oA'); oB = num(oB, 'oB'); objetivo = num(objetivo, 'objetivo');
    const f = (objetivo - oA) / (oB - oA);
    if (!(f >= 0 && f <= 1)) throw new Error('el objetivo tiene que estar entre los dos octanajes');
    return { fraccionB: f, porcentajeB: 100 * f };
  }

  // ---------------- ppm y ppb ----------------
  function ppm(mg, litros) {
    mg = num(mg, 'mg'); litros = pos(litros, 'litros');
    if (mg < 0) throw new Error('mg no puede ser negativo');
    const mgL = mg / litros;
    return { mgL, ppm: mgL, ppb: 1000 * mgL, porcentaje: mgL / 1e4,
      errores: { 'g-por-litro': mgL / 1000, 'ppb-entre-mil': mgL / 1000, 'porcentaje-entre-100': mgL / 100 } };
  }
  function dosisPpm(p, litros) {
    p = pos(p, 'ppm'); litros = pos(litros, 'litros');
    const mg = p * litros;
    return { mg, g: mg / 1000, errores: { 'g-por-litro': p * litros, 'ppb-por-ppm': mg / 1e6 } };
  }
  function ppmAPorcentaje(p) {
    p = num(p, 'ppm');
    return { porcentaje: p / 1e4, errores: { 'porcentaje-entre-100': p / 100 } };
  }

  // ---------------- pH y lluvia ácida ----------------
  const LLUVIA_NORMAL = 5.6, K_CO2 = Math.pow(10, -2 * LLUVIA_NORMAL);
  const pH = H => -Math.log10(pos(H, 'H'));
  function acidoFuerte(c, nH) {
    c = pos(c, 'c'); nH = pos(nH === undefined ? 1 : nH, 'nH');
    return { H: c * nH, pH: pH(c * nH), errores: { 'un-H': pH(c) } };
  }
  function compararPH(a, b) {
    a = num(a, 'pHa'); b = num(b, 'pHb');
    return { veces: Math.pow(10, b - a), errores: { 'lineal': b / a } };
  }
  const gota = cA => (cA + Math.sqrt(cA * cA + 4 * K_CO2)) / 2;
  function lluvia(o) {
    o = o || {};
    const cS = num(o.SO2 || 0, 'SO2'), cN = num(o.NO2 || 0, 'NO2');
    if (cS < 0 || cN < 0) throw new Error('las concentraciones no pueden ser negativas');
    const H = gota(2 * cS + cN);
    return { acidos: { H2SO4: cS, HNO3: cN }, H, pH: pH(H), acida: pH(H) < LLUVIA_NORMAL - 1e-9,
      errores: { 'culpa-al-CO2': LLUVIA_NORMAL, 'un-H-del-sulfurico': pH(gota(cS + cN)) } };
  }
  const so2AAcido = m => pos(m, 'masa') / M('SO2') * M('H2SO4');
  const no2AAcido = m => pos(m, 'masa') / M('NO2') * M('HNO3');

  // ---------------- Destilación fraccionada ----------------
  const BANDEJAS = [{ T: 350, nombre: 'aceites y fuel' }, { T: 250, nombre: 'diésel' }, { T: 150, nombre: 'queroseno' }, { T: 30, nombre: 'gasolina' }];
  const THORNO = 400;
  const SUST_TORRE = ['metano', 'pentano', 'octano', 'dodecano', 'hexadecano', 'tetracosano', 'residuo'];
  function condensaEn(s, bandejas, Thorno) {
    const b = bandejas || BANDEJAS, Th = Thorno === undefined ? THORNO : num(Thorno, 'Thorno'), h = hc(s);
    for (let i = 1; i < b.length; i++) if (!(b[i].T < b[i - 1].T)) throw new Error('las bandejas van de la más caliente (abajo) a la más fría (arriba)');
    if (!(b[0].T < Th)) throw new Error('la bandeja de abajo tiene que estar más fría que el horno');
    if (h.Teb > Th) return 'fondo';
    for (let i = 0; i < b.length; i++) if (b[i].T < h.Teb) return i;
    return 'gases';
  }
  function torre(bandejas, sustancias, Thorno) {
    const b = (bandejas || BANDEJAS).map(x => ({ T: num(x.T, 'T'), nombre: x.nombre || '' })), ss = sustancias || SUST_TORRE;
    const destino = {}, fraccion = {};
    const out = b.map(x => ({ T: x.T, nombre: x.nombre, sustancias: [] }));
    for (const s of ss) {
      const d = condensaEn(s, b, Thorno); destino[s] = d;
      fraccion[s] = d === 'fondo' ? 'residuo' : d === 'gases' ? 'gases' : b[d].nombre;
      if (typeof d === 'number') out[d].sustancias.push(s);
    }
    // Errores: el orden al revés (lo que hierve más alto sale donde sale lo que hierve más bajo: «el calor lo sube») o
    // por densidad (las moléculas grandes, de 12 C o más, se hunden al fondo).
    const porTeb = [...ss].sort((p, q) => hc(p).Teb - hc(q).Teb);
    const errores = { 'por-densidad': {}, 'el-calor-sube': {}, 'invierte-la-regla': {} };
    for (const s of ss) {
      errores['por-densidad'][s] = hc(s).C >= 12 ? 'fondo' : destino[s];
      errores['el-calor-sube'][s] = destino[porTeb[ss.length - 1 - porTeb.indexOf(s)]];
      // La regla al revés: se condensa en la bandeja más fría de las que están MÁS calientes que su punto de ebullición.
      let j = 'gases'; for (let i = 0; i < b.length; i++) if (b[i].T > hc(s).Teb) j = i; errores['invierte-la-regla'][s] = j;
    }
    return { destino, fraccion, bandejas: out, Thorno: Thorno === undefined ? THORNO : Thorno, errores };
  }
  function fraccionPorCarbonos(n) {
    n = num(n, 'n'); if (!Number.isInteger(n) || n < 1) throw new Error('n tiene que ser un entero positivo');
    return n <= 4 ? 'gases' : n <= 10 ? 'gasolina' : n <= 15 ? 'queroseno' : n <= 20 ? 'diésel' : n <= 29 ? 'aceites y fuel' : 'residuo';
  }

  // ---------------- Metalurgia ----------------
  const MENAS = {
    blenda: { formula: 'ZnS', mineral: 'blenda', metal: 'Zn', nMetal: 1, gas: 'SO2', nGas: 1,
      reaccion: '2ZnS + 3O₂ → 2ZnO + 2SO₂; ZnO + C → Zn + CO' },
    calcosina: { formula: 'Cu2S', mineral: 'calcosina', metal: 'Cu', nMetal: 2, gas: 'SO2', nGas: 1,
      reaccion: 'Cu₂S + O₂ → 2Cu + SO₂' },
    hematita: { formula: 'Fe2O3', mineral: 'hematita', metal: 'Fe', nMetal: 2, gas: 'CO2', nGas: 3,
      reaccion: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂' },
  };
  function metalurgia(mena, masa, ley, rendimiento) {
    const m = MENAS[mena]; if (!m) throw new Error(`mena desconocida: ${mena}`);
    masa = pos(masa, 'masa'); ley = frac(ley, 'ley'); rendimiento = frac(rendimiento === undefined ? 1 : rendimiento, 'rendimiento');
    const puro = masa * ley, n = puro / M(m.formula);
    const teorico = n * m.nMetal * MASAS[m.metal], real = teorico * rendimiento, gas = n * m.nGas * M(m.gas);
    return { puro, n, teorico, real, gas, metal: m.metal, gasFormula: m.gas,
      errores: { 'sin-ley': masa / M(m.formula) * m.nMetal * MASAS[m.metal] * rendimiento, 'sin-rendimiento': teorico,
        'suma-perdidas': masa / M(m.formula) * m.nMetal * MASAS[m.metal] * Math.max(0, 1 - (1 - ley) - (1 - rendimiento)) } };
  }

  // ---------------- Corrosión ----------------
  function oxidarHierro(masaFe, fraccion) {
    masaFe = pos(masaFe, 'masaFe'); const f = frac(fraccion === undefined ? 1 : fraccion, 'fraccion');
    const nFe = masaFe * f / MASAS.Fe, Fe2O3 = nFe / 2 * M('Fe2O3'), O = nFe * 1.5 * MASAS.O;
    return { nFe, Fe2O3, O, masaFinal: masaFe * (1 - f) + Fe2O3,
      errores: { 'resta-oxigeno': masaFe - O, 'no-cambia': masaFe, 'uno-a-uno': nFe * M('Fe2O3') } };
  }
  function corrosion(o) {
    o = o || {};
    const seOxida = !!(o.agua && o.oxigeno);
    return { seOxida, rapidez: !seOxida ? 'nula' : o.sal ? 'rápida' : 'lenta', errores: { 'solo-agua': !!o.agua, 'solo-aire': !!o.oxigeno } };
  }

  // ---------------- Cielo: ozono y CO₂ (modelo de juguete) ----------------
  function cielo(o) {
    o = o || {};
    const DU = pos(o.ozono === undefined ? 300 : o.ozono, 'ozono'), co2 = pos(o.co2 === undefined ? 280 : o.co2, 'co2');
    return { uv: Math.pow(300 / DU, 1.1), T: 14 + 3 * Math.log2(co2 / 280), ozono: DU, co2 };
  }
  function cambioCielo(a, b) {
    const x = cielo(a), y = cielo(b), c = (p, q) => (Math.abs(q - p) < 1e-9 ? 'igual' : q > p ? 'sube' : 'baja');
    return { uv: c(x.uv, y.uv), T: c(x.T, y.T), antes: x, despues: y,
      errores: { 'entra-mas-sol': { uv: 'sube', T: 'sube' }, 'atrapa-el-calor': { uv: 'igual', T: 'sube' }, 'se-escapa-el-calor': { uv: 'igual', T: 'baja' } } };
  }

  // ---------------- Eutrofización (modelo de juguete) ----------------
  function eutrofizacion(nutrientes, dias) {
    const nu = num(nutrientes, 'nutrientes'); if (nu < 0) throw new Error('nutrientes no puede ser negativo');
    const D = dias === undefined ? 40 : dias;
    let algas = 0.05, muertas = 0, O2 = 8, peces = 1;
    const serie = [{ dia: 0, algas, muertas, O2, peces }];
    for (let d = 1; d <= D; d++) {
      const techo = Math.max(0.05, 10 * nu);
      const nuevas = d <= 10 ? 0.9 * algas * (1 - algas / techo) : 0;
      const mueren = d > 10 ? 0.2 * algas : 0;
      const descompuestas = 0.25 * muertas;
      algas = Math.max(0, algas + nuevas - mueren);
      muertas = muertas + mueren - descompuestas;
      O2 = Math.max(0, O2 - 2 * descompuestas + 0.15 * (8 - O2));
      if (O2 < 2) peces *= 0.7;
      serie.push({ dia: d, algas, muertas, O2, peces });
    }
    const minO2 = serie.reduce((p, q) => (q.O2 < p.O2 ? q : p));
    const maxAlgas = serie.reduce((p, q) => (q.algas > p.algas ? q : p));
    return { serie, minO2: minO2.O2, diaMinO2: minO2.dia, diaMaxAlgas: maxAlgas.dia, pecesFinal: serie[serie.length - 1].peces,
      errores: { 'solo-algas': maxAlgas.dia, 'nutriente-toxico': 0 } };
  }

  // ---------------- Smog fotoquímico (modelo de juguete) ----------------
  function smog(trafico, sol) {
    const tr = num(trafico, 'trafico'), s0 = sol === undefined ? 1 : num(sol, 'sol');
    if (tr < 0 || s0 < 0) throw new Error('tráfico y sol no pueden ser negativos');
    // Se corren dos días y se devuelve el segundo, para que la noche ya traiga lo que quedó del día anterior.
    let N = 0, O3 = 0; const horas = [];
    for (let d = 0; d < 2; d++) for (let h = 0; h < 24; h++) {
      const s = h >= 6 && h <= 18 ? s0 * Math.sin(Math.PI * (h - 6) / 12) : 0;
      const emite = tr * (0.2 + Math.exp(-((h - 8) ** 2) / 4) + Math.exp(-((h - 18) ** 2) / 4));
      N = 0.92 * N + emite;
      const forma = 0.35 * s * N;
      N -= forma; O3 = 0.8 * O3 + forma;
      if (d === 1) horas.push({ h, sol: s < 1e-12 ? 0 : s, NO2: N, O3 });
    }
    const pico = horas.reduce((p, q) => (q.O3 > p.O3 ? q : p));
    return { horas, horaPico: pico.h, picoO3: pico.O3,
      errores: { 'sale-del-escape': horas.reduce((p, q) => (q.NO2 > p.NO2 ? q : p)).h } };
  }

  // ---------------- Moléculas para dibujar ----------------
  const MOLECULAS = {
    CH4: [{ el: 'C', x: 0, y: 0 }, { el: 'H', x: 0, y: -1 }, { el: 'H', x: 1, y: 0 }, { el: 'H', x: 0, y: 1 }, { el: 'H', x: -1, y: 0 }],
    O2: [{ el: 'O', x: -0.55, y: 0 }, { el: 'O', x: 0.55, y: 0 }],
    CO2: [{ el: 'O', x: -1.1, y: 0 }, { el: 'C', x: 0, y: 0 }, { el: 'O', x: 1.1, y: 0 }],
    CO: [{ el: 'C', x: -0.55, y: 0 }, { el: 'O', x: 0.55, y: 0 }],
    C: [{ el: 'C', x: 0, y: 0 }],
    H2O: [{ el: 'O', x: 0, y: -0.2 }, { el: 'H', x: -0.8, y: 0.45 }, { el: 'H', x: 0.8, y: 0.45 }],
    O3: [{ el: 'O', x: -0.95, y: 0.35 }, { el: 'O', x: 0, y: -0.25 }, { el: 'O', x: 0.95, y: 0.35 }],
    SO2: [{ el: 'S', x: 0, y: -0.25 }, { el: 'O', x: -1.05, y: 0.4 }, { el: 'O', x: 1.05, y: 0.4 }],
    NO2: [{ el: 'N', x: 0, y: -0.25 }, { el: 'O', x: -1, y: 0.4 }, { el: 'O', x: 1, y: 0.4 }],
    NO3: [{ el: 'N', x: 0, y: 0 }, { el: 'O', x: 0, y: -1.05 }, { el: 'O', x: 0.91, y: 0.52 }, { el: 'O', x: -0.91, y: 0.52 }],
    ZnS: [{ el: 'Zn', x: -0.6, y: 0 }, { el: 'S', x: 0.6, y: 0 }],
    ZnO: [{ el: 'Zn', x: -0.6, y: 0 }, { el: 'O', x: 0.6, y: 0 }],
    Fe: [{ el: 'Fe', x: 0, y: 0 }],
    Fe2O3: [{ el: 'Fe', x: -0.75, y: 0 }, { el: 'Fe', x: 0.75, y: 0 }, { el: 'O', x: 0, y: -0.95 }, { el: 'O', x: 0, y: 0.95 }, { el: 'O', x: 1.75, y: 0.65 }],
    SO3: [{ el: 'S', x: 0, y: 0 }, { el: 'O', x: 0, y: -1.05 }, { el: 'O', x: 0.91, y: 0.52 }, { el: 'O', x: -0.91, y: 0.52 }],
    H2SO4: [{ el: 'S', x: 0, y: 0 }, { el: 'O', x: 0, y: -1.05 }, { el: 'O', x: 0, y: 1.05 }, { el: 'O', x: -1.05, y: 0 }, { el: 'O', x: 1.05, y: 0 },
      { el: 'H', x: -1.8, y: 0.45 }, { el: 'H', x: 1.8, y: -0.45 }],
  };
  const RADIO = { H: 0.32, C: 0.5, N: 0.48, O: 0.46, S: 0.6, Zn: 0.62, Fe: 0.62 };
  const ENLACES = s => {
    const a = MOLECULAS[s], e = [];
    for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (Math.hypot(a[i].x - a[j].x, a[i].y - a[j].y) < 1.25) e.push([i, j]);
    return e;
  };
  const mol = s => { const m = MOLECULAS[s]; if (!m) throw new Error(`molécula desconocida: ${s}`); return m; };
  const extension = s => Math.max(...mol(s).map(a => Math.hypot(a.x, a.y) + (RADIO[a.el] || 0.5)));

  function azar(semilla) {
    let s = (semilla >>> 0) || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  // Posiciones sin encimarse, en una caja de W × H (en largos de enlace), por rejilla con algo de azar.
  function caja(lista, W, H, semilla) {
    W = pos(W, 'W'); H = pos(H, 'H');
    const items = [];
    for (const [s, n] of lista) for (let i = 0; i < n; i++) items.push(s);
    if (!items.length) return [];
    const r = Math.max(...items.map(extension)) + 0.15, rnd = azar(semilla || 7);
    let cols = Math.max(1, Math.floor(W / (2 * r))), filas = Math.max(1, Math.floor(H / (2 * r)));
    if (cols * filas < items.length) throw new Error('no caben las moléculas en la caja');
    const celdas = [];
    for (let f = 0; f < filas; f++) for (let c = 0; c < cols; c++) celdas.push([c, f]);
    // Mezcla determinística de las celdas.
    for (let i = celdas.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [celdas[i], celdas[j]] = [celdas[j], celdas[i]]; }
    const cw = W / cols, ch = H / filas;
    return items.map((s, i) => {
      const [c, f] = celdas[i], hx = Math.max(0, cw / 2 - r), hy = Math.max(0, ch / 2 - r);
      return { s, x: (c + 0.5) * cw + (rnd() * 2 - 1) * hx, y: (f + 0.5) * ch + (rnd() * 2 - 1) * hy, ang: (rnd() * 2 - 1) * 0.6 };
    });
  }
  const atomosDe = lugares => {
    const out = [];
    lugares.forEach((p, k) => {
      const co = Math.cos(p.ang || 0), si = Math.sin(p.ang || 0);
      mol(p.s).forEach(a => out.push({ el: a.el, x: p.x + a.x * co - a.y * si, y: p.y + a.x * si + a.y * co, mol: k }));
    });
    return out;
  };
  // Cada átomo de antes va al lugar de un átomo igual de después: los mismos átomos, reacomodados.
  function reacomodo(antes, despues, W, H, semilla) {
    const A = caja(antes, W, H, semilla), B = caja(despues, W, H, (semilla || 7) + 101);
    const a = atomosDe(A), b = atomosDe(B);
    const cuenta = l => l.reduce((o, x) => { o[x.el] = (o[x.el] || 0) + 1; return o; }, {});
    const ca = cuenta(a), cb = cuenta(b);
    const els = new Set([...Object.keys(ca), ...Object.keys(cb)]);
    for (const e of els) if (ca[e] !== cb[e]) throw new Error(`los átomos de ${e} no cuadran: ${ca[e] || 0} antes y ${cb[e] || 0} después`);
    // Emparejar por elemento, del más cercano al más lejano (codicioso), para que el viaje sea corto.
    const usado = new Set(), atomos = [];
    for (const x of a) {
      let mejor = -1, d = Infinity;
      b.forEach((y, j) => { if (y.el === x.el && !usado.has(j)) { const q = Math.hypot(x.x - y.x, x.y - y.y); if (q < d) { d = q; mejor = j; } } });
      usado.add(mejor);
      atomos.push({ el: x.el, x0: x.x, y0: x.y, x1: b[mejor].x, y1: b[mejor].y, molAntes: x.mol, molDespues: b[mejor].mol });
    }
    return { antes: A, despues: B, atomos, cuenta: ca };
  }

  return { MASAS, F, HIDROCARBUROS, BANDEJAS, THORNO, SUST_TORRE, MENAS, MOLECULAS, RADIO, LLUVIA_NORMAL,
    masaMolar, balance, formulaTxt, combustion, repartoO2, balanzaCombustion, co2DeCombustible, co2PorLitro,
    octanaje, mezclaOctanaje, paraLlegar, ppm, dosisPpm, ppmAPorcentaje, pH, acidoFuerte, compararPH, lluvia,
    so2AAcido, no2AAcido, condensaEn, torre, fraccionPorCarbonos, metalurgia, oxidarHierro, corrosion,
    cielo, cambioCielo, eutrofizacion, smog, enlaces: ENLACES, extension, azar, caja, reacomodo };
});
