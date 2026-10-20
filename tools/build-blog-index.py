# -*- coding: utf-8 -*-
"""Build assets/blog-index.json for the blog search box and the "Tüm yazılar" menu,
and make sure every blog page loads blog-nav.css / blog-nav.js.

Run from the repository root after adding or renaming a post:
    python3 tools/build-blog-index.py
Categories come from the post address (slug), so the menu stays tidy even when
eyebrow labels differ between templates.
"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TAGS = '<link rel="stylesheet" href="/assets/blog-nav.css"><script defer src="/assets/blog-nav.js"></script>'

CATEGORIES = [
    ("dilbilgisi", "Dil Bilgisi"),
    ("gunluk", "Günlük İngilizce ve Kelimeler"),
    ("konusma", "Konuşma ve Diyaloglar"),
    ("okuma", "Okuma ve Yazma"),
    ("seviye", "Seviyeler (A1–B2)"),
    ("lgs", "LGS ve 8. Sınıf"),
    ("ortaokul", "Ortaokul İngilizce"),
    ("yontem", "Çalışma Yöntemleri"),
    ("veli", "Veliler ve Öğretmenler"),
    ("unite", "Sınıf ve Ünite Rehberleri"),
]
GRAMMAR = ("tense", "fiiller", "comparatives", "there-is", "edatlari", "much-many", "can-cant", "soru-kelimeleri",
           "a-an-the", "was-were", "and-but", "sayilabilen", "will-going", "simple-present")
SPEAKING = ("diyalog", "konusma", "tanisma", "tanitma", "telefon", "alisveris", "siparis", "davet", "yol-tarifi", "fotograf-anlatma")
READ_WRITE = ("okuma", "hikaye", "paragraf", "yazma", "eposta", "ana-fikir", "baglamdan", "not-except")
DAILY = ("saatler", "gunler", "sayilar", "kelime", "hava-durumu", "duygular", "meslekler", "aile", "hobiler", "benzer-yazilan")
TEACH = ("cocuklara", "veli", "sinifta", "farkli-seviyelere", "ekransiz")

def category(slug):
    if re.match(r"ingilizce-\d-sinif-\d+-unite", slug): return "unite"
    if slug.startswith("lgs-") or slug.startswith("8-sinif"): return "lgs"
    if slug.startswith("ortaokul-") or re.match(r"[5-7]-sinif", slug) or slug.startswith("meb-"): return "ortaokul"
    if any(k in slug for k in GRAMMAR): return "dilbilgisi"
    if any(k in slug for k in TEACH): return "veli"
    if any(k in slug for k in SPEAKING): return "konusma"
    if any(k in slug for k in READ_WRITE): return "okuma"
    if any(k in slug for k in DAILY): return "gunluk"
    if re.match(r"(a1|a2|b1|b2)-", slug) or "seviye" in slug: return "seviye"
    return "yontem"

def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()

def main():
    posts = []
    for path in sorted(glob.glob(os.path.join(ROOT, "blog", "*", "index.html"))):
        slug = os.path.basename(os.path.dirname(path))
        s = open(path, encoding="utf-8").read()
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S)
        title = text(h1.group(1)) if h1 else text(re.search(r"<title>(.*?)</title>", s, re.S).group(1)).split(" | ")[0]
        desc = re.search(r'<meta name="description" content="([^"]*)"', s)
        item = {"u": "/blog/%s/" % slug, "t": title, "d": html.unescape(desc.group(1)) if desc else "", "c": category(slug)}
        unit = re.match(r"ingilizce-(\d)-sinif-(\d+)-unite", slug)
        if unit: item["g"], item["n"] = int(unit.group(1)), int(unit.group(2))
        posts.append(item)
        if "/assets/blog-nav.js" not in s:
            s = s.replace("</head>", TAGS + "</head>", 1)
            open(path, "w", encoding="utf-8").write(s)
    index = os.path.join(ROOT, "blog", "index.html")
    s = open(index, encoding="utf-8").read()
    if "/assets/blog-nav.js" not in s:
        open(index, "w", encoding="utf-8").write(s.replace("</head>", TAGS + "</head>", 1))
    posts.sort(key=lambda p: (p.get("g", 0), p.get("n", 0), p["t"]))
    data = {"categories": [{"id": i, "name": n} for i, n in CATEGORIES], "posts": posts}
    with open(os.path.join(ROOT, "assets", "blog-index.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    counts = {n: sum(p["c"] == i for p in posts) for i, n in CATEGORIES}
    print(len(posts), "posts", counts)

if __name__ == "__main__":
    main()
