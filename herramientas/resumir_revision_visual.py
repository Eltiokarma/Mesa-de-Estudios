"""Publica sólo metadatos de revisión; el texto fuente permanece local."""
import json
from collections import defaultdict
from datetime import datetime, timezone
from cuzcano import ROOT, save
from estado_revision_visual import resolved


def main():
    folder = ROOT / 'fuentes/ocr-local/cuzcano'
    grouped = defaultdict(list)
    for path in folder.glob('*/revision-*.json'):
        data = json.loads(path.read_text(encoding='utf-8'))
        grouped[(path.parent.name, data['pagina_pdf'])].append((path, data))
    samples = []
    for (key, number), entries in sorted(grouped.items()):
        blank = any(d.get('estado') == 'sin_texto_principal' for _, d in entries)
        complete = any(resolved(p) for p, _ in entries)
        correction = folder / key / f'p-{number:04d}.corregido.json'
        corrected = json.loads(correction.read_text(encoding='utf-8')) if correction.exists() else {}
        samples.append({'id': key, 'pagina_pdf': number,
            'estado': 'sin_texto_principal' if blank else ('texto_cotejado' if complete else 'parcial'),
            'hallazgos': list(dict.fromkeys(v for _, d in entries for v in d.get('hallazgos', []))),
            'copia_corregida_local': correction.exists(),
            'reemplazos_puntuales': corrected.get('correcciones_aplicadas', 0),
            'reconstruccion_visual': corrected.get('reconstruccion_visual', False),
            'validacion_matematica': 'no_certificada'})
    queue = json.loads((folder / 'cola-revision.json').read_text(encoding='utf-8'))
    report = {'generado_utc': datetime.now(timezone.utc).isoformat(),
        'alcance': 'Cotejo visual por página. No certifica libros completos ni exactitud matemática.',
        'prioridad_solicitada': 'Páginas de baja confianza, primero sin cotejo previo',
        'paginas_con_algun_cotejo': len(samples),
        'paginas_pendientes_baja_confianza': len(queue),
        'paginas_excluidas_sin_texto_principal': sum(s['estado'] == 'sin_texto_principal' for s in samples),
        'paginas_texto_completo_cotejado': sum(s['estado'] == 'texto_cotejado' for s in samples),
        'paginas_cotejo_parcial': sum(s['estado'] == 'parcial' for s in samples),
        'copias_corregidas_locales': sum(s['copia_corregida_local'] for s in samples),
        'reconstrucciones_visuales': sum(s['reconstruccion_visual'] for s in samples),
        'reemplazos_puntuales': sum(s['reemplazos_puntuales'] for s in samples),
        'muestras': samples}
    save(ROOT / 'fuentes/cuzcano/revision-muestras.json', report)
    print(json.dumps({k: v for k, v in report.items() if k != 'muestras'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
