# Adding a news post

Posts live in two data files. Per-post pages are generated; never edit them by hand.

1. Put web-sized photos (JPG, ~1600px wide) in `assets/img/`.
2. Add the post at the top of `assets/js/news-data.js` (Korean). `id` = highest id + 1.
3. Add the same `id` to `assets/js/news-data.en.js` (English). Image paths there start with `../assets/img/`.
4. Run from the repo root:

   ```bash
   node tools/build-news.js
   ```

5. Commit everything together: data files, `news/`, `en/news/`, `sitemap.xml`, photos.

## Post format

```js
{
  id: 5, cat: '협력', date: '2026.11',
  title: '…',
  image: 'assets/img/photo.jpg',   // one photo, cropped to a wide cover
  // images: ['a.jpg', 'b.jpg'],   // several photos, uncropped (use instead of image)
  link: 'https://…',               // optional source link under the body
  body: ['paragraph 1', 'paragraph 2']   // paragraph 1 is also the search/share description
}
```

`cat`: `과제수주` `IP` `협력` `전시회` `인증` `제품` `언론보도` (English: `Grants` `IP` `Partnerships` `Exhibitions` `Certification` `Products` `Press`).

## What the script writes

- `news/<id>.html`, `en/news/<id>.html`: wiped and regenerated on every run.
- `sitemap.xml`: only the block between `news:start` and `news:end`.

Rerun after any post change, and after editing the header or footer of `news.html` / `en/news.html` (post pages copy them). If you skip it, a new post shows in the list but its link 404s.
