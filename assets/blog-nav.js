/* DijiMedu Blog — "Tüm yazılar" menüsü ve blog arama.
   Veri: /assets/blog-index.json (tools/build-blog-index.py üretir). */
(function () {
  "use strict";
  var DATA_URL = "/assets/blog-index.json?v=20261020";
  var data = null, loading = null;

  function load() {
    if (data) return Promise.resolve(data);
    if (!loading) loading = fetch(DATA_URL).then(function (r) { if (!r.ok) throw Error(r.status); return r.json(); }).then(function (d) { data = d; return d; });
    return loading;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function norm(s) {
    return String(s).toLocaleLowerCase("tr").replace(/[çğıöşüâîû]/g, function (c) { return { "ç": "c", "ğ": "g", "ı": "i", "ö": "o", "ş": "s", "ü": "u", "â": "a", "î": "i", "û": "u" }[c]; })
      .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  }
  function search(q, limit) {
    var words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    return data.posts.map(function (p) {
      var t = norm(p.t), all = t + " " + norm(p.d) + " " + norm(p.u), score = 0;
      for (var i = 0; i < words.length; i++) {
        if (all.indexOf(words[i]) < 0) return null;
        score += t.indexOf(words[i]) >= 0 ? 3 : 1;
        if ((" " + t).indexOf(" " + words[i]) >= 0) score += 1;
      }
      return { p: p, s: score };
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s || a.p.t.localeCompare(b.p.t, "tr"); }).slice(0, limit || 12).map(function (x) { return x.p; });
  }
  function catName(id) { var c = (data.categories || []).filter(function (x) { return x.id === id; })[0]; return c ? c.name : ""; }
  function resultsHtml(list, q) {
    if (!q.trim()) return "";
    if (!list.length) return '<p class="bn-empty">“' + esc(q) + '” için yazı bulunamadı. Daha kısa bir kelime dene.</p>';
    return '<ul class="bn-results">' + list.map(function (p) { return '<li><a href="' + esc(p.u) + '"><b>' + esc(p.t) + '</b><small>' + esc(catName(p.c)) + '</small></a></li>'; }).join("") + "</ul>";
  }
  function menuHtml() {
    var here = location.pathname;
    return data.categories.map(function (c) {
      var posts = data.posts.filter(function (p) { return p.c === c.id; });
      if (!posts.length) return "";
      var body;
      if (c.id === "unite") {
        var grades = {};
        posts.forEach(function (p) { (grades[p.g] = grades[p.g] || []).push(p); });
        body = Object.keys(grades).sort(function (a, b) { return a - b; }).map(function (g) {
          return '<details class="bn-sub"><summary>' + g + ". Sınıf <span>" + grades[g].length + "</span></summary><ul>" + grades[g].map(function (p) { return '<li><a href="' + esc(p.u) + '"' + (p.u === here ? ' aria-current="page"' : "") + ">" + p.n + ". Ünite · " + esc(p.t.replace(/^İngilizce\s*\d\.\s*Sınıf\s*\d+\.\s*Ünite\s*/i, "").replace(/\s*Kelime Listesi$/i, "")) + "</a></li>"; }).join("") + "</ul></details>";
        }).join("");
      } else {
        body = "<ul>" + posts.map(function (p) { return '<li><a href="' + esc(p.u) + '"' + (p.u === here ? ' aria-current="page"' : "") + ">" + esc(p.t) + "</a></li>"; }).join("") + "</ul>";
      }
      return '<details class="bn-cat" data-cat="' + c.id + '"><summary>' + esc(c.name) + " <span>" + posts.length + "</span></summary>" + body + "</details>";
    }).join("");
  }

  /* ---- Menü paneli ---- */
  var panel = null, toggle = null;
  function buildPanel() {
    panel = document.createElement("div");
    panel.className = "bn-panel"; panel.id = "bnPanel"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Tüm blog yazıları");
    panel.innerHTML = '<div class="bn-panel-inner"><div class="bn-panel-head"><strong>Tüm yazılar</strong><button type="button" class="bn-close" aria-label="Menüyü kapat">✕</button></div>' +
      '<label class="bn-field"><span class="bn-sr">Blogda ara</span><input type="search" placeholder="Konu ara: past simple, saatler, LGS…" autocomplete="off"></label><div class="bn-panel-results" aria-live="polite"></div>' +
      '<div class="bn-cats"><p class="bn-loading">Yazılar yükleniyor…</p></div><a class="bn-all" href="/blog/">Blog ana sayfası →</a></div>';
    document.body.appendChild(panel);
    var input = panel.querySelector("input"), out = panel.querySelector(".bn-panel-results");
    input.addEventListener("input", function () { load().then(function () { out.innerHTML = resultsHtml(search(input.value, 8), input.value); }); });
    panel.querySelector(".bn-close").addEventListener("click", close);
    panel.addEventListener("click", function (e) { if (e.target === panel) close(); });
  }
  function open(cat) {
    if (!panel) buildPanel();
    panel.hidden = false; document.documentElement.classList.add("bn-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    load().then(function () {
      var box = panel.querySelector(".bn-cats");
      if (!box.dataset.ready) { box.innerHTML = menuHtml(); box.dataset.ready = "1"; }
      var current = box.querySelector('[aria-current="page"]');
      if (cat) { var d = box.querySelector('[data-cat="' + cat + '"]'); if (d) { d.open = true; d.scrollIntoView({ block: "nearest" }); } }
      else if (current) { var p = current.closest("details.bn-sub"); if (p) p.open = true; current.closest("details.bn-cat").open = true; }
    }).catch(function () { panel.querySelector(".bn-cats").innerHTML = '<p class="bn-empty">Yazı listesi şu an yüklenemedi. <a href="/blog/">Blog ana sayfasına git</a>.</p>'; });
    setTimeout(function () { var i = panel.querySelector("input"); if (i && matchMedia("(min-width: 700px)").matches) i.focus(); }, 30);
  }
  function close() {
    if (!panel || panel.hidden) return;
    panel.hidden = true; document.documentElement.classList.remove("bn-open");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  document.addEventListener("click", function (e) {
    if (!panel || panel.hidden) return;
    if (!e.target.closest(".bn-panel-inner") && !e.target.closest(".bn-toggle")) close();
  });

  function addToggle() {
    toggle = document.createElement("button");
    toggle.type = "button"; toggle.className = "bn-toggle";
    toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-controls", "bnPanel");
    toggle.innerHTML = '<span class="bn-icon" aria-hidden="true">☰</span><span class="bn-long">Tüm yazılar</span><span class="bn-short">Yazılar</span><span class="bn-caret" aria-hidden="true">▾</span>';
    toggle.setAttribute("aria-label", "Tüm yazılar");
    toggle.addEventListener("click", function (e) { e.stopPropagation(); if (panel && !panel.hidden) close(); else open(); });
    var links = document.querySelector(".nav .navlinks");
    if (links) { links.insertBefore(toggle, links.firstChild); return; }
    // Ünite sayfalarında üst menü yok: ince bir blog çubuğu ekle.
    var bar = document.createElement("div");
    bar.className = "bn-bar";
    bar.innerHTML = '<a class="bn-brand" href="/">Diji<b>Medu</b></a><a class="bn-bloglink" href="/blog/">Blog</a>';
    bar.appendChild(toggle);
    document.body.insertBefore(bar, document.body.firstChild);
    document.documentElement.classList.add("bn-has-bar");
  }

  /* ---- Blog ana sayfasındaki arama alanı ---- */
  function addHomeSearch() {
    if (!/^\/blog\/?(index\.html)?$/.test(location.pathname)) return;
    var main = document.querySelector("main"); if (!main) return;
    var box = document.createElement("section");
    box.className = "bn-home"; box.setAttribute("aria-label", "Blogda ara");
    box.innerHTML = '<div class="bn-home-head"><span class="bn-eyebrow">BLOGDA ARA</span><h2>Hangi konuyu çalışmak istiyorsun?</h2></div>' +
      '<label class="bn-field bn-field-big"><span class="bn-sr">Blogda ara</span><input type="search" placeholder="Örneğin: present continuous, saatler, 7. sınıf, LGS" autocomplete="off"></label>' +
      '<div class="bn-home-results" aria-live="polite"></div><div class="bn-chips" aria-label="Kategoriler"></div>';
    main.insertBefore(box, main.firstChild);
    var input = box.querySelector("input"), out = box.querySelector(".bn-home-results");
    input.addEventListener("input", function () { load().then(function () { out.innerHTML = resultsHtml(search(input.value, 12), input.value); }); });
    load().then(function () {
      box.querySelector(".bn-chips").innerHTML = data.categories.map(function (c) {
        var n = data.posts.filter(function (p) { return p.c === c.id; }).length;
        return n ? '<button type="button" class="bn-chip" data-cat="' + c.id + '">' + esc(c.name) + " <span>" + n + "</span></button>" : "";
      }).join("");
      box.querySelectorAll(".bn-chip").forEach(function (b) { b.addEventListener("click", function (e) { e.stopPropagation(); open(b.dataset.cat); }); });
    }).catch(function () {});
  }

  function init() { addToggle(); addHomeSearch(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
