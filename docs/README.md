# Dokumentasi Fitur Asetku

Dokumentasi ini merangkum fitur produk dan fitur admin operasional yang **saat ini sudah berjalan** di sistem Asetku.

## Tujuan

Dokumentasi ini dibuat untuk:
- onboarding tim produk, operasional, dan admin internal
- referensi cepat mengenai kapabilitas sistem yang sudah tersedia
- menyelaraskan pemahaman antara fitur yang berjalan dan cerita pengguna yang didukung

## Struktur

- `docs/features.md` berisi dokumentasi fitur sistem secara utuh dan menyeluruh dalam satu file
- `docs/user-stories.md` berisi dokumentasi cerita pengguna secara utuh dan menyeluruh dalam satu file
- `docs/technical-operations-manual.md` berisi manual operasional teknis untuk tim operasional
- `docs/depreciation.md` berisi dokumentasi implementasi penyusutan aset yang berjalan saat ini

## Dokumen Utama

### Fitur Sistem
- [Dokumentasi Fitur Sistem Asetku](features.md)

### Cerita Pengguna
- [Dokumentasi Cerita Pengguna Asetku](user-stories.md)

### Manual Operasional
- [Manual Operasional Teknis Asetku](technical-operations-manual.md)

### Penyusutan Aset
- [Dokumentasi Penyusutan Aset](depreciation.md)

## Catatan Penyusunan

- Dokumentasi mengikuti implementasi aktual yang ditemukan dari route, controller, dan halaman Inertia aktif.
- Istilah role utama yang dipakai sistem adalah `Owner`, `Admin`, `Manager`, dan `Member`.
- Label UI “Staff” diperlakukan sebagai label tampilan untuk role `Member` bila relevan.
- Fitur developer experience, generator, husky, IDE helper, dan workflow coding tidak dimasukkan sebagai fitur produk.
