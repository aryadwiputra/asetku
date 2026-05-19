# Dokumentasi Fitur Sistem Asetku

Dokumen ini menggabungkan seluruh dokumentasi fitur yang saat ini tersedia di sistem Asetku ke dalam satu file utuh, lengkap, dan menyeluruh.

## Tujuan Dokumen

Dokumen ini ditujukan untuk:
- tim operasional
- admin aplikasi
- tim produk internal
- pihak internal yang membutuhkan pemahaman menyeluruh atas fitur sistem

## Cakupan

Dokumen ini mencakup fitur produk dan fitur admin operasional yang benar-benar berjalan saat ini, berdasarkan implementasi aktif pada aplikasi.

## Cara Membaca

- Gunakan daftar isi untuk menuju modul tertentu.
- Setiap modul menjelaskan ringkasan, tujuan bisnis, aktor, hak akses, halaman utama, kemampuan utama, batasan, dan dependensi.
- Istilah role utama yang dipakai sistem adalah `Owner`, `Admin`, `Manager`, dan `Member`.

## Daftar Isi
- [Akun & Profil](#akun-dan-profil)
- [Aktivitas & Monitoring Pengguna](#aktivitas-dan-monitoring-pengguna)
- [Pengaturan Aplikasi](#pengaturan-aplikasi)
- [Lampiran Aset](#lampiran-aset)
- [Detail & Aksi Aset](#detail-dan-aksi-aset)
- [Label & Ekspor Aset](#label-dan-ekspor-aset)
- [Mutasi & Peristiwa Aset](#mutasi-dan-peristiwa-aset)
- [Registri Aset](#registri-aset)
- [Operasi Status & Kondisi Aset](#operasi-status-dan-kondisi-aset)
- [Temuan Audit](#temuan-audit)
- [Jadwal Audit](#jadwal-audit)
- [Autentikasi](#autentikasi)
- [Cabang](#cabang)
- [Depresiasi](#depresiasi)
- [Disposal / Penghapusan Aset](#disposal-penghapusan-aset)
- [Pengiriman Notifikasi Email](#pengiriman-notifikasi-email)
- [Flag Fitur](#flag-fitur)
- [Laporan Inventaris](#laporan-inventaris)
- [Pengaturan Email](#pengaturan-email)
- [Kalender Maintenance & Checklist](#kalender-maintenance-dan-checklist)
- [Laporan Maintenance](#laporan-maintenance)
- [Jadwal Maintenance](#jadwal-maintenance)
- [Master Data Operasional Aset](#master-data-operasional-aset)
- [Master Data Struktural Aset](#master-data-struktural-aset)
- [Unggah Media](#unggah-media)
- [Konteks Penggunaan Media](#konteks-penggunaan-media)
- [Pusat Notifikasi](#pusat-notifikasi)
- [Preferensi Notifikasi](#preferensi-notifikasi)
- [Administrasi Organisasi](#administrasi-organisasi)
- [Keanggotaan & Perpindahan Organisasi](#keanggotaan-dan-perpindahan-organisasi)
- [Onboarding Organisasi](#pengaturan awal-organisasi)
- [Halaman Publik QR Aset](#halaman-publik-qr-aset)
- [Pemindaian QR](#pemindaian-qr)
- [Manajemen Izin Akses](#manajemen-izin-akses)
- [SSO, Delegasi, & Impersonation](#sso-delegasi-dan-impersonation)
- [Manajemen Akses Pengguna](#manajemen-akses-pengguna)
- [Kontrak Vendor](#kontrak-vendor)
- [Garansi & Klaim](#garansi-dan-klaim)
- [Lampiran Perintah Kerja](#lampiran-perintah-kerja)
- [Eksekusi Perintah Kerja](#eksekusi-perintah-kerja)
- [Tugas & Biaya Perintah Kerja](#tugas-dan-biaya-perintah-kerja)
- [Perintah Kerja](#perintah-kerja)

## Akun & Profil


### Ringkasan Fitur
Modul ini berfokus pada identitas pengguna setelah login, termasuk profil, preferensi notifikasi, penerimaan undangan, dan pengelolaan konteks akun yang relevan untuk operasional harian.

### Tujuan Bisnis
- memberi pengguna kontrol atas data profil dan preferensi personal
- mendukung pengaturan awal akun dari undangan
- menjaga pengalaman pengguna tetap konsisten di dalam aplikasi

### Aktor yang Terlibat
- pengguna terdaftar
- pengguna yang menerima undangan
- admin yang mengundang pengguna

### Hak Akses / Role yang Relevan
- pengguna login untuk profil dan preferensi sendiri
- pengguna tamu untuk menerima undangan valid

### Halaman Utama
- profil
- invitation acceptance
- perbarui preferensi notifikasi

### Kemampuan Utama yang Sudah Tersedia
- menerima undangan pengguna ke sistem/organisasi
- melihat dan memperbarui area profil pengguna
- mengatur preferensi notifikasi pribadi
- menyimpan preferensi yang dipakai modul notifikasi

### Batasan atau Catatan Perilaku Penting
- preferensi notifikasi bersifat per pengguna
- penerimaan undangan bergantung pada token undangan yang masih valid

### Dependensi ke Fitur Lain
- autentikasi
- notifikasi
- organisasi


---

## Aktivitas & Monitoring Pengguna


### Ringkasan Fitur
Modul ini menyediakan visibilitas aktivitas aplikasi yang berorientasi pengguna, termasuk halaman log aktivitas dan elemen monitoring yang relevan bagi admin operasional.

### Tujuan Bisnis
- membantu admin meninjau aktivitas penting dalam aplikasi
- mendukung audit operasional dan troubleshooting penggunaan harian
- meningkatkan transparansi perubahan pada data penting

### Aktor yang Terlibat
- `Owner`
- `Admin`
- auditor/peninjau internal yang diberi akses

### Hak Akses / Role yang Relevan
- `activity.view`
- permission lain yang diperlukan untuk membuka konteks data terkait

### Halaman Utama
- indeks log aktivitas
- riwayat pada detail aset
- notifikasi/polling yang bersifat monitoring pengguna

### Kemampuan Utama yang Sudah Tersedia
- melihat halaman log aktivitas
- melihat riwayat perubahan pada aset dan modul tertentu
- memantau notifikasi serta event berorientasi pengguna yang muncul di aplikasi
- mendukung audit trail pada perubahan operasional yang penting

### Batasan atau Catatan Perilaku Penting
- modul ini tidak dimaksudkan sebagai observabilitas teknis penuh seperti alat developer
- fokusnya adalah monitoring yang berguna untuk admin operasional dan peninjau internal

### Dependensi ke Fitur Lain
- manajemen aset
- notifikasi
- audit
- RBAC & access policy


---

## Pengaturan Aplikasi


### Ringkasan Fitur
Modul ini mengelola pengaturan umum aplikasi yang memengaruhi perilaku dasar sistem.

### Tujuan Bisnis
- memberi admin cara terpusat untuk mengelola konfigurasi dasar aplikasi
- menjaga identitas dan perilaku umum sistem tetap sesuai kebutuhan organisasi

### Aktor yang Terlibat
- `Owner`
- `Admin`
- admin yang punya izin pengaturan aplikasi

### Hak Akses / Role yang Relevan
- `settings.app.manage`

### Halaman Utama
- pengaturan aplikasi
- indeks pengaturan

### Kemampuan Utama yang Sudah Tersedia
- melihat area pengaturan umum
- memperbarui konfigurasi aplikasi yang diekspos pada UI pengaturan

### Batasan atau Catatan Perilaku Penting
- perubahan pengaturan tertentu dapat berdampak langsung pada perilaku aplikasi

### Dependensi ke Fitur Lain
- organisasi
- autentikasi


---

## Lampiran Aset


### Ringkasan Fitur
Modul ini khusus mengelola foto dan dokumen yang melekat pada aset.

### Tujuan Bisnis
- memperkaya data aset dengan bukti visual dan dokumen pendukung
- memudahkan pemeriksaan kondisi dan administrasi aset dari halaman aset itu sendiri

### Aktor yang Terlibat
- admin aset
- operator lapangan
- pengguna berwenang yang mengelola aset

### Hak Akses / Role yang Relevan
- `media.manage`
- `asset.update` atau hak setara pada modul aset

## Halaman / Halaman Utama
- area lampiran pada detail aset

### Kemampuan Utama yang Sudah Tersedia
- unggah foto aset
- unggah dokumen aset
- menampilkan lampiran langsung pada konteks aset
- menghapus lampiran dari aset

### Batasan atau Catatan Perilaku Penting
- modul ini hanya membahas lampiran pada aset
- mekanisme unggah file lintas modul didokumentasikan terpisah pada modul `Unggah Media`
- konteks pemakaian media lintas modul didokumentasikan terpisah pada modul `Konteks Penggunaan Media`

### Dependensi ke Fitur Lain
- detail & aksi aset
- unggah media


---

## Detail & Aksi Aset


### Ringkasan Fitur
Modul ini menangani halaman detail aset dan aksi cepat yang dilakukan langsung dari detail aset.

### Tujuan Bisnis
- memberi satu tampilan lengkap untuk memahami kondisi dan konteks aset
- mempercepat aksi operasional tanpa harus membuka banyak halaman lain

### Aktor yang Terlibat
- `Owner`
- `Admin`
- `Manager`
- `Member` yang memiliki visibilitas aset

### Hak Akses / Role yang Relevan
- `asset.view`
- `asset.perbarui`
- `asset.hapus`

### Halaman Utama
- detail aset

### Kemampuan Utama yang Sudah Tersedia
- menampilkan detail lengkap aset
- menampilkan riwayat, lampiran, QR, garansi, maintenance, dan konteks finansial
- aksi cepat seperti ubah, ubah status, salin tautan QR, buka QR, cetak label, dan regenerasi token QR
- membuka alur terkait dari aset yang sedang dilihat

### Batasan atau Catatan Perilaku Penting
- beberapa aksi hanya muncul untuk pengguna yang punya izin yang sesuai
- sebagian perubahan memunculkan riwayat/jejak audit

### Dependensi ke Fitur Lain
- registri aset
- asset labels & ekspor
- lampiran aset
- siklus hidup aset


---

## Label & Ekspor Aset


### Ringkasan Fitur
Modul ini menangani pencetakan label aset dan ekspor data aset dari modul inventaris.

### Tujuan Bisnis
- memudahkan identifikasi fisik aset
- mendukung kebutuhan distribusi data inventaris ke luar layar aplikasi

### Aktor yang Terlibat
- admin aset
- operator inventaris
- supervisor operasional

### Hak Akses / Role yang Relevan
- `asset.ekspor`
- `asset_label.view` dan akses terkait label/print sesuai permission efektif

### Halaman Utama
- print labels
- asset ekspor

### Kemampuan Utama yang Sudah Tersedia
- mencetak label aset
- membuka QR untuk kebutuhan label
- mengekspor data aset melalui endpoint ekspor yang tersedia

### Batasan atau Catatan Perilaku Penting
- hasil ekspor dan label mengikuti data aset yang tersedia saat ini
- format output mengikuti implementasi modul yang aktif sekarang

### Dependensi ke Fitur Lain
- registri aset
- halaman publik QR aset


---

## Mutasi & Peristiwa Aset


### Ringkasan Fitur
Modul ini menangani pergerakan aset seperti transfer, peminjaman, pengembalian, dan peristiwa siklus hidup lain yang tidak sebatas perubahan status/kondisi.

### Tujuan Bisnis
- mendokumentasikan perpindahan dan aktivitas operasional aset
- menjaga audit trail perjalanan aset di lapangan

### Aktor yang Terlibat
- operator aset
- admin operasional
- supervisor aset

### Hak Akses / Role yang Relevan
- permission lihat aset
- izin perbarui aset atau siklus hidup terkait

### Halaman Utama
- halaman siklus hidup aset
- alur pergerakan dari detail aset atau halaman siklus hidup aset
- pencarian berbasis token ke alur siklus hidup

### Kemampuan Utama yang Sudah Tersedia
- mencari aset untuk proses siklus hidup
- memindai token aset untuk membuka alur siklus hidup
- mencatat transfer, peminjaman, pengembalian, dan penempatan sesuai alur yang tersedia
- mencatat peristiwa siklus hidup tertentu
- melihat linimasa/riwayat aset

### Batasan atau Catatan Perilaku Penting
- pergerakan dan event berfokus pada aktivitas operasional, bukan pengeditan master data aset penuh

### Dependensi ke Fitur Lain
- pemindaian QR
- registri aset
- activity & monitoring pengguna


---

## Registri Aset


### Ringkasan Fitur
Modul ini berfokus pada pencatatan, daftar, pencarian, filter, tambah, ubah, dan penghapusan aset dalam organisasi aktif.

### Tujuan Bisnis
- menjaga inventaris aset tetap terdaftar dan mudah ditemukan
- menyediakan titik masuk utama untuk administrasi data aset

### Aktor yang Terlibat
- `Owner`
- `Admin`
- `Manager`
- `Member` untuk akses lihat sesuai cakupan

### Hak Akses / Role yang Relevan
- `asset.view`
- `asset.tambah`
- `asset.perbarui`
- `asset.hapus`
- `asset.ekspor`

### Halaman Utama
- indeks aset
- tambah aset
- ubah aset

### Kemampuan Utama yang Sudah Tersedia
- membuat aset baru
- mengubah data aset
- menghapus aset sesuai hak akses
- mencari dan memfilter aset
- menyimpan preferensi/filter tampilan tertentu
- generate otomatis kode dan QR token bila diperlukan

### Batasan atau Catatan Perilaku Penting
- visibilitas aset mengikuti organisasi aktif dan cakupan pengguna
- akurasi data bergantung pada master data dan relasi referensi yang benar

### Dependensi ke Fitur Lain
- master data struktural aset
- master data operasional aset
- detail aset & actions


---

## Operasi Status & Kondisi Aset


### Ringkasan Fitur
Modul ini menangani perubahan status dan kondisi aset sebagai bagian dari operasi siklus hidup harian.

### Tujuan Bisnis
- memastikan status dan kondisi aset selalu mencerminkan keadaan aktual
- menjaga perubahan status/kondisi tetap terkontrol dan tercatat

### Aktor yang Terlibat
- operator aset
- admin aset
- supervisor operasional

### Hak Akses / Role yang Relevan
- permission lihat aset
- izin perbarui aset atau siklus hidup terkait

### Halaman Utama
- halaman siklus hidup aset
- perubahan cepat status dari detail aset
- memperbarui kondisi dari alur siklus hidup

### Kemampuan Utama yang Sudah Tersedia
- mengubah status aset
- mengubah kondisi aset
- menerapkan aturan transisi status yang tersedia
- mencatat perubahan status dan kondisi ke riwayat terkait

### Batasan atau Catatan Perilaku Penting
- tidak semua transisi status diizinkan
- perubahan mengikuti permission dan aturan transisi sistem

### Dependensi ke Fitur Lain
- detail aset & actions
- master data struktural aset
- activity & monitoring pengguna


---

## Temuan Audit


### Ringkasan Fitur
Modul ini menangani pencatatan temuan audit yang relevan terhadap konteks audit atau aset.

### Tujuan Bisnis
- mendokumentasikan temuan audit agar tidak hilang dan dapat ditindaklanjuti
- menghubungkan hasil audit ke konteks operasional yang relevan

### Aktor yang Terlibat
- auditor internal
- peninjau audit yang berwenang

### Hak Akses / Role yang Relevan
- gate/permission audit finding yang aktif pada sistem

### Halaman Utama
- tambah audit finding

### Kemampuan Utama yang Sudah Tersedia
- membuat audit finding
- mengaitkan temuan audit ke konteks audit/aset yang relevan sesuai alur yang tersedia

### Batasan atau Catatan Perilaku Penting
- modul finding yang terlihat saat ini berfokus pada pencatatan temuan, bukan seluruh siklus follow-up audit

### Dependensi ke Fitur Lain
- jadwal audit
- notifikasi
- activity & monitoring pengguna


---

## Jadwal Audit


### Ringkasan Fitur
Modul ini mengelola perencanaan dan peninjauan jadwal audit.

### Tujuan Bisnis
- menstrukturkan aktivitas audit agar dapat direncanakan dan dipantau
- memberi visibilitas atas audit yang akan atau sedang berjalan

### Aktor yang Terlibat
- auditor internal
- admin operasional
- pengguna berwenang pada modul audit

### Hak Akses / Role yang Relevan
- gate/permission audit schedule yang aktif pada sistem

### Halaman Utama
- jadwal audit index
- tambah audit schedule
- ubah audit schedule
- detail audit schedule

### Kemampuan Utama yang Sudah Tersedia
- membuat jadwal audit
- memperbarui jadwal audit
- melihat detail jadwal audit
- meninjau daftar audit yang tersedia

### Batasan atau Catatan Perilaku Penting
- cakupan audit schedule mengikuti implementasi audit yang tersedia saat ini

### Dependensi ke Fitur Lain
- activity & monitoring pengguna
- notifikasi


---

## Autentikasi


### Ringkasan Fitur
Modul ini menangani login, registrasi bila diaktifkan, verifikasi email, reset password, dan challenge two-factor sebagai inti akses masuk ke aplikasi.

### Tujuan Bisnis
- memastikan akses aplikasi hanya diberikan ke pengguna yang sah
- menyediakan alur masuk dan pemulihan akses yang dapat dipakai pengguna sehari-hari
- meningkatkan keamanan akun melalui verifikasi dan challenge tambahan

### Aktor yang Terlibat
- pengguna baru
- pengguna terdaftar
- pengguna yang perlu memulihkan akses akun

### Hak Akses / Role yang Relevan
- pengguna tamu untuk login, registrasi, lupa password, dan reset password
- pengguna terautentikasi untuk verifikasi lanjutan dan challenge keamanan

### Halaman Utama
- login
- register
- forgot password
- reset password
- verify email
- two-factor challenge

### Kemampuan Utama yang Sudah Tersedia
- login dengan kredensial aplikasi
- registrasi akun saat fitur registrasi aktif
- verifikasi email sebelum akses penuh ke area terproteksi
- reset password melalui alur lupa password
- challenge 2FA saat fitur keamanan tambahan aktif

### Batasan atau Catatan Perilaku Penting
- sebagian besar area aplikasi memakai middleware `auth` dan `verified`
- fitur tertentu baru bisa dipakai penuh setelah email terverifikasi
- challenge tambahan bergantung pada status keamanan akun pengguna

### Dependensi ke Fitur Lain
- akun & profil
- notifikasi
- settings


---

## Cabang


### Ringkasan Fitur
Modul ini mengelola cabang sebagai unit operasional di dalam organisasi dan menjadi referensi penting untuk aset, departemen, dan aktivitas lapangan.

### Tujuan Bisnis
- menyusun struktur operasional organisasi secara lebih rinci
- menjadi referensi lokasi organisasi untuk aset dan operasional

### Aktor yang Terlibat
- admin organisasi
- pengguna berwenang yang mengelola struktur cabang

### Hak Akses / Role yang Relevan
- permission branch view/tambah/perbarui/hapus
- role organisasi yang memiliki hak kelola cabang

### Halaman Utama
- branches index
- tambah branch
- ubah branch
- detail branch

### Kemampuan Utama yang Sudah Tersedia
- kelola cabang
- melihat detail cabang
- memakai data cabang sebagai referensi untuk modul lain

### Batasan atau Catatan Perilaku Penting
- cabang bersifat organization-scoped
- perubahan cabang dapat berdampak pada data turunan seperti departemen dan aset

### Dependensi ke Fitur Lain
- organisasi
- master data aset
- manajemen aset


---

## Depresiasi


### Ringkasan Fitur
Modul ini menyediakan pengelolaan dan pelaporan nilai depresiasi aset, termasuk daftar run depresiasi dan detail depresiasi per aset.

### Tujuan Bisnis
- membantu pelacakan nilai buku aset dari sisi keuangan
- menyediakan visibilitas atas metode dan hasil depresiasi aset
- mendukung kebutuhan review dan audit internal

### Aktor yang Terlibat
- admin aset
- finance/admin operasional
- pengguna yang diberi akses lihat depresiasi

### Hak Akses / Role yang Relevan
- permission depresiasi aset
- permission lihat aset terkait

### Halaman Utama
- halaman daftar depresiasi
- detail depresiasi per aset
- ekspor depresiasi tertentu
- trigger run depresiasi

### Kemampuan Utama yang Sudah Tersedia
- melihat daftar run atau data depresiasi
- melihat detail depresiasi per aset
- menampilkan nilai buku dan komponen depresiasi terkait
- menjalankan proses depresiasi melalui endpoint yang tersedia
- mengekspor hasil depresiasi tertentu

### Batasan atau Catatan Perilaku Penting
- akurasi depresiasi bergantung pada kelengkapan data aset dan metode yang dipilih
- depresiasi adalah modul keuangan/operasional, bukan pengganti pencatatan akuntansi eksternal

### Dependensi ke Fitur Lain
- manajemen aset
- master data aset
- reports


---

## Disposal / Penghapusan Aset


### Ringkasan Fitur
Modul ini menangani permintaan penghapusan aset, approval disposal, akses berbasis token untuk memulai disposal, dan dokumen berita acara disposal.

### Tujuan Bisnis
- memastikan proses penghapusan aset tercatat dan terkontrol
- memisahkan disposal dari penghapusan data biasa
- menjaga jejak audit untuk aset yang keluar dari siklus aktif

### Aktor yang Terlibat
- pemohon disposal
- approver disposal
- admin/owner organisasi

### Hak Akses / Role yang Relevan
- permission tambah disposal
- permission view disposal
- permission approve/reject disposal sesuai kebijakan sistem
- akses aset tetap mengikuti cakupan organisasi dan permission asset

### Halaman Utama
- daftar disposal
- tambah disposal
- detail disposal
- disposal berbasis token
- berita acara disposal

### Kemampuan Utama yang Sudah Tersedia
- membuat permintaan disposal untuk aset
- membuka tambah disposal dari token aset
- melihat detail disposal
- proses approve atau reject disposal
- menghasilkan berita acara disposal

### Batasan atau Catatan Perilaku Penting
- disposal adalah workflow bisnis, bukan sekadar hapus record
- aset yang sudah masuk alur disposal mengikuti status dan catatan disposal yang relevan
- akses approval dibatasi oleh otorisasi

### Dependensi ke Fitur Lain
- manajemen aset
- QR publik & scan
- siklus aset


---

## Pengiriman Notifikasi Email


### Ringkasan Fitur
Modul ini membahas bagaimana sistem mengirim notifikasi melalui email untuk peristiwa penting.

### Tujuan Bisnis
- memastikan peristiwa penting dapat menjangkau pengguna melalui email
- menjaga format email sistem tetap konsisten dan siap dipakai operasional

### Aktor yang Terlibat
- pengguna penerima notifikasi
- admin yang mengonfigurasi email sistem secara tidak langsung

### Hak Akses / Role yang Relevan
- bergantung pada event sumber notifikasi
- konfigurasi email dikelola melalui modul pengaturan email

## Halaman / Halaman Utama
- tidak selalu memiliki halaman operasional tersendiri; bekerja melalui event modul sumber dan pengaturan email

### Kemampuan Utama yang Sudah Tersedia
- mengirim email untuk peristiwa penting yang relevan
- memanfaatkan antrean untuk notifikasi tertentu
- menggunakan template email bermerek
- mendukung pengiriman test email dari pengaturan email

### Batasan atau Catatan Perilaku Penting
- modul ini fokus pada **pengiriman email**, bukan inbox notifikasi di aplikasi
- keberhasilan pengiriman bergantung pada konfigurasi email yang benar

### Dependensi ke Fitur Lain
- pengaturan email
- pusat notifikasi
- perintah kerja
- audit


---

## Flag Fitur


### Ringkasan Fitur
Modul ini mengelola flag fitur yang diekspos kepada admin melalui halaman pengaturan.

### Tujuan Bisnis
- memberi kontrol administratif atas aktivasi fitur tertentu
- membantu pengelolaan perilaku sistem tanpa perubahan data transaksi langsung

### Aktor yang Terlibat
- admin sistem/organisasi yang berwenang

### Hak Akses / Role yang Relevan
- `settings.flags.manage`

### Halaman Utama
- pengaturan fitur

### Kemampuan Utama yang Sudah Tersedia
- melihat daftar flag fitur yang tersedia di UI pengaturan
- memperbarui status flag sesuai pengaturan yang didukung

### Batasan atau Catatan Perilaku Penting
- feature flag bersifat administratif dan tidak otomatis berarti semua pengguna dapat langsung memakai semua perilaku terkait

### Dependensi ke Fitur Lain
- pengaturan aplikasi


---

## Laporan Inventaris


### Ringkasan Fitur
Modul ini menyediakan laporan inventory dan stocktake print untuk kebutuhan pemantauan inventaris aset.

### Tujuan Bisnis
- memberi gambaran kondisi inventaris yang dapat dianalisis oleh admin dan manajemen
- mendukung proses stocktake operasional

### Aktor yang Terlibat
- admin operasional
- manajemen
- supervisor yang memiliki akses laporan inventaris

### Hak Akses / Role yang Relevan
- `viewInventoryReport`
- permission ekspor/report inventory yang relevan

### Halaman Utama
- laporan inventaris
- stocktake print

### Kemampuan Utama yang Sudah Tersedia
- melihat laporan inventaris
- memfilter hasil sesuai tampilan yang tersedia
- membuka stocktake print untuk kebutuhan lapangan

### Batasan atau Catatan Perilaku Penting
- hasil laporan mengikuti organisasi aktif dan data inventaris yang tersedia

### Dependensi ke Fitur Lain
- manajemen aset
- master data aset


---

## Pengaturan Email


### Ringkasan Fitur
Modul ini mengelola konfigurasi email sistem dan kemampuan test email.

### Tujuan Bisnis
- memastikan email operasional sistem dapat dikonfigurasi dan diuji dari aplikasi
- mendukung pengiriman notifikasi email yang andal

### Aktor yang Terlibat
- admin sistem/organisasi yang berwenang

### Hak Akses / Role yang Relevan
- `settings.mail.manage`

### Halaman Utama
- pengaturan email

### Kemampuan Utama yang Sudah Tersedia
- memperbarui konfigurasi mail
- mengirim test email
- menjadi fondasi pengiriman email operasional

### Batasan atau Catatan Perilaku Penting
- test email bukan jaminan semua notifikasi bisnis akan berjalan bila event sumber tidak terpenuhi
- konfigurasi mail yang salah akan mengganggu notifikasi email

### Dependensi ke Fitur Lain
- pengiriman notifikasi email
- notifikasi


---

## Kalender Maintenance & Checklist


### Ringkasan Fitur
Modul ini menangani tampilan kalender maintenance, reschedule jadwal, feed kalender, dan checklist template yang dipakai proses maintenance.

### Tujuan Bisnis
- memberi visibilitas atas jadwal maintenance dalam tampilan kalender
- mendukung persiapan dan standarisasi pekerjaan maintenance melalui checklist

### Aktor yang Terlibat
- paketner maintenance
- supervisor maintenance
- admin maintenance

### Hak Akses / Role yang Relevan
- permission view maintenance schedule
- permission maintenance checklist
- akses maintenance calendar sesuai gate/permission yang berlaku

### Halaman Utama
- maintenance calendar
- maintenance checklist index/tambah/ubah
- maintenance token feed
- reschedule maintenance dari kalender

### Kemampuan Utama yang Sudah Tersedia
- melihat maintenance calendar
- reschedule jadwal dari kalender
- membuat feed token kalender
- kelola checklist maintenance
- memakai checklist sebagai bagian dari operasional maintenance

### Batasan atau Catatan Perilaku Penting
- modul ini fokus pada visibilitas jadwal dan template kerja, bukan eksekusi perintah kerja penuh

### Dependensi ke Fitur Lain
- jadwal maintenance
- perintah kerja
- manajemen aset


---

## Laporan Maintenance


### Ringkasan Fitur
Modul ini menyediakan laporan operasional maintenance, terutama laporan perintah kerja dan laporan biaya maintenance.

### Tujuan Bisnis
- memberi visibilitas atas performa maintenance dan biaya operasional terkait
- mendukung review manajerial terhadap kegiatan maintenance

### Aktor yang Terlibat
- supervisor maintenance
- manajemen
- admin operasional

### Hak Akses / Role yang Relevan
- `viewMaintenanceReport`
- permission ekspor/report maintenance yang relevan

### Halaman Utama
- laporan perintah kerja
- laporan biaya maintenance

### Kemampuan Utama yang Sudah Tersedia
- melihat ringkasan laporan perintah kerja
- melihat laporan biaya maintenance
- memakai gate maintenance report terpisah dari laporan inventaris

### Batasan atau Catatan Perilaku Penting
- laporan maintenance berfokus pada monitoring operasional, belum BI penuh

### Dependensi ke Fitur Lain
- perintah kerja
- jadwal maintenance
- manajemen aset


---

## Jadwal Maintenance


### Ringkasan Fitur
Modul ini mengelola jadwal preventive maintenance per aset, termasuk interval, due date, dan hubungan schedule ke operasional maintenance berikutnya.

### Tujuan Bisnis
- memastikan preventive maintenance aset terencana dan tercatat
- menjadi dasar untuk reminder dan pembuatan perintah kerja terjadwal

### Aktor yang Terlibat
- paketner maintenance
- admin maintenance
- supervisor maintenance

### Hak Akses / Role yang Relevan
- permission maintenance schedule view/tambah/perbarui/hapus

### Halaman Utama
- indeks jadwal maintenance
- tambah schedule
- ubah schedule

### Kemampuan Utama yang Sudah Tersedia
- kelola maintenance schedule per aset
- menyimpan interval dan due date berikutnya
- mendukung default schedule dari kategori aset pada kondisi tertentu
- menjadi sumber reminder dan workflow maintenance terjadwal

### Batasan atau Catatan Perilaku Penting
- schedule tidak sama dengan perintah kerja; schedule adalah rencana, perintah kerja adalah eksekusi
- akurasi schedule bergantung pada aset dan parameter interval yang benar

### Dependensi ke Fitur Lain
- master data aset
- manajemen aset
- maintenance calendar & checklists
- perintah kerja


---

## Master Data Operasional Aset


### Ringkasan Fitur
Modul ini mengelola referensi operasional aset seperti departemen, person in charge, asset pengguna, vendor, dan garansi.

### Tujuan Bisnis
- mendukung pencatatan penanggung jawab, pengguna, dan relasi bisnis aset
- menjadi fondasi operasional untuk assignment, garansi, dan vendor context

### Aktor yang Terlibat
- admin master data
- admin operasional

### Hak Akses / Role yang Relevan
- permission master data pada entitas operasional terkait

### Halaman Utama
- departemens
- person in charges
- pengguna asets
- vendors
- warranties

### Kemampuan Utama yang Sudah Tersedia
- kelola departemen
- kelola person in charge
- kelola asset pengguna
- kelola vendor
- kelola garansi
- mengaitkan departemen ke branch

### Batasan atau Catatan Perilaku Penting
- departemen dan referensi lain bersifat organization-scoped
- perubahan data ini memengaruhi assignment dan konteks aset di modul lain

### Dependensi ke Fitur Lain
- branches
- registri aset
- kontrak vendors
- garansi & claims


---

## Master Data Struktural Aset


### Ringkasan Fitur
Modul ini mengelola referensi struktural aset seperti kategori, kelas, status, kondisi, unit, dan lokasi.

### Tujuan Bisnis
- menjaga struktur data inventaris tetap konsisten
- menyiapkan referensi inti untuk pencatatan dan evaluasi aset

### Aktor yang Terlibat
- admin master data
- admin aset

### Hak Akses / Role yang Relevan
- permission master data pada entitas struktural terkait

### Halaman Utama
- kategori aset
- kelas aset
- status aset
- kondisi aset
- units
- lokasi aset

### Kemampuan Utama yang Sudah Tersedia
- kelola kategori aset
- kelola kelas aset
- kelola status aset
- kelola kondisi aset
- kelola unit
- kelola lokasi aset
- mendukung default tertentu seperti interval maintenance pada kategori aset

### Batasan atau Catatan Perilaku Penting
- sebagian entitas memiliki hirarki atau relasi parent-child
- perubahan referensi ini berdampak ke form dan workflow aset

### Dependensi ke Fitur Lain
- registri aset
- siklus hidup aset
- jadwal maintenance


---

## Unggah Media


### Ringkasan Fitur
Modul ini menyediakan mekanisme unggah file yang dipakai ulang oleh beberapa modul bisnis.

### Tujuan Bisnis
- menyediakan jalur unggah file yang konsisten untuk aset, perintah kerja, dan konteks lain yang relevan
- mengurangi perbedaan perilaku unggah antar modul

### Aktor yang Terlibat
- admin aset
- teknisi
- operator lapangan

### Hak Akses / Role yang Relevan
- `media.manage`
- hak ubah pada modul induk yang memanggil unggah media

## Halaman / Halaman Utama
- halaman media
- endpoint unggah/chunk upload yang dipakai UI

### Kemampuan Utama yang Sudah Tersedia
- unggah file melalui mekanisme yang dipakai ulang oleh UI
- mendukung unggah file untuk aset dan perintah kerja
- menyiapkan file agar bisa dipakai pada konteks modul bisnis terkait

### Batasan atau Catatan Perilaku Penting
- modul ini membahas **mekanisme unggah**, bukan tampilan lampiran pada entitas tertentu
- penggunaan file setelah terunggah didokumentasikan di modul aset, perintah kerja, atau konteks penggunaan media

### Dependensi ke Fitur Lain
- lampiran aset
- lampiran perintah kerja


---

## Konteks Penggunaan Media


### Ringkasan Fitur
Modul ini menjelaskan di mana file yang sudah diunggah dipakai dalam fitur bisnis aplikasi.

### Tujuan Bisnis
- memastikan file yang tersimpan benar-benar muncul pada konteks bisnis yang tepat
- membantu tim memahami relasi antara file, aset, perintah kerja, dan tampilan publik tertentu

### Aktor yang Terlibat
- admin aset
- teknisi
- operator operasional

### Hak Akses / Role yang Relevan
- mengikuti hak akses modul yang menggunakan media

## Halaman / Halaman Utama
- detail aset
- detail perintah kerja
- halaman publik QR aset
- konteks operasional lain yang memakai dokumen/lampiran sesuai implementasi aktif

### Kemampuan Utama yang Sudah Tersedia
- memakai media pada aset
- memakai media pada perintah kerja
- memakai media pada halaman QR publik bila relevan
- memakai media pada konteks operasional lain yang sudah tersedia

### Batasan atau Catatan Perilaku Penting
- modul ini membahas **konteks pemakaian** media, bukan proses unggahnya
- detail lampiran per entitas dijelaskan pada modul lampiran aset atau lampiran perintah kerja

### Dependensi ke Fitur Lain
- unggah media
- lampiran aset
- lampiran perintah kerja


---

## Pusat Notifikasi


### Ringkasan Fitur
Modul ini adalah inbox notifikasi di dalam aplikasi untuk pengguna yang sedang login.

### Tujuan Bisnis
- membantu pengguna melihat peristiwa penting langsung dari aplikasi
- memberi cara cepat untuk mengelola status baca notifikasi

### Aktor yang Terlibat
- seluruh pengguna login

### Hak Akses / Role yang Relevan
- pengguna login untuk notifikasinya sendiri

## Halaman / Halaman Utama
- daftar notifikasi
- tandai dibaca per item
- tandai semua dibaca
- polling notifikasi

### Kemampuan Utama yang Sudah Tersedia
- melihat daftar notifikasi
- menandai satu notifikasi sebagai dibaca
- menandai semua notifikasi sebagai dibaca
- polling notifikasi untuk pembaruan UI

### Batasan atau Catatan Perilaku Penting
- modul ini fokus pada **inbox notifikasi dalam aplikasi**
- pengaturan kanal notifikasi dibahas terpisah pada modul `Preferensi Notifikasi`
- pengiriman email dibahas terpisah pada modul `Pengiriman Notifikasi Email`

### Dependensi ke Fitur Lain
- preferensi notifikasi
- pengiriman notifikasi email


---

## Preferensi Notifikasi


### Ringkasan Fitur
Modul ini memungkinkan pengguna mengatur preferensi notifikasi pribadi per tipe notifikasi yang didukung.

### Tujuan Bisnis
- memberi fleksibilitas kanal notifikasi kepada pengguna
- mengurangi noise notifikasi yang tidak relevan

### Aktor yang Terlibat
- pengguna login

### Hak Akses / Role yang Relevan
- pengguna login untuk preferensi notifikasinya sendiri

### Halaman Utama
- perbarui preferensi notifikasi pada profil

### Kemampuan Utama yang Sudah Tersedia
- menyimpan preferensi notifikasi per pengguna
- memakai preferensi sebagai bagian dari perilaku notifikasi sistem

### Batasan atau Catatan Perilaku Penting
- tidak semua tipe notifikasi harus mendukung semua kanal
- perilaku final tetap dipengaruhi tipe notifikasi dan konfigurasi sistem

### Dependensi ke Fitur Lain
- notification center
- pengiriman notifikasi email
- account & profil


---

## Administrasi Organisasi


### Ringkasan Fitur
Modul ini mengelola daftar organisasi yang dapat diakses pengguna serta administrasi organisasi seperti ubah dan deactivate.

### Tujuan Bisnis
- menjaga data organisasi tetap akurat
- memberi kontrol administratif atas organisasi aktif dalam platform multi-organisasi

### Aktor yang Terlibat
- `Owner`
- `Admin`
- admin organisasi yang berwenang

### Hak Akses / Role yang Relevan
- akses organisasi berdasarkan membership pengguna
- hak ubah/deactivate organisasi sesuai otorisasi sistem

### Halaman Utama
- organisasi index
- ubah organization
- deactivate organization

### Kemampuan Utama yang Sudah Tersedia
- melihat organisasi yang dapat diakses pengguna
- memperbarui data organisasi
- menonaktifkan organisasi sesuai otorisasi

### Batasan atau Catatan Perilaku Penting
- perubahan organisasi memengaruhi banyak modul bisnis yang bersifat organization-scoped

### Dependensi ke Fitur Lain
- organization membership & switching
- branches
- pengaturan aplikasi


---

## Keanggotaan & Perpindahan Organisasi


### Ringkasan Fitur
Modul ini mengatur bagaimana pengguna berada di satu atau banyak organisasi dan berpindah konteks organisasi aktif.

### Tujuan Bisnis
- memastikan data yang terlihat selalu sesuai organisasi aktif pengguna
- mendukung pengguna yang bekerja lintas organisasi tanpa akun terpisah

### Aktor yang Terlibat
- pengguna dengan akses ke lebih dari satu organisasi
- admin yang mengelola keanggotaan secara operasional

### Hak Akses / Role yang Relevan
- membership organisasi aktif
- role organisasi `Owner`, `Admin`, `Manager`, `Member`

## Halaman / Halaman Utama
- daftar organisasi yang dapat diakses pengguna
- aksi perpindahan organisasi aktif

### Kemampuan Utama yang Sudah Tersedia
- menampilkan organisasi yang dapat diakses pengguna
- mengganti organisasi aktif
- memakai role organisasi aktif sebagai konteks akses efektif

### Batasan atau Catatan Perilaku Penting
- modul ini fokus pada **konteks akses pengguna**, bukan administrasi data organisasi
- hampir semua modul bisnis bergantung pada organisasi aktif

### Dependensi ke Fitur Lain
- administrasi organisasi
- manajemen role & permission
- manajemen akses pengguna


---

## Onboarding Organisasi


### Ringkasan Fitur
Modul ini menangani setup awal organisasi melalui langkah bertahap seperti profil, paket, lokal, asset kode, dan import.

### Tujuan Bisnis
- mempercepat organisasi baru untuk mulai menggunakan sistem
- memastikan konfigurasi minimum organisasi tersimpan dengan benar sejak awal

### Aktor yang Terlibat
- `Owner`
- `Admin`
- admin pengaturan awal organisasi

### Hak Akses / Role yang Relevan
- pengguna yang diberi akses pengaturan awal organisasi

### Halaman Utama
- pengaturan awal profil
- pengaturan awal paket
- pengaturan awal lokal
- pengaturan awal asset kode
- pengaturan awal import
- download import template organisasi

### Kemampuan Utama yang Sudah Tersedia
- menyimpan profil awal organisasi
- menyimpan paket organisasi
- menyimpan lokal organisasi
- menyimpan aturan asset kode
- menjalankan langkah import awal
- mengunduh template import sesuai tipe yang didukung

### Batasan atau Catatan Perilaku Penting
- pengaturan awal berfokus pada setup awal, bukan seluruh administrasi lanjutan organisasi

### Dependensi ke Fitur Lain
- organization administration
- branches
- registri aset


---

## Halaman Publik QR Aset


### Ringkasan Fitur
Modul ini menyediakan halaman publik berbasis token untuk melihat detail aset tanpa login biasa.

### Tujuan Bisnis
- mempercepat identifikasi aset di lapangan melalui tautan/token QR
- memberi akses baca yang cepat ke data aset yang dibagikan melalui QR

### Aktor yang Terlibat
- operator lapangan
- pihak internal yang memegang token atau tautan QR

### Hak Akses / Role yang Relevan
- tidak memerlukan login biasa
- akses berbasis kepemilikan token yang valid

### Halaman Utama
- `/q/{token}`

### Kemampuan Utama yang Sudah Tersedia
- membuka detail aset publik berbasis token
- menampilkan lampiran aset yang relevan pada halaman publik
- menghentikan akses token lama setelah token dirotasi

### Batasan atau Catatan Perilaku Penting
- `qr_token` adalah secret tautan
- token lama tidak berlaku setelah rotasi token

### Dependensi ke Fitur Lain
- detail aset & actions
- lampiran aset


---

## Pemindaian QR


### Ringkasan Fitur
Modul ini menangani pemindaian QR via browser internal dan fallback input token manual.

### Tujuan Bisnis
- mempercepat akses ke aset atau alur kerja operasional berbasis token
- menjaga usability di perangkat yang tidak mendukung pemindai native penuh

### Aktor yang Terlibat
- pengguna internal
- operator lapangan

### Hak Akses / Role yang Relevan
- pengguna login untuk halaman scan internal
- alur setelah scan tetap mengikuti permission modul tujuan

### Halaman Utama
- halaman scan
- scan dialog pada modul operasional terkait

### Kemampuan Utama yang Sudah Tersedia
- scan QR melalui kamera browser
- fallback input token manual
- feedback scan berhasil
- flashlight toggle pada perangkat yang mendukung
- membuka alur target dari token hasil scan

### Batasan atau Catatan Perilaku Penting
- dukungan kamera dan scanner bergantung pada browser/perangkat
- fallback manual tetap membutuhkan token atau URL valid

### Dependensi ke Fitur Lain
- halaman publik QR aset
- siklus hidup aset
- disposals
- perintah kerja


---

## Manajemen Izin Akses


### Ringkasan Fitur
Modul ini mengelola role platform dan permission yang dipakai sebagai dasar akses aplikasi.

### Tujuan Bisnis
- memberi cara terstruktur untuk mengatur hak akses lintas modul
- menyediakan kontrol akses yang dapat disesuaikan per kebutuhan organisasi

### Aktor yang Terlibat
- `Owner`
- `Admin`
- `super-admin`

### Hak Akses / Role yang Relevan
- permission role view/tambah/perbarui/hapus
- bypass `super-admin` sesuai kebijakan aplikasi

### Halaman Utama
- indeks role
- tambah role
- ubah role

### Kemampuan Utama yang Sudah Tersedia
- membuat role platform
- memperbarui role platform
- memilih permission role
- meninjau daftar role yang tersedia

### Batasan atau Catatan Perilaku Penting
- permission efektif pengguna tetap dapat dipengaruhi role organisasi aktif
- role platform tidak menggantikan semua konteks akses organisasi

### Dependensi ke Fitur Lain
- pengguna access management
- organization membership & switching


---

## SSO, Delegasi, & Impersonation


### Ringkasan Fitur
Modul ini mengelola akses alternatif dan akses sementara, termasuk SSO, delegation, dan impersonation untuk kebutuhan administrasi dan operasional.

### Tujuan Bisnis
- mempermudah login bagi pengguna yang memakai provider eksternal
- mendukung pelimpahan akses operasional sementara
- membantu admin melakukan bantuan operasional melalui impersonation bila diizinkan

### Aktor yang Terlibat
- pengguna dengan akses SSO
- pemberi delegasi
- penerima delegasi
- admin/super-admin yang berwenang melakukan impersonation

### Hak Akses / Role yang Relevan
- pengguna tamu untuk redirect/callback SSO
- pengguna login untuk delegation start/stop
- admin/approver sesuai alur delegasi
- admin/super-admin untuk impersonation sesuai kebijakan aplikasi

### Halaman Utama
- redirect/callback SSO
- aksi delegasi
- aksi impersonation

### Kemampuan Utama yang Sudah Tersedia
- login melalui provider SSO yang didukung
- membuat delegasi sementara
- approve, revoke, start, dan stop delegation
- impersonation untuk kebutuhan administrasi

### Batasan atau Catatan Perilaku Penting
- SSO bergantung pada provider yang dikonfigurasi sistem
- delegation dan impersonation tetap dibatasi oleh kebijakan akses sistem

### Dependensi ke Fitur Lain
- autentikasi
- RBAC & access policy
- organisasi


---

## Manajemen Akses Pengguna


### Ringkasan Fitur
Modul ini berfokus pada pengelolaan pengguna, invitation, membership, dan akses pengguna ke area aplikasi.

### Tujuan Bisnis
- memastikan pengguna yang tepat memiliki akses yang tepat
- mempermudah administrasi anggota organisasi

### Aktor yang Terlibat
- `Owner`
- `Admin`
- admin operasional yang diberi akses kelola pengguna

### Hak Akses / Role yang Relevan
- permission pengguna view/tambah/perbarui/hapus
- permission invitation yang relevan

### Halaman Utama
- indeks pengguna
- tambah pengguna
- ubah pengguna
- detail pengguna
- invitation tambah

### Kemampuan Utama yang Sudah Tersedia
- membuat dan memperbarui pengguna
- melihat detail pengguna
- mengundang pengguna ke sistem/organisasi
- mengelola membership dan konteks akses pengguna sesuai implementasi aktif

### Batasan atau Catatan Perilaku Penting
- visibilitas dan hak ubah pengguna mengikuti permission admin yang aktif
- role organisasi dan role platform sama-sama memengaruhi perilaku akses

### Dependensi ke Fitur Lain
- role & permission management
- organisasi
- account & profil


---

## Kontrak Vendor


### Ringkasan Fitur
Modul ini mengelola kontrak vendor yang dipakai untuk mendukung aset atau layanan operasional terkait.

### Tujuan Bisnis
- menyimpan informasi kontrak vendor yang relevan untuk aset
- memudahkan monitoring relasi vendor terhadap operasional aset

### Aktor yang Terlibat
- admin operasional
- procurement
- pengguna berwenang yang mengelola kontrak vendor

### Hak Akses / Role yang Relevan
- permission kontrak vendor
- permission lihat aset yang terkait

### Halaman Utama
- indeks kontrak vendor
- tambah kontrak vendor
- ubah kontrak vendor
- detail kontrak vendor

### Kemampuan Utama yang Sudah Tersedia
- kelola kontrak vendor
- melihat detail kontrak vendor
- mengaitkan kontrak vendor dengan aset sesuai alur yang tersedia
- menyimpan dokumen/metadata kontrak yang relevan sesuai implementasi sistem

### Batasan atau Catatan Perilaku Penting
- validitas dan kegunaan kontrak bergantung pada relasinya dengan aset/vendor yang benar

### Dependensi ke Fitur Lain
- master data aset
- manajemen aset
- maintenance


---

## Garansi & Klaim


### Ringkasan Fitur
Modul ini mengelola template garansi dan klaim garansi aset sebagai bagian dari perlindungan operasional aset.

### Tujuan Bisnis
- memudahkan pemantauan masa garansi aset
- mendokumentasikan klaim garansi yang pernah diajukan

### Aktor yang Terlibat
- admin aset
- operator berwenang
- peninjau yang memantau status garansi

### Hak Akses / Role yang Relevan
- permission garansi
- permission view/perbarui asset terkait

### Halaman Utama
- master data garansi
- area garansi pada detail aset
- tambah/perbarui klaim garansi aset

### Kemampuan Utama yang Sudah Tersedia
- mengelola template garansi
- melihat status garansi aset
- membuat klaim garansi pada aset
- memperbarui klaim garansi yang sudah ada

### Batasan atau Catatan Perilaku Penting
- status garansi mengikuti data tanggal dan relasi aset
- klaim garansi bergantung pada aset yang valid dan akses pengguna

### Dependensi ke Fitur Lain
- master data aset
- manajemen aset
- notifikasi


---

## Lampiran Perintah Kerja


### Ringkasan Fitur
Modul ini menangani lampiran yang melekat pada perintah kerja sebagai bukti kerja atau dokumen pendukung.

### Tujuan Bisnis
- menyimpan dokumentasi pelaksanaan perintah kerja
- memudahkan review hasil pekerjaan maintenance

### Aktor yang Terlibat
- teknisi
- supervisor maintenance
- admin maintenance

### Hak Akses / Role yang Relevan
- permission perintah kerja perbarui
- `media.manage` atau hak lampiran sesuai implementasi perintah kerja

### Halaman Utama
- perintah kerja detail
- aksi lampiran pada perintah kerja

### Kemampuan Utama yang Sudah Tersedia
- menambahkan lampiran ke perintah kerja
- menghapus lampiran perintah kerja
- menampilkan lampiran pada detail perintah kerja

### Batasan atau Catatan Perilaku Penting
- lampiran perintah kerja adalah bagian dari dokumentasi pekerjaan, bukan pustaka bisnis terpisah

### Dependensi ke Fitur Lain
- perintah kerja execution
- media uploads


---

## Eksekusi Perintah Kerja


### Ringkasan Fitur
Modul ini berfokus pada eksekusi inti perintah kerja seperti assignment teknisi, progress perbarui, dan penutupan pekerjaan.

### Tujuan Bisnis
- memastikan pekerjaan maintenance berjalan dan selesai secara terukur
- memberi visibilitas jelas atas siapa yang mengerjakan dan status pekerjaannya

### Aktor yang Terlibat
- supervisor maintenance
- teknisi
- admin maintenance

### Hak Akses / Role yang Relevan
- permission perintah kerja perbarui/view/hapus sesuai cakupan

### Halaman Utama
- perintah kerja detail
- perintah kerja saya

### Kemampuan Utama yang Sudah Tersedia
- assignment teknisi
- melihat perintah kerja saya
- memperbarui progres pekerjaan
- selesai/batal perintah kerja sesuai aturan data wajib yang berlaku

### Batasan atau Catatan Perilaku Penting
- tidak semua pengguna boleh mengubah perintah kerja
- perubahan status tertentu mewajibkan data tambahan seperti catatan internal

### Dependensi ke Fitur Lain
- perintah kerja
- laporan maintenance
- notifikasi


---

## Tugas & Biaya Perintah Kerja


### Ringkasan Fitur
Modul ini mengelola tugas/checklist eksekusi dan komponen biaya pada perintah kerja.

### Tujuan Bisnis
- memecah pekerjaan menjadi unit tugas yang dapat dipantau
- mencatat biaya pekerjaan maintenance secara lebih operasional

### Aktor yang Terlibat
- supervisor maintenance
- teknisi
- admin maintenance

### Hak Akses / Role yang Relevan
- permission perintah kerja perbarui
- akses ke tugas dan baris biaya mengikuti visibilitas perintah kerja

### Halaman Utama
- perintah kerja detail
- tugas perbarui actions
- aksi baris biaya

### Kemampuan Utama yang Sudah Tersedia
- menambah atau memperbarui tugas perintah kerja sesuai alur yang tersedia
- memperbarui completion tugas
- menambah, memperbarui, dan menghapus baris biaya
- mendukung progres perintah kerja dari data tugas terkait

### Batasan atau Catatan Perilaku Penting
- perubahan tugas/biaya mengikuti permission pengguna dan status perintah kerja yang relevan

### Dependensi ke Fitur Lain
- perintah kerja execution
- laporan maintenance


---

## Perintah Kerja


### Ringkasan Fitur
Modul ini menjadi pintu utama pengelolaan perintah kerja maintenance dari pembuatan, daftar, pencarian, sampai akses berbasis token dari aset.

### Tujuan Bisnis
- membuat pekerjaan maintenance dapat dicatat sebagai unit kerja terpisah
- memberi titik masuk yang konsisten untuk pemantauan pekerjaan maintenance

### Aktor yang Terlibat
- admin maintenance
- supervisor maintenance
- pengguna yang membuat permintaan atau membuka perintah kerja

### Hak Akses / Role yang Relevan
- permission lihat perintah kerja/tambah/ekspor
- akses tambahan melalui role organisasi aktif sesuai kebijakan aplikasi

### Halaman Utama
- indeks perintah kerja
- tambah perintah kerja
- perintah kerja berbasis token

### Kemampuan Utama yang Sudah Tersedia
- membuat perintah kerja untuk aset
- mencari perintah kerja, termasuk berdasarkan nomor perintah kerja
- melihat daftar perintah kerja
- membuka tambah perintah kerja dari token aset
- menjadi titik masuk ke detail operasional perintah kerja

### Batasan atau Catatan Perilaku Penting
- modul ini fokus pada intake dan daftar perintah kerja; detail eksekusi diuraikan pada modul operasi perintah kerja

### Dependensi ke Fitur Lain
- manajemen aset
- QR publik & scan
- jadwal maintenance
- perintah kerja operations

