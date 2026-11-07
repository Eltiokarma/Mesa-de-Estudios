/*
 * Paleta común de elementos de química: un color por elemento, el mismo en todas las escenas (regla 4).
 * Cada escena pinta sus átomos, sus fórmulas y sus leyendas con --el-<Símbolo> (por ejemplo --el-Fe).
 * Funciona en el navegador (window.Elementos) y en Node (require).
 *
 * Cómo se eligió (docs/metodo/paleta.py, CIEDE2000 y contraste WCAG):
 *   - Todos pasan AA (4,5 a 1) sobre el papel (#fdf7f1 / #241c2e), la tarjeta (#fffaf6 / #2a2135), el chip .v
 *     (fondo del mismo color al 8 % sobre papel y sobre tarjeta) y la letra del átomo (#ffffff / #1d1626).
 *   - Entre los elementos que salen juntos en una vista real (VISTAS), ΔE00 ≥ 20 en claro y en oscuro,
 *     y también contra la tinta y contra las variables no-elemento de esa escena (lo comprueba
 *     nucleo/elementos-escenas.test.js).
 *   - Costumbre química donde cabe: O rojo, H turquesa, N azul, C gris, Cl verde, Cu cobre,
 *     I violeta, Br ladrillo, Au dorado, Ar y He con los tonos de sus tubos de descarga.
 *   - 32 colores no se separan todos entre sí: CERCANOS lista cada par con ΔE00 < 20 (el menor de los dos modos).
 *     Ninguno sale junto en una vista de hoy; antes de juntarlos en una escena nueva hay que separarlos.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Elementos = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const COLORES = {
    H:  { claro:'#0f766e', oscuro:'#5ed9c8', nombre:'hidrógeno' },
    He: { claro:'#b3246b', oscuro:'#ff86bd', nombre:'helio' },
    Li: { claro:'#77032c', oscuro:'#f29bb0', nombre:'litio' },
    B:  { claro:'#696b3b', oscuro:'#b9bb7a', nombre:'boro' },
    C:  { claro:'#6b6b6b', oscuro:'#9a9a9a', nombre:'carbono' },
    N:  { claro:'#136caa', oscuro:'#4eb3f9', nombre:'nitrógeno' },
    O:  { claro:'#c4284e', oscuro:'#f17384', nombre:'oxígeno' },
    F:  { claro:'#795f26', oscuro:'#d8c27a', nombre:'flúor' },
    Na: { claro:'#3f4948', oscuro:'#8a9a90', nombre:'sodio' },
    Mg: { claro:'#425697', oscuro:'#8db7ff', nombre:'magnesio' },
    Al: { claro:'#056ea3', oscuro:'#38b6e8', nombre:'aluminio' },
    Si: { claro:'#6b3a14', oscuro:'#e0a878', nombre:'silicio' },
    P:  { claro:'#a05200', oscuro:'#f0a04a', nombre:'fósforo' },
    S:  { claro:'#2d29c7', oscuro:'#9386ff', nombre:'azufre' },
    Cl: { claro:'#466d14', oscuro:'#a3d65e', nombre:'cloro' },
    Ar: { claro:'#8b5878', oscuro:'#fdafda', nombre:'argón' },
    K:  { claro:'#7843e9', oscuro:'#a788d3', nombre:'potasio' },
    Ca: { claro:'#6a5b8f', oscuro:'#deb0f5', nombre:'calcio' },
    Cr: { claro:'#4f7303', oscuro:'#58a833', nombre:'cromo' },
    Mn: { claro:'#6b260f', oscuro:'#ff6600', nombre:'manganeso' },
    Fe: { claro:'#1768be', oscuro:'#209cf2', nombre:'hierro' },
    Ni: { claro:'#285a3a', oscuro:'#76a078', nombre:'níquel' },
    Cu: { claro:'#c52e03', oscuro:'#ff8a3d', nombre:'cobre' },
    Zn: { claro:'#6a676d', oscuro:'#9e9ea4', nombre:'zinc' },
    Br: { claro:'#a03516', oscuro:'#f0956e', nombre:'bromo' },
    Ag: { claro:'#0b7471', oscuro:'#02d6d6', nombre:'plata' },
    Sn: { claro:'#65635d', oscuro:'#b0aca0', nombre:'estaño' },
    I:  { claro:'#c5058c', oscuro:'#e970c1', nombre:'yodo' },
    Ba: { claro:'#5e5527', oscuro:'#c9bd7d', nombre:'bario' },
    Au: { claro:'#7d6a00', oscuro:'#e3c84a', nombre:'oro' },
    Hg: { claro:'#616a6d', oscuro:'#98a5aa', nombre:'mercurio' },
    Pb: { claro:'#744430', oscuro:'#eab695', nombre:'plomo' }
  };
  // Pares con ΔE00 < 20 (mínimo entre claro y oscuro). Ninguno comparte vista en las escenas de hoy (VISTAS).
  const CERCANOS = [
    ['H', 'Ni', 14.6],
    ['H', 'Ag', 2.2],
    ['H', 'Hg', 18.5],
    ['He', 'Li', 7.9],
    ['He', 'O', 10.8],
    ['He', 'Na', 17.5],
    ['He', 'Ar', 9.1],
    ['He', 'Ca', 16.0],
    ['He', 'I', 7.0],
    ['Li', 'O', 10.4],
    ['Li', 'Ar', 8.8],
    ['Li', 'Ca', 17.5],
    ['Li', 'Mn', 16.3],
    ['Li', 'I', 14.5],
    ['Li', 'Pb', 18.7],
    ['B', 'C', 17.7],
    ['B', 'F', 7.9],
    ['B', 'Na', 19.1],
    ['B', 'Si', 19.8],
    ['B', 'Cl', 10.8],
    ['B', 'Cr', 11.1],
    ['B', 'Ni', 16.0],
    ['B', 'Sn', 14.9],
    ['B', 'Ba', 4.5],
    ['B', 'Au', 11.3],
    ['B', 'Hg', 19.8],
    ['C', 'Na', 9.5],
    ['C', 'Zn', 3.6],
    ['C', 'Sn', 4.6],
    ['C', 'Ba', 19.1],
    ['C', 'Hg', 4.6],
    ['N', 'Mg', 9.6],
    ['N', 'Al', 2.5],
    ['N', 'Fe', 4.0],
    ['N', 'Hg', 18.4],
    ['O', 'Ar', 17.9],
    ['O', 'Cu', 18.9],
    ['O', 'Br', 18.0],
    ['O', 'I', 16.3],
    ['F', 'Si', 14.2],
    ['F', 'P', 14.6],
    ['F', 'Cl', 17.7],
    ['F', 'Cr', 19.7],
    ['F', 'Sn', 17.1],
    ['F', 'Ba', 3.7],
    ['F', 'Au', 7.7],
    ['F', 'Pb', 16.0],
    ['Na', 'Ni', 11.9],
    ['Na', 'Zn', 12.3],
    ['Na', 'Ag', 19.9],
    ['Na', 'Sn', 11.2],
    ['Na', 'I', 19.6],
    ['Na', 'Ba', 18.9],
    ['Na', 'Hg', 9.0],
    ['Mg', 'Al', 13.7],
    ['Mg', 'S', 14.6],
    ['Mg', 'K', 16.3],
    ['Mg', 'Ca', 10.7],
    ['Mg', 'Fe', 10.0],
    ['Mg', 'Hg', 18.0],
    ['Al', 'Fe', 6.4],
    ['Al', 'Ag', 18.6],
    ['Al', 'Hg', 17.2],
    ['Si', 'P', 7.7],
    ['Si', 'Mn', 8.2],
    ['Si', 'Cu', 11.9],
    ['Si', 'Br', 9.6],
    ['Si', 'Sn', 17.8],
    ['Si', 'Ba', 15.7],
    ['Si', 'Au', 19.3],
    ['Si', 'Pb', 5.6],
    ['P', 'Mn', 16.0],
    ['P', 'Cu', 9.1],
    ['P', 'Br', 12.5],
    ['P', 'Ba', 18.9],
    ['P', 'Au', 18.9],
    ['P', 'Pb', 12.3],
    ['S', 'K', 9.8],
    ['S', 'Ca', 18.3],
    ['S', 'Hg', 16.3],
    ['Cl', 'Cr', 3.4],
    ['Cl', 'Ni', 14.3],
    ['Cl', 'Ba', 15.3],
    ['Cl', 'Au', 17.3],
    ['Ar', 'K', 20.0],
    ['Ar', 'Ca', 10.8],
    ['Ar', 'Zn', 17.6],
    ['Ar', 'I', 14.3],
    ['K', 'Ca', 13.0],
    ['K', 'I', 15.8],
    ['K', 'Hg', 16.0],
    ['Ca', 'Fe', 18.8],
    ['Ca', 'Zn', 16.7],
    ['Ca', 'I', 16.2],
    ['Ca', 'Hg', 18.2],
    ['Cr', 'Ni', 13.5],
    ['Cr', 'Ba', 16.2],
    ['Cr', 'Au', 15.7],
    ['Mn', 'Cu', 7.8],
    ['Mn', 'Br', 11.3],
    ['Mn', 'Pb', 8.8],
    ['Fe', 'Hg', 19.7],
    ['Ni', 'Ag', 15.7],
    ['Ni', 'Sn', 18.9],
    ['Ni', 'Ba', 18.3],
    ['Cu', 'Br', 7.3],
    ['Cu', 'Pb', 14.7],
    ['Zn', 'Sn', 7.7],
    ['Zn', 'Hg', 6.6],
    ['Br', 'Pb', 10.1],
    ['Ag', 'Hg', 17.7],
    ['Sn', 'Ba', 15.1],
    ['Sn', 'Hg', 7.1],
    ['Sn', 'Pb', 17.5],
    ['I', 'Hg', 17.3],
    ['Ba', 'Au', 10.1],
    ['Ba', 'Pb', 17.4]
  ];
  // Elementos que salen pintados a la vez en una misma vista de las escenas actuales.
  const VISTAS = [
    ['limitante-particulas: N₂ + H₂', ['N', 'H']],
    ['limitante-particulas: H₂ + O₂', ['H', 'O']],
    ['limitante-particulas: Al + Cl₂', ['Al', 'Cl']],
    ['limitante-particulas: la balanza (burbujas de CO₂)', ['C', 'O']],
    ['mol-composicion: Mg contra C', ['Mg', 'C']],
    ['mol-composicion: CH₄, CH₂O, C₆H₁₂O₆', ['C', 'H', 'O']],
    ['mol-composicion: CaCO₃', ['Ca', 'C', 'O', 'H']],
    ['mol-composicion: Fe₂O₃ y FeO', ['Fe', 'O', 'H']],
    ['mol-composicion: NH₃', ['N', 'H', 'O']],
    ['mol-composicion: H₂SO₄', ['H', 'S', 'O']],
    ['balance-reacciones: H₂ + O₂, H₂O₂', ['H', 'O']],
    ['balance-reacciones: combustiones', ['C', 'H', 'O']],
    ['balance-reacciones: Zn + HCl', ['Zn', 'H', 'Cl']],
    ['balance-reacciones: Zn, Cu y Cl con e⁻', ['Zn', 'Cu', 'Cl']],
    ['balance-reacciones: MnO₄⁻ en medio básico', ['Mn', 'O', 'H']],
    ['balance-reacciones: Mn, Fe, O y H', ['Mn', 'Fe', 'O', 'H']],
    ['balance-reacciones: Cr₂O₇²⁻ + Fe²⁺', ['Cr', 'Fe', 'O', 'H']],
    ['balance-reacciones: Fe + O₂', ['Fe', 'O']],
    ['balance-reacciones: Fe + Cl₂', ['Fe', 'Cl']],
    ['balance-reacciones: N₂ + H₂, NH₃ + O₂, NO₂', ['N', 'O', 'H']],
    ['celda-galvanica: pila (dos de Zn, Fe, Cu, Ag) y el K⁺ del puente', ['Zn', 'Fe', 'Cu', 'Ag', 'K']],
    ['celda-galvanica: Faraday', ['Cu', 'Ag']],
    ['enlace: la red de NaCl', ['Na', 'Cl']],
    ['materia-energia: las cajas', ['H', 'O', 'Fe']],
    ['materia-energia: la lupa del agua con sal', ['H', 'O', 'Na', 'Cl']],
    ['materia-energia: el frasco', ['C', 'H', 'O']],
    ['materia-energia: el azúcar y el clavo', ['C', 'H', 'O', 'Fe']],
    ['materia-energia: separar arena del agua', ['H', 'O', 'Si']],
    ['materia-energia: separar hierro y azufre', ['H', 'O', 'Fe', 'S']],
    ['materia-energia: separar con carbono', ['H', 'O', 'C']],
  ];
  const SIMBOLOS = Object.keys(COLORES);

  function lista(simbolos) {
    const s = simbolos ? Array.from(simbolos) : SIMBOLOS;
    for (const e of s) if (!COLORES[e]) throw new Error(`Elementos: no hay color para «${e}»`);
    return s;
  }
  function decl(s, modo) { return s.map(e => `--el-${e}:${COLORES[e][modo]}`).join('; '); }
  // Reglas CSS con --el-<Símbolo> para los elementos pedidos (todos si no se pasa lista), con el mismo
  // esquema de tema que usan las escenas: claro por defecto, oscuro por el sistema salvo data-theme="light",
  // y oscuro forzado con data-theme="dark".
  function css(simbolos) {
    const s = lista(simbolos);
    return `:root{ ${decl(s, 'claro')} }\n`
      + `@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){ ${decl(s, 'oscuro')} } }\n`
      + `:root[data-theme="dark"]{ ${decl(s, 'oscuro')} }`;
  }
  // ----- Medidas de color (las mismas de docs/metodo/paleta.py), para las pruebas y para revisar escenas -----
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  function luminancia(h) { const [r, g, b] = rgb(h).map(lin); return 0.2126*r + 0.7152*g + 0.0722*b; }
  function contraste(a, b) { const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }
  // Color mezclado sobre un fondo, como color-mix(in srgb, color p, fondo).
  function mezcla(h, fondo, p) {
    const a = rgb(h), b = rgb(fondo);
    return '#' + a.map((v, i) => Math.round((p*v + (1 - p)*b[i]) * 255).toString(16).padStart(2, '0')).join('');
  }
  function lab(h) {
    const [r, g, b] = rgb(h).map(lin);
    const X = (0.4124*r + 0.3576*g + 0.1805*b) / 0.95047, Y = 0.2126*r + 0.7152*g + 0.0722*b, Z = (0.0193*r + 0.1192*g + 0.9505*b) / 1.08883;
    const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787*t + 16/116;
    return [116*f(Y) - 16, 500*(f(X) - f(Y)), 200*(f(Y) - f(Z))];
  }
  // Diferencia de color CIEDE2000.
  function deltaE00(c1, c2) {
    const rad = Math.PI / 180, [L1, a1, b1] = lab(c1), [L2, a2, b2] = lab(c2);
    const Cm = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2, G = 0.5*(1 - Math.sqrt(Cm**7 / (Cm**7 + 25**7)));
    const a1p = (1 + G)*a1, a2p = (1 + G)*a2, C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
    const h1p = ((Math.atan2(b1, a1p) / rad) + 360) % 360, h2p = ((Math.atan2(b2, a2p) / rad) + 360) % 360;
    const dL = L2 - L1, dC = C2p - C1p; let dh = h2p - h1p;
    if (C1p*C2p === 0) dh = 0; else if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
    const dH = 2*Math.sqrt(C1p*C2p)*Math.sin(dh/2*rad), Lm = (L1 + L2)/2, Cmp = (C1p + C2p)/2;
    let hm = Math.abs(h1p - h2p) <= 180 ? (h1p + h2p)/2 : (h1p + h2p + 360)/2;
    if (C1p*C2p === 0) hm = h1p + h2p;
    const T = 1 - 0.17*Math.cos((hm - 30)*rad) + 0.24*Math.cos(2*hm*rad) + 0.32*Math.cos((3*hm + 6)*rad) - 0.2*Math.cos((4*hm - 63)*rad);
    const dt = 30*Math.exp(-(((hm - 275)/25)**2)), RC = 2*Math.sqrt(Cmp**7 / (Cmp**7 + 25**7));
    const SL = 1 + 0.015*(Lm - 50)**2 / Math.sqrt(20 + (Lm - 50)**2), SC = 1 + 0.045*Cmp, SH = 1 + 0.015*Cmp*T, RT = -Math.sin(2*dt*rad)*RC;
    return Math.sqrt((dL/SL)**2 + (dC/SC)**2 + (dH/SH)**2 + RT*(dC/SC)*(dH/SH));
  }
  // Menor ΔE00 de un par entre los dos modos: { claro, oscuro } o un símbolo de la paleta.
  function distancia(a, b) {
    const c = x => typeof x === 'string' ? COLORES[x] : x;
    return Math.min(deltaE00(c(a).claro, c(b).claro), deltaE00(c(a).oscuro, c(b).oscuro));
  }
  const FONDOS = { claro: { papel:'#fdf7f1', tarjeta:'#fffaf6', letra:'#ffffff' }, oscuro: { papel:'#241c2e', tarjeta:'#2a2135', letra:'#1d1626' } };
  // Contraste mínimo de un color sobre papel, tarjeta, chip al 8 % (sobre papel y tarjeta) y letra del átomo.
  function contrasteMinimo(h, modo, chip = 0.08) {
    const f = FONDOS[modo];
    return Math.min(contraste(h, f.papel), contraste(h, f.tarjeta), contraste(h, mezcla(h, f.papel, chip)), contraste(h, mezcla(h, f.tarjeta, chip)), contraste(h, f.letra));
  }

  function color(simbolo, modo) { lista([simbolo]); return COLORES[simbolo][modo === 'oscuro' ? 'oscuro' : 'claro']; }

  return { COLORES, SIMBOLOS, CERCANOS, VISTAS, FONDOS, css, color, deltaE00, distancia, contraste, contrasteMinimo, mezcla };
});
