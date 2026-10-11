# GANO EV Tembung — Company Profile

Website statis (HTML, CSS, JavaScript) tanpa proses build. Cukup buka `index.html`
dengan Live Server, atau jalankan `python -m http.server` di folder ini.

## Struktur

```
index.html  produk.html  galeri.html  tentang.html  artikel.html  kontak.html
css/style.css          semua gaya
js/order-store.js      penyimpanan pesanan (dipakai semua halaman)
js/app.js              keranjang, modal produk, lightbox, navbar, form kontak
js/effects.js          slider hero, kartu 3D, animasi scroll, partikel
js/gallery.js          filter galeri, nomor seksi, cahaya kartu
js/motion.js           gerak halus dan navigasi foto di lightbox
assets/                gambar dan video (tidak ikut di zip)
```

Urutan script di tiap halaman: `order-store.js`, `app.js`, `effects.js`, `gallery.js`, `motion.js`.

## Folder assets

Folder `assets/` dipakai apa adanya dan tidak termasuk di zip:

- `assets/images/` berisi `products`, `store`, `logo`, `backgrounds`, `articles`
- `assets/icons/favicon.png`
- `assets/video/promo.mp4`

## Mengubah data

- **Nomor WhatsApp**: `WA_NUMBER` di `js/app.js`. Nomor telepon di `kontak.html` juga perlu disamakan.
- **Email**: `EMAIL` di `js/app.js` dan tautan email di `kontak.html`.
- **Harga** (masih sementara): `price` di `js/app.js`, lalu teks "Rp ..." di `index.html` dan `produk.html`.
- **Alamat dan jam buka**: bagian footer di setiap halaman dan `kontak.html`.
- **Teks produk**: `desc` di `js/app.js` (untuk keranjang dan detail) dan kartu produk di `index.html` / `produk.html`.

Navbar, footer, keranjang, dan modal produk ditulis di setiap halaman. Kalau mengubahnya,
ubah di keenam file HTML.

## Format kode

Indentasi dua spasi, LF, UTF-8. Aturan editor ada di `.editorconfig`.
