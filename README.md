# Santo Soka Academy — Website

Official website for **Santo Soka Academy**, the youth development arm of
**Dagoretti Green Santos FC** — a Kenyan football club based in the
Dagoretti region of Nairobi.

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

## Swapping in your own photos

The site currently uses football-themed placeholder images (stock photography)
so you can go live immediately. To replace them with real photos from
[@santos_soka_academy](https://www.instagram.com/santos_soka_academy/):

1. Drop your images into `images/` (e.g. `images/u6.jpg`, `images/senior.jpg`,
   `images/gallery/match-1.jpg`).
2. Find the matching `<img src="https://images.unsplash.com/…">` in the HTML
   and change it to `src="images/your-photo.jpg"`.

That's it — no code changes needed.

## Credits

- Club & academy info: [FKF Nairobi West — Dagoretti Green Santos](https://fkfnairobiwest.ke/team/dagoretti-green-santos)
- Social: [@santos_soka_academy](https://www.instagram.com/santos_soka_academy/)
- Placeholder imagery: Unsplash (royalty-free)
