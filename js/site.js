/* ============================================================
   site.js: shared behaviour for every page
   - mobile menu and "More" dropdown
   - site search (reads the site's own pages, no build step)
   - photo lightbox
   - back-to-top button, footer year, heading anchors
   To add a new page to search, add it to PAGES below.
   ============================================================ */
(function () {
  'use strict';

  var PAGES = [
    ['history.html', 'ইতিহাস · History'],
    ['people.html', 'মানুষ · People'],
    ['interviews.html', 'সাক্ষাৎকার · Interviews'],
    ['writings.html', 'রচনা · Writings'],
    ['gallery.html', 'ছবি · Photos'],
    ['geography.html', 'ভূগোল · Geography'],
    ['services.html', 'পরিষেবা · Services'],
    ['voter.html', 'ভোটার তথ্য · Voter info'],
    ['facts.html', 'তথ্য · Facts'],
    ['about.html', 'আমাদের কথা · About'],
    ['community.html', 'স্মৃতি পাঠান · Share a memory']
  ];

  /* ---------- footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- give headings stable ids so search can link to them ---------- */
  function addHeadingIds(root) {
    var hs = root.querySelectorAll('main h2, main h3');
    for (var i = 0; i < hs.length; i++) {
      if (!hs[i].id) hs[i].id = 's-' + (i + 1);
    }
    return hs;
  }
  addHeadingIds(document);

  /* ---------- mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
  }

  /* "More" dropdown on wide screens */
  var moreBtn = document.querySelector('.more-btn');
  if (moreBtn) {
    var moreLi = moreBtn.parentNode;
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = moreLi.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!moreLi.contains(e.target)) {
        moreLi.classList.remove('open');
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- search panel toggle ---------- */
  var searchBtn = document.querySelector('.search-toggle');
  var panel = document.getElementById('site-search');
  if (searchBtn && panel) {
    searchBtn.addEventListener('click', function () {
      var willOpen = panel.hidden;
      panel.hidden = !willOpen;
      searchBtn.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        var inp = panel.querySelector('input');
        if (inp) inp.focus();
      }
    });
  }

  /* ---------- search ---------- */
  var index = null;
  var loading = null;

  function textOf(el) {
    /* join child elements with a space so "ইতিহাস<span>History</span>" reads as two words */
    var parts = [];
    el.childNodes.forEach(function (n) { parts.push(n.textContent); });
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  function buildIndex() {
    if (loading) return loading;
    loading = Promise.all(PAGES.map(function (p) {
      return fetch(p[0]).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var main = doc.querySelector('main');
        if (!main) return [];
        var hs = addHeadingIds(doc);
        var entries = [];
        /* one entry per section, split at each h2/h3 */
        var current = { page: p[0], label: p[1], heading: '', anchor: '', text: '' };
        var walker = doc.createTreeWalker(main, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        var node;
        while ((node = walker.nextNode())) {
          if (node.nodeType === 1 && (node.tagName === 'H2' || node.tagName === 'H3')) {
            if (current.text) entries.push(current);
            current = { page: p[0], label: p[1], heading: textOf(node), anchor: node.id, text: '' };
          } else if (node.nodeType === 3) {
            var par = node.parentNode;
            if (par && /^(SCRIPT|STYLE|H2|H3)$/.test(par.tagName)) continue;
            if (par && par.closest && par.closest('h2, h3')) continue;
            current.text += ' ' + node.nodeValue;
          }
        }
        if (current.text) entries.push(current);
        entries.forEach(function (e) {
          e.text = e.text.replace(/\s+/g, ' ').trim();
          e.lower = (e.heading + ' ' + e.text).toLowerCase();
        });
        return entries;
      }).catch(function () { return []; });
    })).then(function (lists) {
      index = [].concat.apply([], lists);
      return index;
    });
    return loading;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return escapeHtml(text.slice(0, 140)) + '…';
    var start = Math.max(0, i - 60);
    var end = Math.min(text.length, i + q.length + 80);
    /* cut at spaces so Bengali letters are never split */
    if (start > 0) { var sp = text.indexOf(' ', start); if (sp > -1 && sp < i) start = sp + 1; }
    if (end < text.length) { var ep = text.lastIndexOf(' ', end); if (ep > i + q.length) end = ep; }
    var before = escapeHtml(text.slice(start, i));
    var hit = escapeHtml(text.slice(i, i + q.length));
    var after = escapeHtml(text.slice(i + q.length, end));
    return (start > 0 ? '…' : '') + before + '<mark>' + hit + '</mark>' + after + (end < text.length ? '…' : '');
  }

  function runSearch(q, out) {
    q = q.trim().toLowerCase();
    if (q.length < 2) { out.innerHTML = ''; return; }
    out.innerHTML = '<p class="search-status">খুঁজছি… Searching…</p>';
    buildIndex().then(function (idx) {
      if (!idx.length) {
        out.innerHTML = '<p class="search-status">সার্চ এখন কাজ করছে না। Search works on the live website, not when the file is opened directly.</p>';
        return;
      }
      var words = q.split(/\s+/);
      var hits = idx.filter(function (e) {
        return words.every(function (w) { return e.lower.indexOf(w) >= 0; });
      }).slice(0, 12);
      if (!hits.length) {
        out.innerHTML = '<p class="search-status">কিছু পাওয়া যায়নি। No results for “' + escapeHtml(q) + '”.</p>';
        return;
      }
      out.innerHTML = '<ul class="result-list">' + hits.map(function (h) {
        var href = h.page + (h.anchor ? '#' + h.anchor : '');
        return '<li><a href="' + href + '"><span class="result-page">' + escapeHtml(h.label) +
          '</span><span class="result-title">' + escapeHtml(h.heading || h.label) +
          '</span><span class="result-snippet">' + snippet(h.text, words[0]) + '</span></a></li>';
      }).join('') + '</ul>';
    });
  }

  var forms = document.querySelectorAll('.search-form');
  for (var f = 0; f < forms.length; f++) {
    (function (form) {
      var input = form.querySelector('input');
      var out = document.querySelector(form.getAttribute('data-results'));
      if (!input || !out) return;
      var timer;
      input.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () { runSearch(input.value, out); }, 200);
      });
      input.addEventListener('focus', buildIndex, { once: true });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        runSearch(input.value, out);
      });
    })(forms[f]);
  }

  /* ---------- lightbox for photos ---------- */
  var imgs = document.querySelectorAll('.gallery-item img, .prose img, .photo-strip img');
  if (imgs.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button class="lightbox-close" aria-label="Close / বন্ধ">×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(box);
    var bImg = box.querySelector('img');
    var bCap = box.querySelector('figcaption');
    var close = function () { box.hidden = true; document.body.classList.remove('menu-open'); };
    box.addEventListener('click', function (e) { if (e.target === box || e.target.className === 'lightbox-close') close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    Array.prototype.forEach.call(imgs, function (img) {
      if (img.closest('a')) return; /* linked images keep their link */
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        bImg.src = img.currentSrc || img.src;
        bImg.alt = img.alt;
        var fig = img.closest('figure');
        var cap = fig ? fig.querySelector('figcaption') : null;
        bCap.textContent = cap ? cap.textContent.trim() : img.alt;
        box.hidden = false;
        document.body.classList.add('menu-open');
      });
    });
  }

  /* ---------- back to top ---------- */
  var top = document.querySelector('.to-top');
  if (top) {
    window.addEventListener('scroll', function () {
      top.hidden = window.scrollY < 700;
    }, { passive: true });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
