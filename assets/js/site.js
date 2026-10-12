/* Health Cloud site behaviors: header, hero slider, section nav, tabs, inquiry modal, news. */
(function () {
  'use strict';

  var CONFIG = {
    // Web3Forms 접근 키(https://web3forms.com 에서 발급). 넣으면 폼 내용이 등록한 메일로 전송됩니다.
    web3formsKey: '05bf3675-2a0f-4690-b8cf-8819bf4d9d98',
    // 직접 운영하는 수신 서버가 있을 때만 사용 (JSON POST). web3formsKey가 있으면 그쪽이 우선합니다.
    inquiryEndpoint: '',
    // 둘 다 비어 있으면 메일 클라이언트(mailto)로 대체합니다.
    inquiryEmail: 'shchoi@h-cloud.co.kr',
    newsDefaultImage: 'assets/img/hero-lineup.jpg'
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- Header ---------- */
  function initHeader() {
    var toggle = $('[data-nav-toggle]');
    var nav = $('[data-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.classList.toggle('open', open);
      });
      $$('a', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
    $$('[data-drop]').forEach(function (drop) {
      var btn = $('button', drop);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = drop.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      drop.addEventListener('mouseleave', function () { if (window.innerWidth > 860) drop.classList.remove('open'); });
    });
    document.addEventListener('click', function (e) {
      $$('[data-drop].open').forEach(function (d) { if (!d.contains(e.target)) d.classList.remove('open'); });
    });
  }

  /* ---------- Hero slider ---------- */
  function initSliders() {
    $$('[data-slider]').forEach(function (root) {
      var slides = $$('.slide', root);
      if (slides.length < 2) { var c = $('.slider-ctrl', root); if (c) c.hidden = true; return; }
      var dotsWrap = $('.slider-dots', root);
      var counter = $('.slider-counter', root);
      var i = 0, timer = null, paused = false;
      var dots = slides.map(function (_, k) {
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', (k + 1) + '번 이미지');
        b.addEventListener('click', function () { go(k); });
        dotsWrap.insertBefore(b, counter);
        return b;
      });
      function pad(n) { return String(n).padStart(2, '0'); }
      function go(n) {
        i = (n + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
        dots.forEach(function (d, k) { d.classList.toggle('active', k === i); });
        if (counter) counter.textContent = pad(i + 1) + ' / ' + pad(slides.length);
      }
      function start() { stop(); timer = setInterval(function () { if (!paused) go(i + 1); }, 5000); }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      $('[data-prev]', root).addEventListener('click', function () { go(i - 1); start(); });
      $('[data-next]', root).addEventListener('click', function () { go(i + 1); start(); });
      root.addEventListener('mouseenter', function () { paused = true; });
      root.addEventListener('mouseleave', function () { paused = false; });
      go(0); start();
    });
  }

  /* ---------- Section nav (solution pages) ---------- */
  function initSubnav() {
    var nav = $('[data-subnav]');
    if (!nav) return;
    var links = $$('a', nav);
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });
    function update() {
      var line = window.innerHeight * 0.35, cur = 0;
      ids.forEach(function (id, k) {
        var el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = k;
      });
      var doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) cur = ids.length - 1;
      links.forEach(function (a, k) { a.classList.toggle('active', k === cur); });
    }
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var el = document.getElementById(a.getAttribute('href').slice(1));
        if (!el) return;
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
      });
    });
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 3-in-1 modes (beauty) ---------- */
  function initModes() {
    $$('[data-modes]').forEach(initModeRoot);
  }
  function initModeRoot(root) {
    if ($('[data-mode-track]', root)) return initModeSlides(root);
    var btns = $$('.seg-tabs button', root), ind = $('[data-seg-ind]', root), panels = $$('.tab-panel', root);
    var screen = $('[data-mode-shots]', root), shots = $$('.mode-shot', root);
    var ctrl = $('[data-mode-ctrl]', root), dots = $('[data-mode-dots]', root);
    var items = $$('.item-grid .item', root);
    var mq = window.matchMedia('(max-width: 759px)');
    var tab = 0, idx = 0, cur = null, sx = null;

    function shotsOf(t) { return shots.filter(function (s) { return +s.getAttribute('data-tab') === t; }); }
    function render() {
      btns.forEach(function (b, k) { b.classList.toggle('active', k === tab); b.setAttribute('aria-selected', k === tab ? 'true' : 'false'); });
      if (ind && btns.length) ind.style.left = 'calc(5px + (100% - 10px) * ' + (tab / btns.length) + ')';
      panels.forEach(function (p, k) { p.classList.toggle('active', k === tab); });
      var list = shotsOf(tab);
      if (idx >= list.length) idx = 0;
      shots.forEach(function (s) { s.classList.remove('active'); s.style.transform = ''; s.style.transition = ''; });
      if (list[idx]) list[idx].classList.add('active');
      if (ctrl) ctrl.hidden = list.length < 2;
      if (dots) dots.innerHTML = list.map(function (_, k) { return '<span class="' + (k === idx ? 'active' : '') + '"></span>'; }).join('');
      if (screen) screen.classList.toggle('static', list.length < 2);
    }
    function go(n) { var len = shotsOf(tab).length; if (!len) return; idx = (n + len) % len; render(); }
    function closeItems() { items.forEach(function (it) { it.classList.remove('open'); var em = $('em', it); if (em) em.textContent = '+'; }); }

    btns.forEach(function (b, k) { b.addEventListener('click', function () { tab = k; idx = 0; closeItems(); render(); }); });
    var prev = $('[data-mode-prev]', root), next = $('[data-mode-next]', root);
    if (prev) prev.addEventListener('click', function () { go(idx - 1); });
    if (next) next.addEventListener('click', function () { go(idx + 1); });

    if (screen) {
      screen.addEventListener('dragstart', function (e) { e.preventDefault(); });
      screen.addEventListener('pointerdown', function (e) {
        if (shotsOf(tab).length < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
        sx = e.clientX; cur = shotsOf(tab)[idx];
        try { screen.setPointerCapture(e.pointerId); } catch (_) {}
        screen.classList.add('dragging');
        if (cur) cur.style.transition = 'none';
      });
      screen.addEventListener('pointermove', function (e) {
        if (sx === null) return;
        var dx = Math.max(-120, Math.min(120, e.clientX - sx));
        if (cur) cur.style.transform = 'translateX(' + dx + 'px)';
      });
      var end = function (e) {
        if (sx === null) return;
        var dx = e.clientX - sx; sx = null;
        screen.classList.remove('dragging');
        if (cur) { cur.style.transition = ''; cur.style.transform = ''; }
        if (dx < -40) go(idx + 1); else if (dx > 40) go(idx - 1);
      };
      screen.addEventListener('pointerup', end);
      screen.addEventListener('pointercancel', function () { sx = null; screen.classList.remove('dragging'); if (cur) { cur.style.transition = ''; cur.style.transform = ''; } });
    }

    items.forEach(function (it) {
      var head = $('.item-head', it);
      if (!head) return;
      head.addEventListener('click', function () {
        if (!mq.matches) return;
        var open = it.classList.contains('open');
        closeItems();
        if (!open) { it.classList.add('open'); var em = $('em', it); if (em) em.textContent = '−'; }
      });
    });
    if (mq.addEventListener) mq.addEventListener('change', closeItems); else if (mq.addListener) mq.addListener(closeItems);

    render();
  }

  /* 3-in-1 slides: horizontal snap track, per-slide phone with auto-advancing shots */
  function initModeSlides(root) {
    var btns = $$('.seg-tabs button', root), ind = $('[data-seg-ind]', root);
    var track = $('[data-mode-track]', root), slides = $$('.mode-slide', root);
    var navPrev = $('[data-modes-prev]', root), navNext = $('[data-modes-next]', root), navIdx = $('[data-modes-idx]', root);
    var items = $$('.item-grid .item', root);
    var mq = window.matchMedia('(max-width: 759px)');
    var n = slides.length, tab = 0, prog = 0, hover = false, touching = false, inView = true;
    var md = null, moved = false, progTimer = null, programmatic = false;
    var S = slides.map(function (sl) {
      var shots = $$('.mode-shot', sl), segs = $('[data-mode-segs]', sl), sb = $('[data-mode-sb]', sl);
      if (segs) { segs.innerHTML = shots.map(function () { return '<button type="button"><span><i></i></span></button>'; }).join(''); segs.hidden = shots.length < 2; }
      return { el: sl, shots: shots, segs: segs ? $$('button', segs) : [], sb: sb, idx: 0 };
    });

    function slideW() { var c = slides[0]; return c ? c.getBoundingClientRect().width + 12 : 0; }
    function setInd(pos, animate) {
      if (!ind || !n) return;
      ind.style.transition = animate ? '' : 'none';
      ind.style.left = 'calc(5px + (100% - 10px) * ' + (Math.max(0, Math.min(n - 1, pos)) / n) + ')';
    }
    function updateSb(k) {
      var st = S[k], sh = st.shots[st.idx]; if (!st.sb || !sh) return;
      var max = sh.scrollHeight - sh.clientHeight;
      if (max <= 1) { st.sb.hidden = true; return; }
      st.sb.hidden = false;
      var trackH = st.sb.clientHeight, thumbH = Math.max(24, Math.round(trackH * sh.clientHeight / sh.scrollHeight));
      var thumb = $('i', st.sb);
      thumb.style.height = thumbH + 'px';
      thumb.style.top = Math.round((trackH - thumbH) * (sh.scrollTop / max)) + 'px';
    }
    function renderShots(k) {
      var st = S[k];
      st.shots.forEach(function (sh, j) { sh.classList.toggle('active', j === st.idx); });
      updateSb(k);
      st.segs.forEach(function (bt, j) {
        var f = j < st.idx ? 1 : (j === st.idx && k === tab ? prog : 0);
        var bar = $('i', bt); bar.classList.toggle('run', f > 0); bar.style.width = (f * 100).toFixed(1) + '%';
      });
    }
    function render() {
      btns.forEach(function (b, k) { b.classList.toggle('active', k === tab); b.setAttribute('aria-selected', k === tab ? 'true' : 'false'); });
      slides.forEach(function (sl, k) { sl.classList.toggle('active', k === tab); });
      if (navPrev) navPrev.disabled = tab <= 0;
      if (navNext) navNext.disabled = tab >= n - 1;
      if (navIdx) navIdx.textContent = '0' + (tab + 1);
      S.forEach(function (_, k) { renderShots(k); });
    }
    function closeItems() { items.forEach(function (it) { it.classList.remove('open'); var em = $('em', it); if (em) em.textContent = '+'; }); }
    function scrollTo(k, smooth) {
      var w = slideW(); if (!track || !w) return;
      programmatic = true;
      if (smooth && track.scrollTo) track.scrollTo({ left: k * w, behavior: 'smooth' }); else track.scrollLeft = k * w;
    }
    function setTab(k, scroll) {
      k = Math.max(0, Math.min(n - 1, k));
      if (k !== tab) { tab = k; prog = 0; closeItems(); }
      if (scroll) scrollTo(k, true); else if (!track) setInd(k, true);
      render();
    }

    btns.forEach(function (b, k) { b.addEventListener('click', function () { setTab(k, true); }); });
    if (navPrev) navPrev.addEventListener('click', function () { setTab(tab - 1, true); });
    if (navNext) navNext.addEventListener('click', function () { setTab(tab + 1, true); });
    $$('[data-mode-goto]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        setTab(+b.getAttribute('data-mode-goto'), true);
        if (track) window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY - 16, behavior: 'smooth' });
      });
    });

    S.forEach(function (st, k) {
      st.segs.forEach(function (bt, j) { bt.addEventListener('click', function () { st.idx = j; prog = 0; renderShots(k); }); });
      var screen = $('[data-phone]', st.el);
      if (!screen) return;
      screen.addEventListener('mouseenter', function () { hover = true; });
      screen.addEventListener('mouseleave', function () { hover = false; });
      screen.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') touching = true; });
      screen.addEventListener('pointerup', function () { touching = false; });
      screen.addEventListener('pointercancel', function () { touching = false; });
      st.shots.forEach(function (sh) {
        sh.addEventListener('scroll', function () { updateSb(k); }, { passive: true });
        $$('img', sh).forEach(function (im) { im.addEventListener('load', function () { updateSb(k); }); });
      });
    });

    if (track) {
      track.addEventListener('dragstart', function (e) { e.preventDefault(); });
      track.addEventListener('scroll', function () {
        var w = slideW(); if (!w) return;
        setInd(track.scrollLeft / w, false);
        if (programmatic) { clearTimeout(progTimer); progTimer = setTimeout(function () { programmatic = false; }, 150); return; }
        var k = Math.round(track.scrollLeft / w);
        if (k !== tab) { setTab(k, false); }
      }, { passive: true });
      track.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return;
        var ps = e.target.closest('.mode-shot');
        md = { x: e.clientX, y: e.clientY, sl: track.scrollLeft, ps: ps, st: ps ? ps.scrollTop : 0, axis: null, id: e.pointerId };
        moved = false;
      });
      track.addEventListener('pointermove', function (e) {
        if (!md) return;
        var dx = e.clientX - md.x, dy = e.clientY - md.y;
        if (!md.axis) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          var canV = md.ps && md.ps.scrollHeight > md.ps.clientHeight + 1;
          md.axis = canV && Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
          try { track.setPointerCapture(md.id); } catch (_) {}
          if (md.axis === 'x') track.classList.add('dragging');
        }
        moved = true;
        if (md.axis === 'y') md.ps.scrollTop = md.st - dy; else track.scrollLeft = md.sl - dx;
      });
      var up = function (e) {
        if (!md) return;
        var m = md; md = null;
        setTimeout(function () { moved = false; }, 0);
        if (m.axis !== 'x') return;
        var w = slideW(), dx = e.clientX - m.x, k = tab;
        if (w) { var start = Math.round(m.sl / w); k = dx < -40 ? start + 1 : dx > 40 ? start - 1 : start; }
        k = Math.max(0, Math.min(n - 1, k));
        if (k !== tab) setTab(k, true); else scrollTo(k, true);
        setTimeout(function () { track.classList.remove('dragging'); }, 450);
      };
      track.addEventListener('pointerup', up);
      track.addEventListener('pointercancel', up);
      track.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
      if (window.IntersectionObserver) {
        new IntersectionObserver(function (en) {
          var v = en[0].isIntersecting;
          if (v && !inView) { S.forEach(function (st) { st.idx = 0; }); prog = 0; render(); }
          inView = v;
        }, { threshold: 0.35 }).observe(track);
      }
    }

    setInterval(function () {
      var st = S[tab]; if (!st || st.shots.length < 2) return;
      if (hover || touching || md || document.hidden || !inView) return;
      prog += 0.2 / 3;
      if (prog >= 1) { st.idx = (st.idx + 1) % st.shots.length; prog = 0; }
      renderShots(tab);
    }, 200);

    items.forEach(function (it) {
      var head = $('.item-head', it);
      if (!head) return;
      head.addEventListener('click', function () {
        if (!mq.matches) return;
        var open = it.classList.contains('open');
        closeItems();
        if (!open) { it.classList.add('open'); var em = $('em', it); if (em) em.textContent = '−'; }
      });
    });
    var onMq = function () { closeItems(); scrollTo(tab, false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
    window.addEventListener('resize', function () { scrollTo(tab, false); S.forEach(function (_, k) { updateSb(k); }); });

    render();
  }

  /* ---------- Inquiry modal ---------- */
  var MODAL_HTML =
    '<div class="modal" data-modal role="dialog" aria-modal="true" aria-label="문의하기">' +
    '<div class="modal-box">' +
    '<button type="button" class="modal-close" data-close aria-label="닫기">×</button>' +
    '<div class="modal-head"><svg class="chips-mark" width="50" height="10" viewBox="0 0 50 10" aria-hidden="true"><rect width="10" height="10" fill="#2E7CC4"/><rect x="14" width="10" height="10" fill="#E8391D"/><rect x="28" width="22" height="10" fill="#FFD400"/></svg>' +
    '<h2>문의하기</h2><p>남겨주신 내용을 확인한 뒤 담당자가 연락드립니다.</p></div>' +
    '<form class="inq-form" novalidate>' +
    '<div class="inq-grid">' +
    '<label class="field"><span>회사명<span class="req">*</span></span><input name="company" type="text" required placeholder="회사 또는 기관명"></label>' +
    '<label class="field"><span>담당자<span class="req">*</span></span><input name="name" type="text" required placeholder="이름"></label>' +
    '<label class="field"><span>연락처<span class="req">*</span></span><input name="phone" type="tel" required placeholder="010-0000-0000"></label>' +
    '<label class="field"><span>이메일<span class="req">*</span></span><input name="email" type="email" required placeholder="name@company.com"></label>' +
    '</div>' +
    '<div><div class="field-label" style="margin-bottom:8px">관심 솔루션 <small>(중복 선택 가능)</small></div>' +
    '<div class="sol-pick">' +
    '<label><input type="checkbox" name="solution" value="3-in-1 뷰티 케어">3-in-1 뷰티 케어</label>' +
    '<label><input type="checkbox" name="solution" value="모세혈관으로 보는 웰니스">모세혈관으로 보는 웰니스</label>' +
    '</div></div>' +
    '<input type="checkbox" name="botcheck" class="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<label class="field">문의 내용<textarea name="message" rows="4" placeholder="도입 목적, 예상 규모, 일정 등을 자유롭게 적어주세요."></textarea></label>' +
    '<div><div class="consent-row">' +
    '<label class="consent"><input type="checkbox" name="consent" required><span>개인정보 수집 · 이용에 동의합니다. <span class="req">*</span></span></label>' +
    '<button type="button" class="priv-toggle" data-priv aria-expanded="false">자세히 보기 <span>▾</span></button></div>' +
    '<div class="priv-box" data-priv-box>' +
    '<div><b>수집 항목</b><span>회사명, 담당자명, 연락처, 이메일, 문의 내용</span></div>' +
    '<div><b>수집 목적</b><span>도입 문의 확인 및 상담, 회신</span></div>' +
    '<div><b>보유 기간</b><span>문의 처리 완료 후 1년간 보관 후 파기</span></div>' +
    '<span class="note">동의를 거부할 수 있으며, 거부 시 문의 접수가 제한됩니다.</span></div></div>' +
    '<p class="inq-error" data-error></p>' +
    '<button type="submit" class="inq-submit">문의 보내기 <span>→</span></button>' +
    '</form>' +
    '<div class="inq-done"><svg class="chips-mark" width="68" height="14" viewBox="0 0 68 14" aria-hidden="true"><rect width="14" height="14" fill="#2E7CC4"/><rect x="18" width="14" height="14" fill="#E8391D"/><rect x="36" width="32" height="14" fill="#FFD400"/></svg>' +
    '<h2>문의가 접수되었습니다</h2><p>영업일 기준 2일 이내에 입력하신 연락처로 연락드리겠습니다.</p>' +
    '<button type="button" class="btn navy sm" data-close>확인</button></div>' +
    '</div></div>';

  function initInquiry() {
    var openers = $$('[data-open-inquiry]');
    if (!openers.length) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = MODAL_HTML;
    var modal = wrap.firstChild;
    document.body.appendChild(modal);
    var box = $('.modal-box', modal);
    var form = $('form', modal);
    var errorEl = $('[data-error]', modal);
    var submitBtn = $('.inq-submit', modal);

    function open(preset) {
      box.classList.remove('sent');
      form.reset();
      errorEl.classList.remove('show');
      if (preset) {
        $$('input[name="solution"]', form).forEach(function (c) { c.checked = c.value === preset; });
      }
      modal.classList.add('open');
      document.body.classList.add('no-scroll');
      setTimeout(function () { var f = $('input[name="company"]', form); if (f) f.focus(); }, 50);
    }
    function close() {
      modal.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    openers.forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(b.getAttribute('data-open-inquiry')); });
    });
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', close); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    var privBtn = $('[data-priv]', modal), privBox = $('[data-priv-box]', modal);
    privBtn.addEventListener('click', function () {
      var on = privBox.classList.toggle('open');
      privBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
      $('span', privBtn).textContent = on ? '▴' : '▾';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.classList.remove('show');
      if (!form.checkValidity()) {
        errorEl.textContent = '필수 항목을 확인해 주세요.';
        errorEl.classList.add('show');
        var bad = $(':invalid', form); if (bad) bad.focus();
        return;
      }
      var data = {
        company: form.company.value.trim(),
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        solutions: $$('input[name="solution"]:checked', form).map(function (c) { return c.value; }),
        message: form.message.value.trim(),
        page: location.pathname + location.hash,
        sentAt: new Date().toISOString()
      };
      var subjectLine = '[도입 문의] ' + data.company + ' / ' + data.name;
      function post(url, payload, okCheck) {
        submitBtn.disabled = true;
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, json: j }; }); })
          .then(function (res) { if (!okCheck(res)) throw new Error('bad status'); box.classList.add('sent'); })
          .catch(function () { errorEl.textContent = '전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.'; errorEl.classList.add('show'); })
          .then(function () { submitBtn.disabled = false; });
      }
      if (CONFIG.web3formsKey) {
        if (form.botcheck && form.botcheck.checked) { box.classList.add('sent'); return; }
        post('https://api.web3forms.com/submit', {
          access_key: CONFIG.web3formsKey,
          subject: subjectLine,
          from_name: '헬스클라우드 홈페이지 문의',
          replyto: data.email,
          '회사명': data.company,
          '담당자': data.name,
          '연락처': data.phone,
          '이메일': data.email,
          '관심 솔루션': data.solutions.join(', ') || '-',
          '문의 내용': data.message || '-',
          '접수 페이지': data.page
        }, function (res) { return res.ok && res.json && res.json.success; });
      } else if (CONFIG.inquiryEndpoint) {
        post(CONFIG.inquiryEndpoint, data, function (res) { return res.ok; });
      } else {
        var subject = subjectLine;
        var body = [
          '회사명: ' + data.company,
          '담당자: ' + data.name,
          '연락처: ' + data.phone,
          '이메일: ' + data.email,
          '관심 솔루션: ' + (data.solutions.join(', ') || '-'),
          '',
          '문의 내용:',
          data.message || '-'
        ].join('\n');
        window.location.href = 'mailto:' + CONFIG.inquiryEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        box.classList.add('sent');
      }
    });
  }

  /* ---------- Proof band (IP / grants / allies) ---------- */
  function initProof() {
    var root = $('[data-proof]');
    var data = window.HC_PROOF;
    if (!root || !data) return;
    var VISIBLE = 4;
    function row(it) {
      return '<div class="proof-item"><span class="tag ' + esc(it.type || '') + '">' + esc(it.tag || '') + '</span>' +
        '<span class="name">' + esc(it.name || '') + '</span>' +
        (it.ref ? '<span class="ref">' + esc(it.ref) + '</span>' : '') + '</div>';
    }
    var cards = $$('[data-proof-card]', root), open = false, renders = [];
    var toggle = $('[data-proof-toggle]', root), label = $('[data-proof-label]', root), toggleWrap = $('[data-proof-more-wrap]', root);
    cards.forEach(function (card) {
      var items = data[card.getAttribute('data-proof-card')] || [];
      var list = $('[data-proof-list]', card), more = $('[data-proof-more]', card), inner = $('.proof-more-inner', card);
      var num = $('[data-proof-num]', card), sub = $('[data-proof-sub]', card);
      if (num) num.textContent = items.length;
      if (sub) {
        var pat = items.filter(function (i) { return i.type === 'patent'; }).length;
        var cr = items.filter(function (i) { return i.type === 'copyright'; }).length;
        sub.textContent = '특허 ' + pat + ' · 저작권 ' + cr;
      }
      list.innerHTML = items.slice(0, VISIBLE).map(row).join('');
      var rest = items.slice(VISIBLE);
      inner.innerHTML = rest.map(row).join('');
      if (!rest.length) card.classList.add('nomore');
      renders.push(function () {
        card.classList.toggle('open', open);
        more.style.maxHeight = open ? inner.scrollHeight + 'px' : '0px';
      });
    });
    var anyMore = cards.some(function (c) { return !c.classList.contains('nomore'); });
    function renderAll() {
      renders.forEach(function (r) { r(); });
      if (label) label.textContent = open ? '접기' : '더보기';
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (!anyMore) {
      cards.forEach(function (c) { c.classList.add('static'); });
      if (toggleWrap) toggleWrap.hidden = true;
    } else {
      renderAll();
      var flip = function () { open = !open; renderAll(); };
      if (toggle) toggle.addEventListener('click', flip);
      cards.forEach(function (card) { card.classList.add('clickable'); card.addEventListener('click', flip); });
    }

    var allies = data.allies || [];
    var wrap = $('[data-ally-scroll]', root), track = $('[data-ally-track]', root), section = $('[data-allies]', root);
    if (!allies.length) { if (section) section.hidden = true; return; }
    var set = [], rep = Math.max(1, Math.ceil(8 / allies.length));
    for (var r = 0; r < rep; r++) set = set.concat(allies);
    track.innerHTML = set.concat(set).map(function (a) {
      var body = a.logo
        ? '<div class="ally-logo" role="img" aria-label="' + esc(a.name) + '" style="background-image:url(&quot;' + esc(a.logo) + '&quot;)"></div>'
        : '<span>' + esc(a.name) + '</span>';
      return '<div class="ally"><div class="ally-card" title="' + esc(a.name) + '">' + body + '</div></div>';
    }).join('');
    var paused = false, drag = false, pos = 0, last = performance.now(), sx = 0, sl = 0, touchTimer = null;
    function tick(t) {
      var dt = Math.min(64, t - last); last = t;
      var half = wrap.scrollWidth / 2;
      if (!paused && !drag) pos += dt * 0.04; else pos = wrap.scrollLeft;
      if (pos >= half) pos -= half; if (pos < 0) pos += half;
      wrap.scrollLeft = pos;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    wrap.addEventListener('mouseenter', function () { paused = true; });
    wrap.addEventListener('mouseleave', function () { paused = false; drag = false; wrap.classList.remove('dragging'); });
    wrap.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; drag = true; sx = e.clientX; sl = wrap.scrollLeft; wrap.classList.add('dragging'); wrap.setPointerCapture(e.pointerId); });
    wrap.addEventListener('pointermove', function (e) { if (drag) wrap.scrollLeft = sl - (e.clientX - sx); });
    function endDrag() { drag = false; wrap.classList.remove('dragging'); }
    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);
    wrap.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    wrap.addEventListener('touchend', function () { clearTimeout(touchTimer); touchTimer = setTimeout(function () { paused = false; }, 1500); }, { passive: true });
  }

  /* ---------- News ---------- */
  var NEWS_CATS = ['전체', '과제수주', 'IP', '얼라이언스', '전시회', '인증', '제품', '언론보도'];

  function newsRow(p) {
    return '<a href="news.html#post-' + p.id + '" class="news-row">' +
      '<span class="cat">' + esc(p.cat) + '</span>' +
      '<span class="date">' + esc(p.date) + '</span>' +
      '<span class="title">' + esc(p.title) + '</span>' +
      '<span class="go">→</span></a>';
  }

  function initNewsLatest() {
    var el = $('[data-news-latest]');
    if (!el || !window.HC_NEWS) return;
    var n = parseInt(el.getAttribute('data-news-latest'), 10) || 5;
    el.innerHTML = window.HC_NEWS.slice(0, n).map(newsRow).join('');
  }

  function initNewsPage() {
    var root = $('[data-news-page]');
    if (!root || !window.HC_NEWS) return;
    var POSTS = window.HC_NEWS, PER = 10;
    var state = { cat: '전체', page: 1 };
    var listHead = $('[data-news-list-head]'), detailHead = $('[data-news-detail-head]');
    var listSec = $('[data-news-list]'), detailSec = $('[data-news-detail]');
    var chipsEl = $('[data-news-chips]'), totalEl = $('[data-news-total]'), rowsEl = $('[data-news-rows]'), pagerEl = $('[data-news-pager]');
    var cats = NEWS_CATS.filter(function (c) { return c === '전체' || POSTS.some(function (p) { return p.cat === c; }); });

    function currentId() { var m = /^#post-(\d+)$/.exec(location.hash); return m ? +m[1] : null; }

    function renderList() {
      var list = state.cat === '전체' ? POSTS : POSTS.filter(function (p) { return p.cat === state.cat; });
      var pages = Math.max(1, Math.ceil(list.length / PER));
      state.page = Math.min(Math.max(1, state.page), pages);
      chipsEl.innerHTML = cats.map(function (c) {
        return '<button type="button" class="' + (c === state.cat ? 'active' : '') + '" data-cat="' + esc(c) + '" aria-pressed="' + (c === state.cat) + '">' + esc(c) + '</button>';
      }).join('');
      totalEl.innerHTML = '총 <b>' + list.length + '</b>건';
      rowsEl.innerHTML = list.slice((state.page - 1) * PER, state.page * PER).map(newsRow).join('') || '<p style="padding:32px 8px;color:#5B6472">등록된 소식이 없습니다.</p>';
      if (pages > 1) {
        var html = '<button type="button" data-page="' + (state.page - 1) + '" aria-label="이전 페이지">←</button>';
        for (var k = 1; k <= pages; k++) html += '<button type="button" data-page="' + k + '" class="' + (k === state.page ? 'active' : '') + '">' + k + '</button>';
        html += '<button type="button" data-page="' + (state.page + 1) + '" aria-label="다음 페이지">→</button>';
        pagerEl.innerHTML = html; pagerEl.hidden = false;
      } else { pagerEl.hidden = true; }
    }

    function renderDetail(post) {
      var idx = POSTS.indexOf(post);
      var older = POSTS[idx + 1], newer = idx > 0 ? POSTS[idx - 1] : null;
      $('[data-d-cat]', detailHead).textContent = post.cat;
      $('[data-d-cat2]', detailHead).textContent = post.cat;
      $('[data-d-date]', detailHead).textContent = post.date;
      $('[data-d-title]', detailHead).textContent = post.title;
      var img = $('[data-d-image]', detailSec);
      img.src = post.image || CONFIG.newsDefaultImage; img.alt = post.title;
      $('[data-d-body]', detailSec).innerHTML = (post.body || []).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('');
      var o = $('[data-d-older]', detailSec), nw = $('[data-d-newer]', detailSec);
      o.href = older ? '#post-' + older.id : '#'; o.classList.toggle('disabled', !older); $('.t', o).textContent = older ? older.title : '없음';
      nw.href = newer ? '#post-' + newer.id : '#'; nw.classList.toggle('disabled', !newer); $('.t', nw).textContent = newer ? newer.title : '없음';
      document.title = post.title + ' | Health Cloud';
    }

    function route() {
      var id = currentId();
      var post = id ? POSTS.filter(function (p) { return p.id === id; })[0] : null;
      listHead.hidden = !!post; listSec.hidden = !!post;
      detailHead.hidden = !post; detailSec.hidden = !post;
      if (post) { renderDetail(post); window.scrollTo(0, 0); }
      else { renderList(); document.title = '최신 활동 | Health Cloud'; }
    }

    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]'); if (!b) return;
      state.cat = b.getAttribute('data-cat'); state.page = 1; renderList();
    });
    pagerEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-page]'); if (!b) return;
      state.page = parseInt(b.getAttribute('data-page'), 10); renderList();
      window.scrollTo({ top: listSec.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
    });
    $$('[data-to-list]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        history.pushState(null, '', location.pathname + location.search);
        route(); window.scrollTo(0, 0);
      });
    });
    window.addEventListener('hashchange', route);
    route();
  }

  /* ---------- Hash scroll on load (cross-page anchors) ---------- */
  /* ---------- Careers flash (when navigated to #careers) ---------- */
  function initCareersFlash() {
    var sec = $('[data-careers]');
    if (!sec) return;
    var timer = null;
    function flash() {
      clearTimeout(timer);
      sec.classList.add('flash');
      timer = setTimeout(function () {
        sec.classList.remove('flash');
        // 강조가 끝나면 주소의 #careers를 지워 새로고침 때 다시 깜빡이지 않게 합니다.
        if (location.hash === '#careers' && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
      }, 1600);
    }
    window.addEventListener('hashchange', function () { if (location.hash === '#careers') flash(); });
    $$('a[href$="#careers"]').forEach(function (a) { a.addEventListener('click', function () { flash(); }); });
    if (location.hash === '#careers') setTimeout(flash, 100);
  }

  function initHashScroll() {
    if (!location.hash || /^#post-/.test(location.hash)) return;
    var id = decodeURIComponent(location.hash.slice(1));
    var el = document.getElementById(id);
    if (!el) return;
    setTimeout(function () { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY }); }, 50);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initSliders();
    initSubnav();
    initModes();
    initInquiry();
    initProof();
    initNewsLatest();
    initNewsPage();
    initCareersFlash();
    initHashScroll();
  });
})();
