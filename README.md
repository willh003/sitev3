# willhuey.com

Personal research page for Will Huey. Plain static HTML/CSS — no build step, no
dependencies. GitHub Pages serves the files directly (`.nojekyll` disables Jekyll
processing).

## Editing

Everything lives in two files:

- `index.html` — all content (bio, news, publications)
- `styles.css` — all styling

To add a publication, copy an existing `<article class="paper">` block in
`index.html` and update the text, links, and teaser image. Drop the image in
`assets/publications/`.

To update news, add a `<li>` to the `<ul class="news">` list.

### Photo gallery

`gallery.html` (styled by `gallery.css`) is a separate page linked from the
"Photo gallery" link at the bottom of `index.html`'s footer — it isn't loaded
by `index.html`, so it stays out of the way of the main page.

The grid is built at load time from `gallery-data.json`, which maps each
filename in `assets/gallery/` to a date, a label, and the image's pixel
dimensions (the dimensions let the browser reserve the right amount of
space before the image loads, so the masonry layout doesn't jump around
as photos come in).

To add a photo, run:

```
./add-photo.py path/to/photo.jpg "Label" [YYYY-MM-DD]
```

This resizes the image (max 1800px on the long edge, JPEG quality 75),
keeps the full-resolution original in `assets/gallery/.originals/`, and
adds the entry to `gallery-data.json` for you — no manual editing needed.
The date defaults to today if omitted.

## Local preview

Just open `index.html` in a browser, or run a tiny static server:

```
python3 -m http.server
```

then visit http://localhost:8000.
