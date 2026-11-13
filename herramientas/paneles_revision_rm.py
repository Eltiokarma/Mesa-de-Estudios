"""Hojas de contacto de QA: fichas completas y ampliaciones de figuras."""
from pathlib import Path
import argparse
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".ocr-deps"))
from PIL import Image

def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("carpeta")
    cli.add_argument("graficos", nargs="*", type=int)
    args = cli.parse_args()
    d = ROOT / "fuentes/ocr-local/cuzcano" / args.carpeta
    cards = {int(p.stem.split("-")[1]): p for p in d.glob("qa-[0-9]*.png")}
    assert cards, d
    def paneles(numbers, stem, crop, w, h, cols, rows):
        size = cols * rows
        for start in range(0, len(numbers), size):
            canvas = Image.new("RGB", (w * cols, h * rows), "white")
            for j, n in enumerate(numbers[start:start+size]):
                with Image.open(cards[n]) as im:
                    cell = im.crop(crop) if crop else im.copy()
                    cell.thumbnail((w, h), Image.Resampling.LANCZOS)
                canvas.paste(cell, (j % cols * w, j // cols * h))
            canvas.save(d / f"panel-{stem}-{1+start//size}.png")
    paneles(sorted(cards), "todas", None, 250, 150, 5, 5)
    paneles(args.graficos, "graficos", (0, 0, 448, 470), 320, 336, 4, 3)
    print(f"{len(cards)} fichas, {len(args.graficos)} figuras ampliadas")

if __name__ == "__main__":
    main()
