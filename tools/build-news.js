#!/usr/bin/env node
/* 최신 활동 글마다 검색 · 공유용 정적 페이지를 만듭니다.

   사용법 (저장소 루트에서):  node tools/build-news.js

   assets/js/news-data.js 와 news-data.en.js 를 고친 뒤 실행하고, 바뀐 news/, en/news/, sitemap.xml 을 함께 커밋합니다.
   - news/<id>.html, en/news/<id>.html : 글 한 편의 제목 · 본문 · 사진과 공유용(og) 태그가 HTML에 직접 들어간 페이지
   - sitemap.xml : news:start ~ news:end 표시 사이의 글 주소 목록
   헤더 · 푸터 · 스타일 링크는 news.html / en/news.html 에서 그대로 가져오므로, 메뉴를 바꾸면 다시 실행하면 됩니다.
   news/ 와 en/news/ 의 <숫자>.html 은 실행할 때마다 지우고 새로 만듭니다. 직접 고치지 마세요. */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://' + fs.readFileSync(path.join(ROOT, 'CNAME'), 'utf8').trim();
const DEFAULT_OG_IMAGE = ORIGIN + '/assets/img/hero-exhibition.jpg';

const LANGS = [
  {
    code: 'ko', dir: '', data: 'assets/js/news-data.js', other: 'en',
    site: '헬스클라우드', home: '홈', news: '최신 활동',
    older: '← 이전 글', newer: '다음 글 →', none: '없음', back: '목록으로', source: '관련 기사 보기'
  },
  {
    code: 'en', dir: 'en/', data: 'assets/js/news-data.en.js', other: 'ko',
    site: 'Health Cloud', home: 'Home', news: 'News',
    older: '← Previous', newer: 'Next →', none: 'None', back: 'Back to list', source: 'Read the article'
  }
];

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadPosts(rel) {
  const sandbox = { window: {} };
  vm.runInNewContext(read(rel), sandbox, { filename: rel });
  const posts = sandbox.window.HC_NEWS;
  if (!Array.isArray(posts)) throw new Error(rel + ': window.HC_NEWS 배열을 찾지 못했습니다.');
  return posts;
}

/* 글 페이지는 목록 페이지보다 한 단계 아래 폴더에 있으므로 상대 경로 앞에 ../ 를 붙입니다. */
function deeper(html) {
  return html.replace(/\b(href|src)="([^"]*)"/g, (m, attr, url) =>
    /^([a-z][a-z0-9+.-]*:|#|\/)/i.test(url) || url === '' ? m : attr + '="../' + url + '"');
}

function cut(html, startRe, endRe, label, rel) {
  const s = html.search(startRe);
  const rest = s < 0 ? '' : html.slice(s);
  const e = rest.search(endRe);
  if (s < 0 || e < 0) throw new Error(rel + ': ' + label + ' 부분을 찾지 못했습니다.');
  return rest.slice(0, e);
}

/* 목록 페이지(news.html)에서 공통 부분을 가져옵니다. */
function shell(rel) {
  const html = read(rel);
  const script = /<script src="([^"]*site\.js)"><\/script>/.exec(html);
  if (!script) throw new Error(rel + ': site.js 스크립트 태그를 찾지 못했습니다.');
  const header = cut(html, /<header class="site-header">/, /<\/header>/, '헤더', rel) + '</header>';
  return {
    headAssets: deeper(cut(html, /<link rel="icon"/, /<\/head>/, 'head의 아이콘 · 스타일 링크', rel).trimEnd()),
    header: deeper(header),
    footer: deeper(cut(html, /<!-- CONTACT -->/, /<script /, '푸터', rel).trimEnd()),
    siteJs: '../' + script[1]
  };
}

function describe(post) {
  const text = String((post.body || [])[0] || post.title).replace(/\s+/g, ' ').trim();
  if (text.length <= 150) return text;
  const head = text.slice(0, 150);
  const sp = head.lastIndexOf(' ');
  return (sp > 100 ? head.slice(0, sp) : head) + '…';
}

const imagesOf = (post) => (post.images && post.images.length ? post.images : (post.image ? [post.image] : []));

function render(lang, post, older, newer, sh, hasOther) {
  const pageUrl = ORIGIN + '/' + lang.dir + 'news/' + post.id + '.html';
  const listUrl = ORIGIN + '/' + lang.dir + 'news.html';
  const koUrl = ORIGIN + '/news/' + post.id + '.html';
  const enUrl = ORIGIN + '/en/news/' + post.id + '.html';
  const imgs = imagesOf(post);
  const full = !!(post.images && post.images.length);
  const ogImage = imgs.length ? new URL(imgs[0], listUrl).href : DEFAULT_OG_IMAGE;
  const desc = describe(post);
  const title = post.title + ' | ' + lang.site;

  const alternates = hasOther
    ? '  <link rel="alternate" hreflang="ko" href="' + koUrl + '">\n  <link rel="alternate" hreflang="en" href="' + enUrl + '">\n'
    : '';
  /* 언어 버튼은 같은 글의 다른 언어 페이지로 보냅니다. 그 언어에 글이 없으면 목록으로 갑니다. */
  const otherHref = lang.code === 'ko' ? '../en/news/' + post.id + '.html' : '../../news/' + post.id + '.html';
  const header = hasOther
    ? sh.header.replace(/(<a class="lang-btn[^"]*" href=")[^"]*(")/g, '$1' + otherHref + '$2')
    : sh.header;

  const covers = imgs.map((src) =>
    '      <div class="cover' + (full ? ' full' : '') + '"><img src="../' + esc(src) + '" alt="' + esc(post.title) + '"></div>').join('\n');
  let body = (post.body || []).map((t) => '        <p>' + esc(t) + '</p>').join('\n');
  if (post.link) body += '\n        <p class="source"><a class="text-link" href="' + esc(post.link) + '" target="_blank" rel="noopener">' + lang.source + ' →</a></p>';

  const navLink = (p, cls, label) => p
    ? '        <a href="' + p.id + '.html"' + (cls ? ' class="' + cls + '"' : '') + '><span class="k">' + label + '</span><span class="t">' + esc(p.title) + '</span></a>'
    : '        <a href="#" class="' + (cls ? cls + ' ' : '') + 'disabled" aria-disabled="true" tabindex="-1"><span class="k">' + label + '</span><span class="t">' + lang.none + '</span></a>';

  return [
    '<!DOCTYPE html>',
    '<html lang="' + lang.code + '">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <title>' + esc(title) + '</title>',
    '  <meta name="description" content="' + esc(desc) + '">',
    '  <link rel="canonical" href="' + pageUrl + '">',
    alternates + '  <meta property="og:site_name" content="' + esc(lang.site) + '">',
    '  <meta property="og:type" content="article">',
    '  <meta property="og:title" content="' + esc(post.title) + '">',
    '  <meta property="og:description" content="' + esc(desc) + '">',
    '  <meta property="og:image" content="' + esc(ogImage) + '">',
    '  <meta property="og:url" content="' + pageUrl + '">',
    '  <meta name="twitter:card" content="summary_large_image">',
    '  ' + sh.headAssets,
    '</head>',
    '<body data-page="news">',
    '<!-- tools/build-news.js 가 만든 파일입니다. 직접 고치지 말고 assets/js/' + path.basename(lang.data) + ' 를 고친 뒤 다시 생성하세요. -->',
    '',
    '  <section class="hero">',
    '    ' + header,
    '',
    '    <div class="container news-hero">',
    '      <div class="crumbs" style="padding-top:0"><span>' + lang.home + '</span><span>›</span><span>' + lang.news + '</span><span>›</span><b>' + esc(post.cat) + '</b></div>',
    '      <div class="news-detail-head">',
    '        <div class="meta"><span class="cat">' + esc(post.cat) + '</span><span class="date">' + esc(post.date) + '</span></div>',
    '        <h1>' + esc(post.title) + '</h1>',
    '      </div>',
    '    </div>',
    '  </section>',
    '',
    '  <section class="white">',
    '    <article class="article">',
    covers,
    '      <div class="body">',
    body,
    '      </div>',
    '      <div class="article-nav">',
    navLink(older, '', lang.older),
    navLink(newer, 'newer', lang.newer),
    '      </div>',
    '      <div class="article-back"><a href="../news.html" class="btn outline">' + lang.back + '</a></div>',
    '    </article>',
    '  </section>',
    '',
    '  ' + sh.footer,
    '',
    '  <script src="' + sh.siteJs + '"></script>',
    '</body>',
    '</html>',
    ''
  ].filter((line) => line !== null && line !== undefined).join('\n').replace(/\n\n\n+/g, '\n\n');
}

function writeSitemap(ids, idsByLang) {
  const rel = 'sitemap.xml';
  let xml = read(rel);
  const entry = (lang, id) => {
    const both = idsByLang.ko.has(id) && idsByLang.en.has(id);
    const links = both
      ? '    <xhtml:link rel="alternate" hreflang="ko" href="' + ORIGIN + '/news/' + id + '.html"/>\n' +
        '    <xhtml:link rel="alternate" hreflang="en" href="' + ORIGIN + '/en/news/' + id + '.html"/>\n'
      : '';
    return '  <url>\n    <loc>' + ORIGIN + '/' + lang.dir + 'news/' + id + '.html</loc>\n' + links + '  </url>\n';
  };
  let block = '  <!-- news:start (tools/build-news.js 가 채웁니다) -->\n';
  ids.forEach((id) => LANGS.forEach((lang) => { if (idsByLang[lang.code].has(id)) block += entry(lang, id); }));
  block += '  <!-- news:end -->\n';
  const marked = /[ \t]*<!-- news:start[\s\S]*?<!-- news:end -->\r?\n?/;
  if (marked.test(xml)) xml = xml.replace(marked, block);
  else if (xml.includes('</urlset>')) xml = xml.replace('</urlset>', block + '</urlset>');
  else throw new Error(rel + ': </urlset> 를 찾지 못했습니다.');
  fs.writeFileSync(path.join(ROOT, rel), xml);
}

function main() {
  const postsByLang = {}, idsByLang = {};
  LANGS.forEach((lang) => {
    postsByLang[lang.code] = loadPosts(lang.data);
    idsByLang[lang.code] = new Set(postsByLang[lang.code].map((p) => p.id));
    if (idsByLang[lang.code].size !== postsByLang[lang.code].length) throw new Error(lang.data + ': id가 겹치는 글이 있습니다.');
  });

  LANGS.forEach((lang) => {
    const posts = postsByLang[lang.code];
    const sh = shell(lang.dir + 'news.html');
    const outDir = path.join(ROOT, lang.dir, 'news');
    fs.mkdirSync(outDir, { recursive: true });
    fs.readdirSync(outDir).filter((f) => /^\d+\.html$/.test(f)).forEach((f) => fs.unlinkSync(path.join(outDir, f)));
    posts.forEach((post, i) => {
      // 목록은 최신 글이 위이므로 다음 칸이 이전 글입니다.
      const html = render(lang, post, posts[i + 1] || null, i > 0 ? posts[i - 1] : null, sh, idsByLang[lang.other].has(post.id));
      fs.writeFileSync(path.join(outDir, post.id + '.html'), html);
    });
    console.log(lang.dir + 'news/: ' + posts.length + '개 글 페이지 생성');
  });

  const ids = Array.from(new Set(postsByLang.ko.concat(postsByLang.en).map((p) => p.id))).sort((a, b) => b - a);
  writeSitemap(ids, idsByLang);
  console.log('sitemap.xml: 글 주소 ' + ids.reduce((n, id) => n + (idsByLang.ko.has(id) ? 1 : 0) + (idsByLang.en.has(id) ? 1 : 0), 0) + '개 반영');

  LANGS.forEach((lang) => {
    const missing = [...idsByLang[lang.other]].filter((id) => !idsByLang[lang.code].has(id));
    if (missing.length) console.warn('주의: ' + lang.data + ' 에 없는 글 id: ' + missing.join(', '));
  });
}

main();
