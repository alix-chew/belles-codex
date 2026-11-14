from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "LG_Vibe_Coding_Version 3November2026.pdf"
OUT = ROOT / "public" / "images"
PAGE_010 = OUT / "pdf-page-010.png"
PAGE_015 = OUT / "pdf-page-015.png"


def find_relevant_pages(reader):
    terms = ("kopi", "vite", "react", "tailwind", "blue ocean", "YKK")
    matches = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        lowered = text.lower()
        if any(term.lower() in lowered for term in terms):
            matches.append((index, " ".join(text.split())[:900]))
    return matches


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(PDF))
    matches = find_relevant_pages(reader)
    for page_number, excerpt in matches[:40]:
        print(f"PAGE {page_number}: {excerpt}".encode("ascii", "ignore").decode())
    print(f"TOTAL_MATCHES {len(matches)}")

    # These crops reuse imagery rendered from the assignment PDF.
    # They are intentionally kept as project assets so the app does not depend on remote images.
    crops = [
        (PAGE_010, OUT / "kopi-site-reference.png", (565, 700, 920, 1000)),
        (PAGE_015, OUT / "codex-build-reference.png", (180, 385, 990, 885)),
    ]
    for source, target, box in crops:
        if source.exists():
            Image.open(source).crop(box).save(target)
            print(f"SAVED {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
