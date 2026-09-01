#!/usr/bin/env python3
"""Add a photo to the gallery: resizes it, records it in gallery-data.json.

Usage:
    ./add-photo.py <source-image> "<label>" [YYYY-MM-DD]

If the date is omitted, today's date is used. The full-resolution original
is kept in assets/gallery/.originals/; the resized copy (max 1800px on the
long edge, JPEG quality 75) is what actually gets served.
"""
import sys
import os
import shutil
import subprocess
import json
from datetime import date

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
GALLERY_DIR = os.path.join(REPO_ROOT, "assets", "gallery")
ORIGINALS_DIR = os.path.join(GALLERY_DIR, ".originals")
DATA_PATH = os.path.join(REPO_ROOT, "gallery-data.json")


def get_dimensions(path):
    out = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", path],
        capture_output=True, text=True, check=True,
    ).stdout
    width = height = None
    for line in out.splitlines():
        line = line.strip()
        if line.startswith("pixelWidth:"):
            width = int(line.split(":")[1])
        elif line.startswith("pixelHeight:"):
            height = int(line.split(":")[1])
    return width, height


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    src = sys.argv[1]
    label = sys.argv[2]
    photo_date = sys.argv[3] if len(sys.argv) > 3 else date.today().isoformat()

    if not os.path.isfile(src):
        print(f"No such file: {src}")
        sys.exit(1)

    filename = os.path.basename(src)
    dest = os.path.join(GALLERY_DIR, filename)

    if os.path.exists(dest):
        print(f"{filename} already exists in assets/gallery/ — rename it or remove the existing one first.")
        sys.exit(1)

    os.makedirs(ORIGINALS_DIR, exist_ok=True)
    shutil.copy2(src, os.path.join(ORIGINALS_DIR, filename))
    shutil.copy2(src, dest)

    subprocess.run(
        ["sips", "-Z", "1800", "--setProperty", "formatOptions", "75", dest, "--out", dest],
        check=True, capture_output=True,
    )

    width, height = get_dimensions(dest)

    with open(DATA_PATH) as f:
        data = json.load(f)

    data[filename] = {"date": photo_date, "label": label, "width": width, "height": height}

    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")

    print(f"Added {filename}: {photo_date} — {label} ({width}x{height})")


if __name__ == "__main__":
    main()
