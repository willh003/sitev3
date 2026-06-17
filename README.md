# raymondyu5.github.io

Personal research page for Raymond Yu. Plain static HTML/CSS — no build step, no
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

## Structure

```
raymondyu5.github.io/
├── index.html        # the page
├── styles.css        # styles
├── .nojekyll         # tell GitHub Pages to serve files as-is
├── assets/
│   ├── icon.png      # favicon
│   ├── profile-pics/
│   └── publications/ # paper teaser images/gifs
└── googlef0696328b30b87db.html   # Google Search Console verification
```

## Local preview

Just open `index.html` in a browser, or run a tiny static server:

```
python3 -m http.server
```

then visit http://localhost:8000.
