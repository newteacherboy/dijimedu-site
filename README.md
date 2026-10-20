# dijimedu-site
## Blog

- Yazılar `blog/<adres>/index.html` altında durur.
- Yeni yazı ekledikten sonra arama ve "Tüm yazılar" menüsünü güncellemek için:
  `python3 tools/build-blog-index.py`
  Bu komut `assets/blog-index.json` dosyasını yeniden oluşturur ve yeni sayfalara menü dosyalarını (`assets/blog-nav.css`, `assets/blog-nav.js`) ekler.
- Kategoriler yazının adresine göre belirlenir (`tools/build-blog-index.py` içindeki `category`).
