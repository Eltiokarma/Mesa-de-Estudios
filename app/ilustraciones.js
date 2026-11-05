// Ilustraciones propias de la app, en SVG (livianas y sin descargas aparte).
// Dirección acogedora (docs/diseno.md): crema, lavanda, rosa bombón y trazo ciruela.
// Solo se usan en la cáscara de la app; dentro de las escenas mandan los colores de las variables.
(function () {
'use strict';
const T = '#3b2a52';        // trazo ciruela
const CREMA = '#fff6ee', ROSA = '#ffc7da', ROSA_2 = '#ff9fbf', LAV = '#cdb9ff', LAV_2 = '#a58cf0', MENTA = '#bfead8', MIEL = '#ffd99a', CIELO = '#bfe0ff';
const trazo = `stroke="${T}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;

// Gatito sentado, contento (ojos cerrados). Para el reto del día y los estados vacíos.
function gato(extra = '') {
  return `<svg viewBox="0 0 120 120" aria-hidden="true" ${extra}>
  <g ${trazo}>
    <path d="M88 100c20 0 24-22 10-28" fill="none"/>
    <path d="M30 106c-5-26 6-46 30-46s35 20 30 46z" fill="${CREMA}"/>
    <path d="M35 38 37 14l19 15zM85 38 83 14 64 29z" fill="${CREMA}"/>
    <ellipse cx="60" cy="50" rx="31" ry="26" fill="${CREMA}"/>
    <path d="M45 50q5 5 10 0M65 50q5 5 10 0" fill="none"/>
    <path d="M56.5 59q3.5 3 7 0" fill="none"/>
    <path d="M26 52l-12-2M27 58l-12 3M94 52l12-2M93 58l12 3" stroke-width="2"/>
    <ellipse cx="47" cy="104" rx="8" ry="5" fill="${CREMA}"/><ellipse cx="73" cy="104" rx="8" ry="5" fill="${CREMA}"/>
  </g>
  <path d="M39 33 40 20l10 9zM81 33 80 20l-10 9z" fill="${ROSA}"/>
  <circle cx="42" cy="59" r="5" fill="${ROSA}"/><circle cx="78" cy="59" r="5" fill="${ROSA}"/>
  <path d="M57.5 55h5l-2.5 3z" fill="${ROSA_2}"/>
  <path d="M50 80c6 4 14 4 20 0" stroke="${LAV}" stroke-width="5" stroke-linecap="round" fill="none"/>
</svg>`;
}

// Gatito dormido, enroscado. Para "terminaste" y estados vacíos.
function gatoDormido(extra = '') {
  return `<svg viewBox="0 0 140 90" aria-hidden="true" ${extra}>
  <g ${trazo}>
    <path d="M18 74c-4-22 14-38 44-38 32 0 54 12 56 30 1 10-8 14-20 14H30c-7 0-11-2-12-6z" fill="${CREMA}"/>
    <path d="M104 78c14 2 22-6 16-14" fill="none"/>
    <path d="M24 48 22 28l16 10zM54 40l6-18 10 16z" fill="${CREMA}"/>
    <ellipse cx="40" cy="56" rx="24" ry="20" fill="${CREMA}"/>
    <path d="M30 56q4 4 8 0M46 56q4 4 8 0" fill="none"/>
  </g>
  <circle cx="30" cy="63" r="4" fill="${ROSA}"/><circle cx="54" cy="63" r="4" fill="${ROSA}"/>
  <g fill="${LAV_2}" font-family="system-ui,sans-serif" font-weight="800"><text x="74" y="30" font-size="14">z</text><text x="86" y="18" font-size="11">z</text><text x="96" y="9" font-size="8">z</text></g>
</svg>`;
}

// Taza de chocolate con carita y vapor. Para la racha de días.
function taza(extra = '') {
  return `<svg viewBox="0 0 100 100" aria-hidden="true" ${extra}>
  <path d="M38 22c-6-8 6-10 0-18M52 24c-6-8 6-10 0-18" stroke="${LAV_2}" stroke-width="3" stroke-linecap="round" fill="none"/>
  <g ${trazo}>
    <path d="M74 46h6a12 12 0 0 1 0 24h-8" fill="none" stroke-width="5"/>
    <path d="M20 36h58v34a18 18 0 0 1-18 18H38a18 18 0 0 1-18-18z" fill="${CREMA}"/>
    <ellipse cx="49" cy="36" rx="29" ry="6" fill="#a8745c"/>
    <path d="M39 58v2M59 58v2" stroke-width="4"/>
    <path d="M45 66q4 4 8 0" fill="none"/>
  </g>
  <circle cx="33" cy="66" r="4" fill="${ROSA}"/><circle cx="65" cy="66" r="4" fill="${ROSA}"/>
  <path d="M66 31c0-3 4-4 5-1 1-3 5-2 5 1 0 3-5 6-5 6s-5-3-5-6z" fill="${ROSA_2}"/>
</svg>`;
}

// Escritorio de noche: ventana con luna, lámpara, libros, taza, prisma con arcoíris y el gato
// durmiendo sobre los libros. Para la portada de la bienvenida (sobre fondo lavanda).
function escritorio(extra = '') {
  return `<svg viewBox="0 0 260 190" aria-hidden="true" ${extra}>
  <rect x="150" y="8" width="96" height="86" rx="44" fill="rgba(255,255,255,.14)" stroke="rgba(255,255,255,.45)" stroke-width="3"/>
  <path d="M198 10v82M152 52h92" stroke="rgba(255,255,255,.3)" stroke-width="3"/>
  <circle cx="222" cy="32" r="10" fill="${MIEL}"/>
  <g fill="#fff"><circle cx="170" cy="30" r="2"/><circle cx="184" cy="70" r="1.6"/><circle cx="230" cy="70" r="2"/><circle cx="210" cy="22" r="1.4"/></g>
  <path d="M60 60 30 150h60z" fill="rgba(255,238,170,.18)"/>
  <g ${trazo}>
    <path d="M16 156h232" stroke-width="4"/>
    <path d="M40 156v-8h30v8M55 148V96l26-24" fill="none"/>
    <path d="M70 70l26-6 4 22-26 6z" fill="${ROSA}"/>
    <rect x="96" y="134" width="70" height="14" rx="4" fill="${LAV}"/>
    <rect x="102" y="120" width="60" height="14" rx="4" fill="${MENTA}"/>
    <rect x="98" y="106" width="64" height="14" rx="4" fill="${MIEL}"/>
    <path d="M100 106c-2-14 8-22 26-22 18 0 32 6 32 16 0 5-4 6-10 6z" fill="${CREMA}"/>
    <path d="M150 104c10 2 14-4 10-10" fill="none"/>
    <path d="M106 90 104 78l10 6zM122 84l4-12 6 10z" fill="${CREMA}"/>
    <path d="M110 96q3 3 6 0M122 96q3 3 6 0" fill="none" stroke-width="2.4"/>
    <path d="M182 156v-24h24v24" fill="${CREMA}"/>
    <path d="M206 138h4a7 7 0 0 1 0 14h-4" fill="none"/>
    <path d="M222 156l12-24 12 24z" fill="rgba(255,255,255,.55)"/>
  </g>
  <path d="M188 124c-4-6 4-8 0-14M198 124c-4-6 4-8 0-14" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".8"/>
  <circle cx="113" cy="101" r="3" fill="${ROSA}"/><circle cx="131" cy="101" r="3" fill="${ROSA}"/>
  <g stroke-width="3" stroke-linecap="round" fill="none"><path d="M240 144l18 4" stroke="${ROSA_2}"/><path d="M240 146l18 8" stroke="${MIEL}"/><path d="M240 148l18 12" stroke="${MENTA}"/><path d="M239 150l18 16" stroke="${CIELO}"/><path d="M238 152l18 20" stroke="${LAV}"/></g>
  <path d="M216 144h18" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
</svg>`;
}

// Íconos por curso: dibujo simple sobre un fondo pastel propio.
const ICONOS_CURSO = {
  fisica: [LAV, `<ellipse cx="16" cy="16" rx="3.5" ry="11" fill="#fff"/><path d="M3 11h13l12 7M3 11l25 10" fill="none"/>`],
  quimica: [MENTA, `<path d="M12 4h8M13 4v8l-7 13a2 2 0 0 0 2 3h16a2 2 0 0 0 2-3l-7-13V4" fill="#fff"/><path d="M8.5 21h15" fill="none"/><circle cx="14" cy="24" r="1.2" fill="${T}"/><circle cx="19" cy="23" r="1" fill="${T}"/>`],
  aritmetica: [MIEL, `<circle cx="10" cy="10" r="3.5" fill="#fff"/><circle cx="22" cy="22" r="3.5" fill="#fff"/><path d="M24 6 8 26" fill="none"/>`],
  algebra: [CIELO, `<path d="M5 10l10 14M15 10 5 24" fill="none"/><path d="M19 9q0-4 4-4t4 4q0 3-4 6h5" fill="none"/>`],
  geometria: [ROSA, `<path d="M16 4 4 27h24z" fill="#fff"/><path d="M16 4v23" fill="none" stroke-dasharray="2 3"/>`],
  trigonometria: ['#ffd0c2', `<circle cx="16" cy="16" r="11" fill="#fff"/><path d="M16 16h11M16 16l8-8" fill="none"/><path d="M21 16a5 5 0 0 0-1.5-3.5" fill="none"/>`],
  'razonamiento-matematico': ['#ffe3b0', `<path d="M6 6h8v4a2.5 2.5 0 1 1 0 4v4H6zM18 6h8v12h-4a2.5 2.5 0 1 0-4 0" fill="#fff"/><path d="M6 20h8v6H6zM18 22h8v4h-8z" fill="#fff"/>`],
  'razonamiento-verbal': ['#c5ece9', `<path d="M16 9c-4-3-8-3-12-2v17c4-1 8-1 12 2 4-3 8-3 12-2V7c-4-1-8-1-12 2z" fill="#fff"/><path d="M16 9v17M8 12h4M8 16h4M20 12h4" fill="none"/>`],
};
function iconoCurso(id) {
  const [fondo, dibujo] = ICONOS_CURSO[id] || [LAV, `<circle cx="16" cy="16" r="9" fill="#fff"/>`];
  return `<span class="ico" aria-hidden="true" style="background:${fondo}"><svg viewBox="0 0 32 32" width="26" height="26"><g stroke="${T}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${dibujo}</g></svg></span>`;
}

// Íconos chicos de las estadísticas de "Hoy".
const mini = {
  llama: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 22c-4 0-7-3-7-7 0-4 3-6 4-9 1 2 2 3 3 3 0-2 1-5 3-7 1 4 6 7 6 13 0 4-4 7-9 7z" fill="${ROSA_2}" stroke="${T}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  libro: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 6c-3-2-6-2-9-1v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1z M12 6v13" fill="#fff" stroke="${T}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  meta: `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#fff" stroke="${T}" stroke-width="1.8"/><circle cx="12" cy="12" r="4.5" fill="${ROSA}" stroke="${T}" stroke-width="1.8"/></svg>`,
};

window.Ilus = { gato, gatoDormido, taza, escritorio, iconoCurso, mini, COLORES: { CREMA, ROSA, LAV, MENTA, MIEL, CIELO } };
})();
