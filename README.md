# A Little Campus Story — website

Landing page ringan dengan ilustrasi dan ikon dari proyek Unity. Seluruh file website ada dalam folder ini; file game tidak perlu diunggah ke Vercel.

## Tautan unduhan dan cerita

Isi `apk` dan `story` di `dist/config.js` dengan tautan HTTPS yang sudah bisa dibuka pengunjung. Tautan kosong menampilkan informasi “Segera hadir” saat tombol ditekan. Tidak ada tautan contoh yang menyamar sebagai unduhan nyata.

Untuk APK di Google Drive, bagikan file APK dengan akses **Anyone with the link / Siapa saja yang memiliki link**, peran **Viewer / Pembaca**, dan pastikan pengunduhan diperbolehkan. Gunakan tautan berbagi file; tidak perlu memasukkan akun atau kredensial ke website.

## Vercel

1. Jadikan folder `A Little Campus Story Website` ini repository tersendiri, lalu impor repository tersebut ke Vercel. Jangan mengunggah keseluruhan proyek Unity.
2. Framework: **Other**. Build Command dan Install Command: kosong. Output Directory: **dist**. Pengaturan juga tersedia di `vercel.json`.
3. Deploy. Jika memakai repository tersendiri, gunakan root repository sebagai Root Directory.

Sumber lokal belum berisi tautan APK dan cerita. Tambahkan tautan saat berkas siap; status versi online perlu diperiksa pada URL deployment yang digunakan.

## Preview lokal

Buka `preview.html` di browser untuk melihat layout tanpa server: salinan mandiri ini memuat gambar, gaya, dan interaksi dalam satu file. File untuk deployment tetap berada di `dist`; setelah mengubah source, preview mandiri perlu diperbarui.

Alternatifnya, jalankan static server dari folder `dist` atau buka `dist/index.html` langsung di browser. Tidak perlu plugin VS Code maupun package tambahan.

## Aset

- `campus.webp`: salinan terkompresi frame 240 dari `Assets/FrameTItle`.
- `map.webp` dan `notes.webp`: salinan ikon Map dan ToDoLIst dari `Assets/All Asset/AssetSkripsi/Phone`.
- `gameplay.webp`: screenshot gameplay yang diberikan pengguna dalam percakapan.

Aset asli Unity tetap tidak diubah. Versi web diperkecil agar halaman ringan. Gambar dibuat oleh pemilik proyek atau disediakan dalam proyek; pertahankan atribusi yang terlihat pada ilustrasi.

## Pengamanan website

`vercel.json` mengirim CSP yang membatasi skrip, CSS, dan gambar ke origin sendiri; melarang skrip inline, iframe, plugin, koneksi API, dan penyisipan halaman melalui frame. Splash screen memakai `dist/intro.js` agar tetap berjalan dengan kebijakan ini. Header tambahan membatasi akses kamera/mikrofon/lokasi dan menetapkan HTTPS serta perlindungan tipe konten.

URL akses harus HTTPS, tanpa username/password di URL, karakter kontrol, atau panjang berlebihan. Tab eksternal memakai `noopener noreferrer`. Pesan ditulis melalui `textContent`. HTTPS tidak membuktikan suatu situs tujuan tepercaya: isi config hanya dengan tautan milik pengembang yang sudah diperiksa.

File website bersifat publik. Jangan memasukkan token, kata sandi, private key, signing key Android, data responden, atau proyek Unity ke `dist` maupun repository. `.gitignore` membantu mencegah berkas rahasia baru ikut ditambahkan, tetapi tidak menghapus rahasia yang sudah pernah diunggah.

Pengamanan ini baru berlaku online setelah perubahan dikirim ke GitHub dan deployment Vercel selesai. Pastikan Output Directory tetap `dist`. Preview lokal tanpa header tidak membuktikan header produksi sudah aktif. `preview.html` merupakan salinan layout lama, bukan hasil uji keamanan; gunakan server dari `dist` untuk memeriksa versi terbaru.

Saat APK tersedia, bagikan file rilis yang ditandatangani, peran Viewer di Google Drive, nomor versi, dan SHA-256 berkas final. Sertifikat penandatanganan privat tidak boleh dibagikan. Website ini tidak memindai atau menjamin keamanan APK; pemeriksaan APK dilakukan secara terpisah terhadap berkas rilis aktual.

Rujukan konfigurasi: https://vercel.com/docs/project-configuration/vercel-json#headers
Rujukan CSP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
