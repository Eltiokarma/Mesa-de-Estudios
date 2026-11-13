import unittest
from mejorar_ocr_local import metrics, validate_selection


class LotesLocalesTest(unittest.TestCase):
    def test_mitad_vacia_no_convierte_confianza_de_palabras_en_cero(self):
        tsv = '5\t1\t1\t1\t1\t1\t0\t0\t20\t10\t90\ttexto\n5\t1\t1\t1\t1\t2\t0\t20\t20\t10\t10\tfórmula'
        self.assertEqual(metrics([{'tsv': tsv}, {'tsv': ''}]), {'palabras': 2, 'confianza_palabras': 50.0})
        self.assertEqual(metrics([{'tsv': ''}]), {'palabras': 0, 'confianza_palabras': None})

    def test_rechaza_lotes_fuera_de_limite_y_rutas_ajenas(self):
        catalog = {'libros': [{'id': 'conocido'}]}
        for book, limit, pages in [('../otro', 5, None), ('conocido', 21, None),
                                   ('conocido', 1, [1, 2]), ('conocido', 5, [0]),
                                   ('conocido', 5, [1, 1])]:
            with self.subTest(book=book, limit=limit, pages=pages):
                with self.assertRaises(ValueError):
                    validate_selection(book, limit, pages, catalog)


if __name__ == '__main__':
    unittest.main()
