# Health Cloud site

Static site, no build step. Pushing `master` deploys via GitHub Pages.

## News posts

- Posts live in `assets/js/news-data.js` (ko) and `assets/js/news-data.en.js` (en), same `id` in both.
- After changing a post, or the header/footer of `news.html` / `en/news.html`, run `node tools/build-news.js` and commit the regenerated `news/`, `en/news/`, `sitemap.xml`.
- Never hand-edit `news/<id>.html` or `en/news/<id>.html`.
- Details: `tools/README.md`.
