// Reporte corto para node --test: solo las pruebas que fallan y los totales.
// Uso: npm run test:corto [-- carpeta o archivos]. La salida completa de npm test pasa de 75 000 líneas.
export default async function* reporteCorto(fuente) {
  let pasan = 0, fallan = 0;
  const totales = [];
  for await (const ev of fuente) {
    const d = ev.data || {};
    if (ev.type === 'test:pass') {
      if (!d.details || d.details.type !== 'suite') pasan++;
    } else if (ev.type === 'test:fail') {
      // Un archivo o un grupo que falla solo porque falló una prueba suya no se repite.
      const error = d.details && d.details.error;
      if (error && error.failureType === 'subtestsFailed') continue;
      fallan++;
      const causa = (error && error.cause) || error || {};
      const texto = String(causa.message || causa || '').split('\n').slice(0, 12).join('\n    ');
      const donde = d.file ? `${d.file.replace(process.cwd() + '/', '')}${d.line ? ':' + d.line : ''}` : '';
      yield `FALLA ${donde} › ${d.name}\n    ${texto}\n`;
    } else if (ev.type === 'test:diagnostic') {
      if (/^(tests|pass|fail|cancelled|skipped|todo|duration_ms) /.test(d.message)) totales.push(d.message);
    }
  }
  yield `\n${fallan ? 'HAY FALLAS' : 'Todo en verde'}: ${pasan} pasan, ${fallan} fallan (${totales.join(', ')})\n`;
}
