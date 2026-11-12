// Trampas de unidades en todos los cursos (decisión de Gerson, 12 nov 2026: «es importante que el alumno no
// falle en unidades y magnitudes»). Cada generador de la lista debe sacar sus trampas con código de unidades
// (U1–U8 en física, QU en química, AU en aritmética y geometría, RU en razonamiento matemático; ver
// docs/investigacion/unidades-ideas-erroneas.md), y ninguna puede pasar de 1000 veces la correcta.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const P = require('../nucleo/predicciones.js');

const ESPERADAS = {
  // Física: las que se habían perdido por la regla de ×20 (rutinas/fisica-admision.md).
  'carga-en-campo': ['U2-mT', 'U2-cm'],
  'induccion-flujo': ['U3-cm2', 'U6-ms'],
  'condensadores': ['U3-cm2', 'U2-mm'],
  'circuitos-joule': ['U6-min', 'U2-mA'],
  'calor-escalas': ['U8-sumar-273', 'U8-kelvin'],
  // Química (las AQ- de unidades pasaron a QU, 12 nov 2026).
  'conversiones-quimica': ['QU1-gramos-como-kg', 'QU2-litro-como-100-cm3', 'QU3-signo-273'],
  'estequiometria-admision': ['QU2-ml-sin-pasar'],
};
module.exports = { ESPERADAS };

for (const [id, codigos] of Object.entries(ESPERADAS)) {
  test(`${id}: salen las trampas de unidades ${codigos.join(', ')} y ninguna pasa de 1000 veces`, () => {
    const gen = require(path.join(__dirname, '..', 'plantillas', id, 'generador.js'));
    const vistos = new Set();
    for (let s = 0; s < 1500; s++) {
      const p = gen.generar(s);
      for (const a of p.alternativas) {
        if (!a.error || !P.esUnidades(a.error.id)) continue;
        vistos.add(a.error.id);
        if (typeof a.valor === 'number' && typeof p.respuesta.valor === 'number')
          assert.ok(P.enEscala(a.valor, p.respuesta.valor, a.error.id), `semilla ${s}: ${a.texto} frente a ${p.respuesta.valor}`);
      }
    }
    for (const c of codigos) assert.ok(vistos.has(c), `no sale ${c}`);
  });
}
