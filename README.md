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

## Local preview

Just open `index.html` in a browser, or run a tiny static server:

```
python3 -m http.server
```

then visit http://localhost:8000.
