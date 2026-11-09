import json
import tempfile
import unittest
from pathlib import Path
from indexar_ejercicios_locales import build,verify,package,identity

class ArchiveTest(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(dir=Path(__file__).resolve().parent)
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)
        self.folder=self.root/'piloto-test';self.folder.mkdir()
        self.ficha=self.folder/'ejercicio.json'
        self.ficha.write_text(json.dumps({'id':'tema-problema-8','fuente':{'libro_id':'libro','paginas_pdf':[2]},'estado':'parcial'}),encoding='utf-8')
        (self.folder/'index.html').write_text('<a href="ejercicio.json">Ficha</a>',encoding='utf-8')

    def test_cambio_y_faltante_se_detectan(self):
        build(self.root);verify(self.root)
        self.ficha.write_text('{}',encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'modificado'):verify(self.root)
        self.ficha.unlink()
        with self.assertRaises(FileNotFoundError):verify(self.root)

    def test_no_acepta_dos_fichas_con_misma_identidad(self):
        (self.folder/'otra.json').write_bytes(self.ficha.read_bytes())
        with self.assertRaisesRegex(ValueError,'duplicado'):build(self.root)

    def test_identidad_distingue_ejemplo_y_problema(self):
        base={'fuente':{'libro_id':'libro'}}
        a=identity(dict(base,id='tema-ejemplo-8'))[0]
        b=identity(dict(base,id='tema-problema-8'))[0]
        self.assertNotEqual(a,b)

    def test_enlace_fuera_del_archivo_rechazado(self):
        (self.folder/'index.html').write_text('<a href="../../secreto.json">Fuera</a>',encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'fuera'):build(self.root)

    def test_reutiliza_sin_origen_y_empaqueta(self):
        build(self.root);index,manifest=verify(self.root)
        self.assertEqual(len(index['ejercicios']),1)
        self.assertTrue(package(self.root).is_file())
        _,changes=build(self.root)
        self.assertEqual(changes,{'nuevos':[],'modificados':[],'retirados':[]})

if __name__=='__main__':unittest.main()
