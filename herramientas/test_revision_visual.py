import hashlib
import json
import tempfile
import unittest
from pathlib import Path
from aplicar_correcciones_ocr import apply
from estado_revision_visual import resolved


class RevisionTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent)
        self.addCleanup(self.temp.cleanup)
        self.folder = Path(self.temp.name)
        self.source = self.folder / 'p-0001.json'
        self.raw = json.dumps({'pagina_pdf': 1, 'archivo': 'ejemplo.pdf', 'texto': ''}).encode()
        self.source.write_bytes(self.raw)
        self.review_path = self.folder / 'revision-visual-p0001.json'
        self.review = {'pagina_pdf': 1, 'texto_reconstruido': 'Texto visible',
            'sha256_ocr_original': hashlib.sha256(self.raw).hexdigest(),
            'estado': 'texto_cotejado', 'alcance': 'texto_completo', 'pendientes': []}

    def write_review(self):
        self.review_path.write_text(json.dumps(self.review), encoding='utf-8')

    def test_reconstruye_ocr_vacio_sin_sobrescribir_original(self):
        self.write_review()
        apply(self.review_path)
        self.assertEqual(self.source.read_bytes(), self.raw)
        self.assertTrue(resolved(self.review_path))
        self.assertEqual(json.loads((self.folder / 'p-0001.corregido.json').read_text(encoding='utf-8'))['texto_corregido'], 'Texto visible')

    def test_rechaza_reconstruccion_de_original_modificado(self):
        self.write_review()
        self.source.write_bytes(self.raw + b' ')
        with self.assertRaises(ValueError):
            apply(self.review_path)
        self.assertFalse(resolved(self.review_path))

    def test_correccion_previa_pierde_vigencia_si_cambia_original(self):
        self.write_review()
        apply(self.review_path)
        self.source.write_bytes(self.raw + b' ')
        self.assertFalse(resolved(self.review_path))

    def test_no_retira_pagina_con_pendientes(self):
        self.review['pendientes'] = ['Figura sin cotejar']
        self.write_review()
        apply(self.review_path)
        self.assertFalse(resolved(self.review_path))

    def test_rechaza_reconstruccion_mezclada_con_reemplazos(self):
        self.review['correcciones'] = [{'original': 'a', 'correccion': 'b'}]
        self.write_review()
        with self.assertRaises(ValueError):
            apply(self.review_path)


if __name__ == '__main__':
    unittest.main()
