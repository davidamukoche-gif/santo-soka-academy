# Santo Soka Academy — Website

Official website for **Santo Soka Academy** — a standalone Kenyan football
academy founded in 2010, based in the Dagoretti region of Nairobi.

The site covers every age group the academy runs, from **Under-6** all
the way up to the **Senior team**.

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — hero, stats, team pathway preview, programmes, CTA |
| `about.html` | Full history and story of the club and academy |
| `teams.html` | Every age group (U6, U8, U10, U12, U14, U16, U18, Senior) |
| `gallery.html` | Filterable photo gallery (training / matchday / youth / senior) |
| `contact.html` | Trial registration form and contact info |

## Running locally

It's a static site — no build step.

```bash
# from the repo root
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just double-click `index.html`.

## Structure

```
santo-soka-academy/
├── index.html
├── about.html
├── teams.html
├── gallery.html
├── contact.html
├── css/style.css
├── js/main.js
└── images/
```

## Swapping in more photos

Real academy photos live under `images/`, `images/teams/` and
`images/coaches/`. To add or replace:

1. Drop new images into the relevant folder.
2. Update the matching `<img src="...">` path in the HTML.

## Credits

- Social: [@santos_soka_academy](https://www.instagram.com/santos_soka_academy/)
