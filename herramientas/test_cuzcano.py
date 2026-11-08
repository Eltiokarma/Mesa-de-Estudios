import io
import unittest
import json
import tempfile
from pathlib import Path
from unittest.mock import patch
from cuzcano import open_pdf, download
from reordenar_columnas_ocr import reorder


class DescargasTest(unittest.TestCase):
    def test_descarga_truncada_no_se_guarda_como_pdf_completo(self):
        class Response(io.BytesIO):
            headers = {'Content-Length': '100'}
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as directory:
            with patch('cuzcano.ROOT', Path(directory)), patch('cuzcano.time.sleep'), \
                 patch('cuzcano.open_pdf', side_effect=lambda url: (Response(b'corto'), b'%PDF-1.7\n')):
                result = download({'id': 'prueba', 'titulo': 'Prueba truncada'})
                self.assertEqual(result['estado'], 'error')
                self.assertFalse((Path(directory) / 'fuentes/libros/cuzcano/prueba.pdf').exists())

    def test_pdf_directo(self):
        with patch('urllib.request.urlopen', return_value=io.BytesIO(b'%PDF-1.7\ncontenido')):
            response, first = open_pdf('https://drive.google.com/uc?id=ejemplo')
            self.assertTrue(first.startswith(b'%PDF-'))
            response.close()

    def test_confirmacion_archivo_grande(self):
        form = b'<form id="download-form" action="https://drive.usercontent.google.com/download"><input type="hidden" name="id" value="abc"><input type="hidden" name="confirm" value="t"></form>'
        with patch('urllib.request.urlopen', side_effect=[io.BytesIO(form), io.BytesIO(b'%PDF-1.7\ncontenido')]) as request:
            response, first = open_pdf('https://drive.google.com/uc?id=abc')
            self.assertIn('id=abc', request.call_args.args[0])
            self.assertTrue(first.startswith(b'%PDF-'))
            response.close()

    def test_no_confundir_login_con_pdf(self):
        with patch('urllib.request.urlopen', return_value=io.BytesIO(b'<html>Sign in</html>')):
            with self.assertRaises(ValueError):
                open_pdf('https://drive.google.com/uc?id=abc')

    def test_rechazar_formulario_externo(self):
        form = b'<form id="download-form" action="https://example.org/download"><input type="hidden" name="id" value="abc"></form>'
        with patch('urllib.request.urlopen', return_value=io.BytesIO(form)) as request:
            with self.assertRaises(ValueError):
                open_pdf('https://drive.google.com/uc?id=abc')
            self.assertEqual(request.call_count, 1)


class ColumnasTest(unittest.TestCase):
    def test_separa_lineas_que_el_ocr_mezclo_entre_columnas(self):
        # Two physical lines, each crossing the two columns in the OCR TSV.
        rows = ['5\t1\t1\t1\t1\t1\t10\t10\t10\t10\t90\tA',
                '5\t1\t1\t1\t1\t2\t60\t10\t10\t10\t90\tB',
                '5\t1\t1\t1\t2\t1\t10\t30\t10\t10\t90\tC',
                '5\t1\t1\t1\t2\t2\t60\t30\t10\t10\t90\tD']
        with tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent) as directory:
            path = Path(directory) / 'p-0001.json'
            path.write_text(json.dumps({'archivo': 'prueba.pdf', 'pagina_pdf': 1,
                'regiones': [{'caja_px': [0, 0, 100, 100], 'tsv': '\n'.join(rows)}]}), encoding='utf-8')
            reorder(path, 2)
            result = json.loads((path.parent / 'columnas-p-0001.json').read_text(encoding='utf-8'))
            self.assertEqual(result['texto'], 'A\nC\n\nB\nD')


if __name__ == '__main__':
    unittest.main()
