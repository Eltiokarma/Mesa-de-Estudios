import io
import unittest
from unittest.mock import patch
from cuzcano import open_pdf


class DescargasTest(unittest.TestCase):
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


if __name__ == '__main__':
    unittest.main()
