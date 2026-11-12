"""PDF de tarjetas para recortar: una por alumno con su usuario y su contraseña inicial."""
import io

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

ANCHO, ALTO = 90 * mm, 52 * mm
COLS, FILAS = 2, 5


def _recortar(t: str, n: int) -> str:
    return t if len(t) <= n else t[: n - 1] + "…"


def armar(tarjetas: list[dict], colegio: str, app_url: str = "") -> bytes:
    """tarjetas: [{ nombre, grado, seccion, usuario, contrasena }]"""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    c.setTitle(f"Tarjetas de ingreso · {colegio}")
    c.setAuthor("Mesa de Estudios")
    pw, ph = A4
    x0, y0 = (pw - COLS * ANCHO) / 2, (ph - FILAS * ALTO) / 2
    por_hoja = COLS * FILAS
    if not tarjetas:
        c.setFont("Helvetica", 12)
        c.drawString(25 * mm, ph - 30 * mm, "No hay cuentas nuevas en esta carga.")
    for i, t in enumerate(tarjetas):
        if i and i % por_hoja == 0:
            c.showPage()
        k = i % por_hoja
        x = x0 + (k % COLS) * ANCHO
        y = y0 + (FILAS - 1 - k // COLS) * ALTO
        c.setDash(3, 3)
        c.setStrokeColorRGB(0.6, 0.6, 0.6)
        c.rect(x, y, ANCHO, ALTO)
        c.setDash()
        c.setFillColorRGB(0.33, 0.25, 0.65)
        c.rect(x, y + ALTO - 9 * mm, ANCHO, 9 * mm, stroke=0, fill=1)
        c.setFillColorRGB(1, 1, 1)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 4 * mm, y + ALTO - 6 * mm, "Mesa de Estudios")
        c.setFont("Helvetica", 8)
        c.drawRightString(x + ANCHO - 4 * mm, y + ALTO - 6 * mm, _recortar(colegio, 38))
        c.setFillColorRGB(0, 0, 0)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 4 * mm, y + ALTO - 15 * mm, _recortar(t["nombre"], 44))
        c.setFont("Helvetica", 8.5)
        c.drawString(x + 4 * mm, y + ALTO - 20 * mm, f"{t['grado']}.º de secundaria · sección {t['seccion']}")
        c.setFont("Helvetica", 8.5)
        c.drawString(x + 4 * mm, y + 22 * mm, "Usuario")
        c.drawString(x + 48 * mm, y + 22 * mm, "Contraseña")
        c.setFont("Courier-Bold", 14)
        c.drawString(x + 4 * mm, y + 16 * mm, t["usuario"])
        c.drawString(x + 48 * mm, y + 16 * mm, t["contrasena"])
        c.setFont("Helvetica", 7)
        c.drawString(x + 4 * mm, y + 9 * mm, "Al entrar por primera vez, elige una contraseña nueva.")
        c.drawString(x + 4 * mm, y + 5.5 * mm, "Si la olvidas, pídele a tu profesor que la reinicie.")
        if app_url:
            c.drawString(x + 4 * mm, y + 2 * mm, _recortar(app_url, 70))
    c.showPage()
    c.save()
    return buf.getvalue()
