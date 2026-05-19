# Dokumentasi Cerita Pengguna Asetku

Dokumen ini menggabungkan seluruh cerita pengguna yang saat ini tersedia di sistem Asetku ke dalam satu file utuh, lengkap, dan menyeluruh.

## Tujuan Dokumen

Dokumen ini ditujukan untuk:
- tim produk
- tim operasional
- admin aplikasi
- pihak internal yang membutuhkan pemahaman menyeluruh atas kebutuhan penggunaan sistem dari sisi pengguna

## Cakupan

Dokumen ini mencakup cerita pengguna untuk fitur produk dan fitur admin operasional yang benar-benar berjalan saat ini, berdasarkan implementasi aktif pada aplikasi.

## Cara Membaca

- Gunakan daftar isi untuk menuju modul tertentu.
- Setiap modul berisi ringkasan dan daftar cerita pengguna utama.
- Setiap cerita pengguna memuat aktor, tujuan, nilai bisnis, prasyarat, alur utama, alur alternatif, kasus tepi, dan kriteria penerimaan.
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
- [Onboarding Organisasi](#onboarding-organisasi)
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


### Ringkasan Modul
Modul ini mengelola profil, preferensi notifikasi, dan penerimaan undangan.

### Daftar Cerita Pengguna Utama

### US-ACC-001 — Menerima undangan organisasi
- **Aktor:** Pengguna yang diundang
- **Tujuan:** Mengaktifkan akses ke sistem atau organisasi
- **Nilai Bisnis:** Onboarding anggota menjadi lebih terkontrol
- **Prasyarat:** Pengguna memiliki token undangan valid
- **Alur Utama:**
  1. Pengguna membuka link undangan.
  2. Pengguna menyelesaikan langkah penerimaan.
  3. Sistem mengaitkan pengguna ke organisasi yang tepat.
- **Alur Alternatif:**
  1. Pengguna gagal melanjutkan jika token tidak valid.
- **Kasus Tepi / Kondisi Gagal:**
  - token tidak ditemukan
  - token sudah tidak berlaku
- **Kriteria Penerimaan:**
  - undangan valid dapat diterima
  - undangan tidak valid ditolak

### US-ACC-002 — Mengatur profil dan preferensi notifikasi
- **Aktor:** Pengguna login
- **Tujuan:** Menyesuaikan informasi personal dan preferensi notifikasi
- **Nilai Bisnis:** Pengalaman pengguna menjadi lebih relevan dan personal
- **Prasyarat:** Pengguna sudah login
- **Alur Utama:**
  1. Pengguna membuka profil.
  2. Pengguna memperbarui data profil atau preferensi notifikasi.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna hanya memperbarui preferensi notifikasi.
- **Kasus Tepi / Kondisi Gagal:**
  - data profil tidak valid
- **Kriteria Penerimaan:**
  - profil dapat diperbarui
  - preferensi notifikasi tersimpan


---

## Aktivitas & Monitoring Pengguna


### Ringkasan Modul
Modul ini membantu admin dan reviewer internal memantau aktivitas penting yang terjadi di aplikasi.

### Daftar Cerita Pengguna Utama

### US-ACT-001 — Meninjau log aktivitas aplikasi
- **Aktor:** Admin atau reviewer internal
- **Tujuan:** Melihat aktivitas penting yang terjadi di sistem
- **Nilai Bisnis:** Investigasi operasional dan audit internal menjadi lebih mudah
- **Prasyarat:** Pengguna punya akses log aktivitas
- **Alur Utama:**
  1. Pengguna membuka halaman log aktivitas.
  2. Sistem menampilkan data aktivitas yang tersedia.
- **Alur Alternatif:**
  1. Pengguna menelusuri activity tidak langsung dari history aset pada detail aset.
- **Kasus Tepi / Kondisi Gagal:**
  - data activity belum ada
- **Kriteria Penerimaan:**
  - halaman activity dapat dibuka pengguna berwenang
  - history aset dapat dilihat dari detail aset


---

## Pengaturan Aplikasi


### Ringkasan Modul
Modul ini mengelola pengaturan umum aplikasi.

### Daftar Cerita Pengguna Utama

### US-APS-001 — Memperbarui pengaturan aplikasi umum
- **Aktor:** Admin berwenang
- **Tujuan:** Menyesuaikan konfigurasi dasar aplikasi
- **Nilai Bisnis:** Sistem dapat diselaraskan dengan kebutuhan operasional organisasi
- **Prasyarat:** Pengguna punya izin pengaturan aplikasi
- **Alur Utama:**
  1. Pengguna membuka settings app.
  2. Pengguna memperbarui nilai konfigurasi yang tersedia.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau konfigurasi saat ini.
- **Kasus Tepi / Kondisi Gagal:**
  - nilai konfigurasi tidak valid
- **Kriteria Penerimaan:**
  - pengaturan umum aplikasi dapat diperbarui oleh pengguna berwenang


---

## Lampiran Aset


### Ringkasan Modul
Modul ini menangani lampiran foto dan dokumen yang menempel pada aset.

### Daftar Cerita Pengguna Utama

### US-AAT-001 — Menambahkan lampiran ke aset
- **Aktor:** Admin aset atau operator lapangan
- **Tujuan:** Menyimpan bukti visual atau dokumen pendukung aset
- **Nilai Bisnis:** Data aset menjadi lebih kaya dan mudah diverifikasi
- **Prasyarat:** Pengguna punya hak mengubah aset/lampiran
- **Alur Utama:**
  1. Pengguna membuka area lampiran aset.
  2. Pengguna memilih file untuk diunggah.
  3. Sistem menyimpan file dan mengaitkannya ke aset.
- **Alur Alternatif:**
  1. Pengguna mengunggah dokumen atau foto sesuai jenis lampiran.
- **Kasus Tepi / Kondisi Gagal:**
  - file tidak valid
- **Kriteria Penerimaan:**
  - lampiran valid dapat ditambahkan ke aset

### US-AAT-002 — Menghapus lampiran aset
- **Aktor:** Pengguna berwenang
- **Tujuan:** Menjaga lampiran aset tetap relevan
- **Nilai Bisnis:** Dokumen dan foto yang salah dapat dibersihkan dari data aset
- **Prasyarat:** Attachment sudah ada
- **Alur Utama:**
  1. Pengguna memilih lampiran pada aset.
  2. Pengguna menjalankan aksi hapus.
  3. Sistem menghapus lampiran dari aset.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau lampiran tanpa menghapus.
- **Kasus Tepi / Kondisi Gagal:**
  - pengguna tidak punya akses hapus
- **Kriteria Penerimaan:**
  - lampiran dapat dihapus oleh pengguna berwenang


---

## Detail & Aksi Aset


### Ringkasan Modul
Modul ini membantu pengguna memahami kondisi aset dan menjalankan aksi cepat dari halaman detail.

### Daftar Cerita Pengguna Utama

### US-ADT-001 — Meninjau detail aset lengkap
- **Aktor:** Pengguna yang bisa melihat aset
- **Tujuan:** Memahami informasi aset dari satu layar
- **Nilai Bisnis:** Review operasional dan administratif menjadi lebih cepat
- **Prasyarat:** Pengguna dapat melihat aset tersebut
- **Alur Utama:**
  1. Pengguna membuka detail aset.
  2. Sistem menampilkan informasi inti, histori, QR, lampiran, dan konteks terkait.
- **Alur Alternatif:**
  1. Pengguna berpindah ke tab atau area detail lain pada halaman yang sama.
- **Kasus Tepi / Kondisi Gagal:**
  - aset tidak termasuk cakupan pengguna
- **Kriteria Penerimaan:**
  - detail aset tampil lengkap sesuai hak akses

### US-ADT-002 — Menjalankan aksi cepat dari detail aset
- **Aktor:** Pengguna berwenang
- **Tujuan:** Melakukan tindakan operasional tanpa keluar dari detail aset
- **Nilai Bisnis:** Operasional harian menjadi lebih efisien
- **Prasyarat:** Pengguna punya hak untuk aksi yang dipilih
- **Alur Utama:**
  1. Pengguna membuka detail aset.
  2. Pengguna memilih aksi seperti ubah, ubah status, cetak label, atau regenerasi token QR.
  3. Sistem menjalankan aksi terkait.
- **Alur Alternatif:**
  1. Pengguna hanya copy QR link atau buka halaman QR.
- **Kasus Tepi / Kondisi Gagal:**
  - pengguna tidak punya akses pada aksi tertentu
- **Kriteria Penerimaan:**
  - aksi cepat hanya tersedia untuk pengguna berhak
  - hasil aksi tercermin pada data atau tampilan aset


---

## Label & Ekspor Aset


### Ringkasan Modul
Modul ini mendukung output inventaris dalam bentuk label fisik dan export data.

### Daftar Cerita Pengguna Utama

### US-ALX-001 — Mencetak label aset
- **Aktor:** Admin aset atau operator inventaris
- **Tujuan:** Menyiapkan label fisik untuk identifikasi aset
- **Nilai Bisnis:** Aset lebih mudah dikenali di lapangan
- **Prasyarat:** Aset tersedia dan pengguna punya akses yang relevan
- **Alur Utama:**
  1. Pengguna memilih print label.
  2. Sistem menampilkan atau membuka format label yang tersedia.
- **Alur Alternatif:**
  1. Pengguna meninjau QR terkait sebelum print.
- **Kasus Tepi / Kondisi Gagal:**
  - aset yang dipilih tidak valid
- **Kriteria Penerimaan:**
  - label dapat dibuka untuk aset yang valid

### US-ALX-002 — Mengekspor data aset
- **Aktor:** Pengguna berwenang
- **Tujuan:** Mengambil data aset ke format luar aplikasi
- **Nilai Bisnis:** Pelaporan dan pengolahan lanjutan menjadi lebih mudah
- **Prasyarat:** Pengguna punya hak export asset
- **Alur Utama:**
  1. Pengguna memicu export aset.
  2. Sistem menghasilkan respons export sesuai format yang didukung.
- **Alur Alternatif:**
  1. Pengguna menyesuaikan hasil export melalui filter daftar aset sebelumnya.
- **Kasus Tepi / Kondisi Gagal:**
  - tidak ada data yang memenuhi kriteria
- **Kriteria Penerimaan:**
  - export dapat dipicu oleh pengguna berhak


---

## Mutasi & Peristiwa Aset


### Ringkasan Modul
Modul ini menangani pencatatan movement dan event operasional aset.

### Daftar Cerita Pengguna Utama

### US-AME-001 — Mencatat movement aset
- **Aktor:** Operator aset
- **Tujuan:** Mendokumentasikan perpindahan atau peminjaman aset
- **Nilai Bisnis:** Lokasi dan penggunaan aset dapat ditelusuri
- **Prasyarat:** Pengguna punya akses lifecycle aset
- **Alur Utama:**
  1. Pengguna membuka alur movement aset.
  2. Pengguna memilih jenis movement dan data tujuan.
  3. Sistem menyimpan movement.
- **Alur Alternatif:**
  1. Pengguna mencatat pengembalian setelah peminjaman.
- **Kasus Tepi / Kondisi Gagal:**
  - tujuan movement tidak valid
- **Kriteria Penerimaan:**
  - movement aset dapat dicatat pada aset yang valid

### US-AME-002 — Mencatat event lifecycle lain
- **Aktor:** Pengguna berwenang
- **Tujuan:** Menyimpan kejadian operasional penting pada aset
- **Nilai Bisnis:** Riwayat perjalanan aset lebih lengkap
- **Prasyarat:** Pengguna punya akses lifecycle/asset perbarui
- **Alur Utama:**
  1. Pengguna membuka alur event lifecycle.
  2. Pengguna memasukkan detail kejadian.
  3. Sistem menyimpan event.
- **Alur Alternatif:**
  1. Pengguna membuka aset melalui token untuk memulai proses.
- **Kasus Tepi / Kondisi Gagal:**
  - data event tidak valid
- **Kriteria Penerimaan:**
  - event lifecycle dapat disimpan pada aset yang valid


---

## Registri Aset


### Ringkasan Modul
Modul ini adalah titik utama untuk mendaftarkan dan menelusuri aset.

### Daftar Cerita Pengguna Utama

### US-ARG-001 — Mencatat aset baru
- **Aktor:** Admin aset
- **Tujuan:** Menambahkan aset ke inventaris organisasi
- **Nilai Bisnis:** Organisasi memiliki inventaris yang terdokumentasi
- **Prasyarat:** Pengguna punya hak tambah asset dan master data minimum tersedia
- **Alur Utama:**
  1. Pengguna membuka form tambah aset.
  2. Pengguna mengisi data yang diperlukan.
  3. Sistem menyimpan aset dan menghasilkan identitas yang diperlukan.
- **Alur Alternatif:**
  1. Sistem mengisi code atau token otomatis bila diperbolehkan.
- **Kasus Tepi / Kondisi Gagal:**
  - referensi master data tidak valid
- **Kriteria Penerimaan:**
  - aset baru dapat dibuat dan muncul di daftar

### US-ARG-002 — Mencari aset pada daftar inventaris
- **Aktor:** Pengguna berwenang
- **Tujuan:** Menemukan aset yang sedang dibutuhkan
- **Nilai Bisnis:** Akses ke data aset menjadi cepat dan efisien
- **Prasyarat:** Pengguna punya akses lihat aset
- **Alur Utama:**
  1. Pengguna membuka daftar aset.
  2. Pengguna memakai pencarian atau filter.
  3. Sistem menampilkan hasil sesuai cakupan dan filter.
- **Alur Alternatif:**
  1. Pengguna menyimpan preferensi/filter tampilan tertentu.
- **Kasus Tepi / Kondisi Gagal:**
  - tidak ada aset yang cocok
- **Kriteria Penerimaan:**
  - daftar aset dapat dicari dan difilter


---

## Operasi Status & Kondisi Aset


### Ringkasan Modul
Modul ini mengelola perubahan status dan kondisi aset sebagai operasi harian.

### Daftar Cerita Pengguna Utama

### US-ASC-001 — Mengubah status aset secara terkontrol
- **Aktor:** Pengguna berwenang
- **Tujuan:** Menyesuaikan status aset dengan kondisi operasional terbaru
- **Nilai Bisnis:** Status aset selalu mencerminkan keadaan sebenarnya
- **Prasyarat:** Pengguna dapat melihat dan mengubah aset
- **Alur Utama:**
  1. Pengguna membuka alur ubah status.
  2. Pengguna memilih status baru.
  3. Sistem memvalidasi aturan transisi.
  4. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna menjalankan quick change status dari detail aset.
- **Kasus Tepi / Kondisi Gagal:**
  - transisi status diblokir
- **Kriteria Penerimaan:**
  - perubahan status hanya berhasil bila transisi diizinkan

### US-ASC-002 — Mengubah kondisi aset
- **Aktor:** Pengguna berwenang
- **Tujuan:** Memperbarui kondisi fisik/operasional aset
- **Nilai Bisnis:** Kondisi aset dapat dipantau lebih akurat
- **Prasyarat:** Pengguna punya akses perbarui lifecycle/asset
- **Alur Utama:**
  1. Pengguna membuka alur perubahan kondisi.
  2. Pengguna memilih kondisi baru.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna meninjau kondisi lama sebelum mengganti.
- **Kasus Tepi / Kondisi Gagal:**
  - referensi kondisi tidak valid
- **Kriteria Penerimaan:**
  - kondisi aset dapat diperbarui oleh pengguna berwenang


---

## Temuan Audit


### Ringkasan Modul
Modul ini mendokumentasikan temuan audit.

### Daftar Cerita Pengguna Utama

### US-AFD-001 — Mencatat temuan audit
- **Aktor:** Auditor internal
- **Tujuan:** Menyimpan finding yang perlu ditindaklanjuti
- **Nilai Bisnis:** Temuan audit tidak hilang dan dapat dipakai untuk evaluasi berikutnya
- **Prasyarat:** Konteks audit tersedia dan pengguna punya akses tambah finding
- **Alur Utama:**
  1. Pengguna membuka form audit finding.
  2. Pengguna mengisi detail temuan.
  3. Sistem menyimpan finding.
- **Alur Alternatif:**
  1. Finding dikaitkan ke aset atau konteks audit yang relevan.
- **Kasus Tepi / Kondisi Gagal:**
  - data finding tidak lengkap
- **Kriteria Penerimaan:**
  - finding audit dapat dibuat dan tersimpan


---

## Jadwal Audit


### Ringkasan Modul
Modul ini mengelola perencanaan audit.

### Daftar Cerita Pengguna Utama

### US-ASC-001 — Membuat dan meninjau jadwal audit
- **Aktor:** Auditor internal atau admin berwenang
- **Tujuan:** Menjadwalkan aktivitas audit
- **Nilai Bisnis:** Proses audit menjadi lebih terencana
- **Prasyarat:** Pengguna punya akses audit schedules
- **Alur Utama:**
  1. Pengguna membuka audit schedules.
  2. Pengguna membuat atau memperbarui jadwal audit.
  3. Pengguna membuka detail jadwal bila diperlukan.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau daftar audit yang ada.
- **Kasus Tepi / Kondisi Gagal:**
  - data audit tidak lengkap
- **Kriteria Penerimaan:**
  - jadwal audit dapat dibuat, diubah, dan dilihat


---

## Autentikasi


### Ringkasan Modul
Modul ini memungkinkan pengguna masuk ke aplikasi dan memulihkan akses dengan aman.

### Daftar Cerita Pengguna Utama

### US-AUTH-001 — Login ke aplikasi
- **Aktor:** Pengguna terdaftar
- **Tujuan:** Masuk ke aplikasi menggunakan kredensial yang valid
- **Nilai Bisnis:** Pengguna dapat mengakses modul sesuai hak aksesnya
- **Prasyarat:** Akun aktif dan kredensial valid
- **Alur Utama:**
  1. Pengguna membuka halaman login.
  2. Pengguna memasukkan kredensial.
  3. Sistem memverifikasi data login.
  4. Sistem mengarahkan pengguna ke area aplikasi yang sesuai.
- **Alur Alternatif:**
  1. Jika 2FA aktif, sistem meminta challenge tambahan.
- **Kasus Tepi / Kondisi Gagal:**
  - kredensial salah
  - akun belum terverifikasi
- **Kriteria Penerimaan:**
  - pengguna dengan kredensial valid dapat login
  - pengguna dengan kredensial salah mendapat pesan gagal

### US-AUTH-002 — Mengatur ulang password
- **Aktor:** Pengguna terdaftar
- **Tujuan:** Memulihkan akses saat lupa password
- **Nilai Bisnis:** Risiko kehilangan akses akun berkurang
- **Prasyarat:** Akun terdaftar dan alur reset tersedia
- **Alur Utama:**
  1. Pengguna membuka halaman lupa password.
  2. Pengguna meminta reset.
  3. Pengguna menyelesaikan alur password baru.
- **Alur Alternatif:**
  1. Pengguna kembali meminta token reset baru bila token lama tidak berlaku.
- **Kasus Tepi / Kondisi Gagal:**
  - token reset kadaluarsa
  - akun/email tidak valid
- **Kriteria Penerimaan:**
  - reset password berhasil dengan token valid
  - token tidak valid ditolak sistem


---

## Cabang


### Ringkasan Modul
Modul ini mendukung pengelolaan cabang organisasi sebagai unit operasional.

### Daftar Cerita Pengguna Utama

### US-BRN-001 — Menambah atau memperbarui cabang
- **Aktor:** Admin organisasi
- **Tujuan:** Menyusun struktur cabang yang benar
- **Nilai Bisnis:** Data operasional aset dan department lebih akurat
- **Prasyarat:** Pengguna punya hak kelola cabang
- **Alur Utama:**
  1. Pengguna membuka modul cabang.
  2. Pengguna membuat atau memperbarui data cabang.
  3. Sistem menyimpan data.
- **Alur Alternatif:**
  1. Pengguna membuka detail cabang untuk review.
- **Kasus Tepi / Kondisi Gagal:**
  - kode cabang duplikat
- **Kriteria Penerimaan:**
  - cabang dapat dibuat dan diperbarui
  - cabang dapat dilihat kembali pada halaman detail


---

## Depresiasi


### Ringkasan Modul
Modul ini memberi visibilitas atas nilai buku dan hasil depresiasi aset.

### Daftar Cerita Pengguna Utama

### US-DPR-001 — Meninjau depresiasi aset
- **Aktor:** Admin aset atau finance internal
- **Tujuan:** Melihat detail depresiasi satu aset
- **Nilai Bisnis:** Nilai buku aset dapat dipantau untuk kebutuhan operasional dan review internal
- **Prasyarat:** Aset dan data depresiasi tersedia
- **Alur Utama:**
  1. Pengguna membuka modul depresiasi.
  2. Pengguna memilih aset atau detail depresiasi aset.
  3. Sistem menampilkan histori dan nilai terkait.
- **Alur Alternatif:**
  1. Pengguna mengakses depresiasi dari konteks detail aset.
- **Kasus Tepi / Kondisi Gagal:**
  - data depresiasi belum tersedia
- **Kriteria Penerimaan:**
  - detail depresiasi aset dapat ditampilkan bila data tersedia
  - informasi nilai buku dan komponen depresiasi dapat dibaca pengguna

### US-DPR-002 — Menjalankan atau mengekspor hasil depresiasi
- **Aktor:** Pengguna berwenang
- **Tujuan:** Memproses atau membagikan hasil depresiasi
- **Nilai Bisnis:** Proses review depresiasi menjadi lebih mudah
- **Prasyarat:** Pengguna punya akses ke tindakan depresiasi terkait
- **Alur Utama:**
  1. Pengguna menjalankan run atau membuka export depresiasi.
  2. Sistem memproses permintaan.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau daftar run yang ada.
- **Kasus Tepi / Kondisi Gagal:**
  - tidak ada data untuk diproses/ditampilkan
- **Kriteria Penerimaan:**
  - run atau export dapat dipicu dari halaman utama yang tersedia


---

## Disposal / Penghapusan Aset


### Ringkasan Modul
Modul ini memastikan penghapusan aset berjalan sebagai workflow bisnis yang terdokumentasi.

### Daftar Cerita Pengguna Utama

### US-DSP-001 — Mengajukan disposal aset
- **Aktor:** Pengguna berwenang
- **Tujuan:** Memulai proses penghapusan aset dari operasional aktif
- **Nilai Bisnis:** Penghapusan aset tidak dilakukan sembarangan dan dapat diaudit
- **Prasyarat:** Aset valid dan pengguna dapat membuat disposal
- **Alur Utama:**
  1. Pengguna membuka tambah disposal.
  2. Pengguna memilih aset dan melengkapi data disposal.
  3. Sistem menyimpan permintaan disposal.
- **Alur Alternatif:**
  1. Pengguna memulai tambah disposal dari token aset.
- **Kasus Tepi / Kondisi Gagal:**
  - aset tidak dapat diakses pengguna
  - data disposal tidak lengkap
- **Kriteria Penerimaan:**
  - disposal request dapat dibuat
  - disposal dapat dikaitkan dengan aset yang benar

### US-DSP-002 — Menyetujui atau menolak disposal
- **Aktor:** Approver disposal
- **Tujuan:** Mengendalikan keluarnya aset dari inventaris aktif
- **Nilai Bisnis:** Kontrol internal atas penghapusan aset tetap terjaga
- **Prasyarat:** Disposal sudah diajukan dan approver punya hak terkait
- **Alur Utama:**
  1. Approver membuka detail disposal.
  2. Approver memilih approve atau reject.
  3. Sistem menyimpan keputusan.
- **Alur Alternatif:**
  1. Approver meninjau berita acara atau detail lain sebelum memutuskan.
- **Kasus Tepi / Kondisi Gagal:**
  - approver tidak punya hak keputusan
- **Kriteria Penerimaan:**
  - disposal dapat diapprove atau reject sesuai hak akses
  - status disposal berubah sesuai keputusan


---

## Pengiriman Notifikasi Email


### Ringkasan Modul
Modul ini mengatur sisi pengiriman email dari notifikasi sistem.

### Daftar Cerita Pengguna Utama

### US-END-001 — Mengirim email untuk event penting
- **Aktor:** Sistem dan pengguna penerima
- **Tujuan:** Mengirim pemberitahuan penting ke email pengguna
- **Nilai Bisnis:** Informasi penting tidak hanya bergantung pada inbox aplikasi
- **Prasyarat:** Konfigurasi mail valid dan event sumber terjadi
- **Alur Utama:**
  1. Event bisnis memicu notifikasi.
  2. Sistem menyiapkan email sesuai aturan notifikasi.
  3. Sistem mengirim email melalui mekanisme yang tersedia.
- **Alur Alternatif:**
  1. Pengguna hanya menerima notifikasi in-app bila email tidak dipakai untuk tipe itu.
- **Kasus Tepi / Kondisi Gagal:**
  - konfigurasi mail tidak valid
- **Kriteria Penerimaan:**
  - event penting yang mendukung email dapat memicu pengiriman email


---

## Flag Fitur


### Ringkasan Modul
Modul ini memungkinkan admin mengelola feature flags yang tersedia di settings.

### Daftar Cerita Pengguna Utama

### US-FLG-001 — Mengubah status feature flag
- **Aktor:** Admin berwenang
- **Tujuan:** Mengendalikan perilaku tertentu dari sistem melalui konfigurasi flag
- **Nilai Bisnis:** Admin memiliki fleksibilitas operasional tambahan
- **Prasyarat:** Pengguna punya izin pengaturan flag fitur
- **Alur Utama:**
  1. Pengguna membuka settings features.
  2. Pengguna mengubah status flag yang tersedia.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau daftar flag.
- **Kasus Tepi / Kondisi Gagal:**
  - flag tertentu tidak dapat diubah karena batasan sistem
- **Kriteria Penerimaan:**
  - perubahan flag yang didukung dapat disimpan dari UI settings


---

## Laporan Inventaris


### Ringkasan Modul
Modul ini menyediakan laporan inventaris dan stocktake print.

### Daftar Cerita Pengguna Utama

### US-IRP-001 — Melihat inventory report
- **Aktor:** Admin operasional atau manajemen
- **Tujuan:** Memantau inventaris aset
- **Nilai Bisnis:** Kondisi inventaris dapat dilihat dari satu tempat
- **Prasyarat:** Pengguna punya akses inventory report
- **Alur Utama:**
  1. Pengguna membuka inventory report.
  2. Pengguna menerapkan filter bila perlu.
  3. Sistem menampilkan hasil.
- **Alur Alternatif:**
  1. Pengguna membuka stocktake print.
- **Kasus Tepi / Kondisi Gagal:**
  - data sesuai filter tidak tersedia
- **Kriteria Penerimaan:**
  - inventory report dapat dibuka dan ditinjau

### US-IRP-002 — Mencetak stocktake inventory
- **Aktor:** Admin operasional
- **Tujuan:** Menyiapkan daftar stocktake lapangan
- **Nilai Bisnis:** Proses stocktake menjadi lebih praktis
- **Prasyarat:** Pengguna punya akses inventory report
- **Alur Utama:**
  1. Pengguna membuka stocktake print.
  2. Sistem menampilkan format print yang relevan.
- **Alur Alternatif:**
  1. Pengguna kembali mengubah filter di inventory report sebelum print.
- **Kasus Tepi / Kondisi Gagal:**
  - tidak ada data yang dapat dicetak
- **Kriteria Penerimaan:**
  - stocktake print dapat diakses dari modul laporan inventaris


---

## Pengaturan Email


### Ringkasan Modul
Modul ini mengelola konfigurasi email sistem dan pengujian email.

### Daftar Cerita Pengguna Utama

### US-MLS-001 — Memperbarui konfigurasi mail dan mengirim test email
- **Aktor:** Admin berwenang
- **Tujuan:** Memastikan email sistem dapat berjalan
- **Nilai Bisnis:** Notifikasi email operasional lebih andal
- **Prasyarat:** Pengguna punya izin pengaturan email
- **Alur Utama:**
  1. Pengguna membuka settings mail.
  2. Pengguna memperbarui konfigurasi email.
  3. Pengguna memicu test email.
  4. Sistem memproses test email.
- **Alur Alternatif:**
  1. Pengguna hanya menyimpan konfigurasi tanpa test email.
- **Kasus Tepi / Kondisi Gagal:**
  - konfigurasi mail salah
- **Kriteria Penerimaan:**
  - konfigurasi mail dapat disimpan
  - test email dapat dipicu dari UI settings mail


---

## Kalender Maintenance & Checklist


### Ringkasan Modul
Modul ini membantu visibilitas jadwal maintenance dan standarisasi pekerjaan melalui checklist.

### Daftar Cerita Pengguna Utama

### US-MCL-001 — Meninjau kalender maintenance dan menjadwal ulang
- **Aktor:** Planner atau supervisor maintenance
- **Tujuan:** Melihat jadwal dan menyesuaikannya bila diperlukan
- **Nilai Bisnis:** Penjadwalan preventive maintenance menjadi lebih fleksibel
- **Prasyarat:** Jadwal maintenance sudah tersedia
- **Alur Utama:**
  1. Pengguna membuka kalender maintenance.
  2. Pengguna meninjau jadwal yang ada.
  3. Pengguna melakukan reschedule bila perlu.
  4. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna hanya melihat feed/token kalender.
- **Kasus Tepi / Kondisi Gagal:**
  - jadwal tidak dapat diubah
- **Kriteria Penerimaan:**
  - kalender dapat dibuka
  - reschedule valid dapat disimpan

### US-MCL-002 — Mengelola checklist maintenance
- **Aktor:** Admin maintenance
- **Tujuan:** Menyiapkan template checklist untuk pekerjaan maintenance
- **Nilai Bisnis:** Eksekusi maintenance lebih konsisten
- **Prasyarat:** Pengguna punya akses checklist maintenance
- **Alur Utama:**
  1. Pengguna membuka maintenance checklists.
  2. Pengguna membuat atau memperbarui checklist.
  3. Sistem menyimpan checklist.
- **Alur Alternatif:**
  1. Pengguna meninjau daftar checklist tanpa mengubahnya.
- **Kasus Tepi / Kondisi Gagal:**
  - data checklist tidak valid
- **Kriteria Penerimaan:**
  - checklist dapat dibuat, diubah, dan dilihat


---

## Laporan Maintenance


### Ringkasan Modul
Modul ini menyediakan laporan terkait perintah kerja dan biaya maintenance.

### Daftar Cerita Pengguna Utama

### US-MRP-001 — Melihat perintah kerja report
- **Aktor:** Supervisor atau manajemen
- **Tujuan:** Memantau performa pekerjaan maintenance
- **Nilai Bisnis:** Kinerja operasional maintenance dapat dievaluasi
- **Prasyarat:** Pengguna punya akses maintenance report
- **Alur Utama:**
  1. Pengguna membuka perintah kerja report.
  2. Sistem menampilkan ringkasan laporan.
- **Alur Alternatif:**
  1. Pengguna berpindah ke maintenance cost report untuk analisis biaya.
- **Kasus Tepi / Kondisi Gagal:**
  - data laporan belum tersedia
- **Kriteria Penerimaan:**
  - perintah kerja report dapat diakses oleh pengguna berwenang

### US-MRP-002 — Melihat maintenance cost report
- **Aktor:** Admin operasional atau manajemen
- **Tujuan:** Meninjau biaya maintenance
- **Nilai Bisnis:** Organisasi dapat memantau pengeluaran maintenance dengan lebih baik
- **Prasyarat:** Pengguna punya akses maintenance report
- **Alur Utama:**
  1. Pengguna membuka maintenance cost report.
  2. Sistem menampilkan data biaya yang tersedia.
- **Alur Alternatif:**
  1. Pengguna membandingkan hasil dengan perintah kerja report.
- **Kasus Tepi / Kondisi Gagal:**
  - belum ada data biaya maintenance
- **Kriteria Penerimaan:**
  - maintenance cost report dapat diakses oleh pengguna berwenang


---

## Jadwal Maintenance


### Ringkasan Modul
Modul ini menangani pembuatan dan pengelolaan jadwal preventive maintenance aset.

### Daftar Cerita Pengguna Utama

### US-MTS-001 — Membuat jadwal preventive maintenance
- **Aktor:** Planner atau admin maintenance
- **Tujuan:** Menetapkan jadwal maintenance untuk aset
- **Nilai Bisnis:** Pemeliharaan preventif dapat dilakukan tepat waktu
- **Prasyarat:** Aset tersedia dan pengguna punya hak kelola schedule
- **Alur Utama:**
  1. Pengguna membuka maintenance schedules.
  2. Pengguna membuat jadwal baru.
  3. Sistem menyimpan interval dan due date.
- **Alur Alternatif:**
  1. Sistem membuat default schedule dari kategori aset bila relevan.
- **Kasus Tepi / Kondisi Gagal:**
  - aset tidak valid
  - interval tidak valid
- **Kriteria Penerimaan:**
  - schedule dapat dibuat dan ditinjau kembali


---

## Master Data Operasional Aset


### Ringkasan Modul
Modul ini mengelola referensi operasional untuk pemegang, pengguna, vendor, warranty, dan department.

### Daftar Cerita Pengguna Utama

### US-MDO-001 — Mengelola referensi operasional aset
- **Aktor:** Admin master data atau admin operasional
- **Tujuan:** Menyediakan referensi yang dipakai modul operasional aset
- **Nilai Bisnis:** Assignment dan relasi bisnis aset menjadi lebih akurat
- **Prasyarat:** Pengguna punya hak kelola master data operasional
- **Alur Utama:**
  1. Pengguna membuka entitas seperti department, PIC, asset pengguna, vendor, atau warranty.
  2. Pengguna membuat atau memperbarui data.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna meninjau data tanpa mengubahnya.
- **Kasus Tepi / Kondisi Gagal:**
  - relasi department ke branch tidak valid
- **Kriteria Penerimaan:**
  - referensi operasional aset dapat dibuat dan diperbarui


---

## Master Data Struktural Aset


### Ringkasan Modul
Modul ini mengelola referensi struktural utama untuk aset.

### Daftar Cerita Pengguna Utama

### US-MDS-001 — Mengelola kategori, status, kondisi, kelas, unit, dan lokasi aset
- **Aktor:** Admin master data
- **Tujuan:** Menjaga referensi struktural inventaris tetap akurat
- **Nilai Bisnis:** Data aset menjadi konsisten dan lebih mudah dikelola
- **Prasyarat:** Pengguna punya hak kelola master data terkait
- **Alur Utama:**
  1. Pengguna membuka entitas master data yang relevan.
  2. Pengguna membuat atau memperbarui data.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna mengatur parent/hirarki pada kategori atau lokasi bila didukung.
- **Kasus Tepi / Kondisi Gagal:**
  - kode unik bentrok
  - parent tidak valid
- **Kriteria Penerimaan:**
  - referensi struktural aset dapat dibuat dan diperbarui


---

## Unggah Media


### Ringkasan Modul
Modul ini menyediakan jalur upload file yang dipakai oleh modul bisnis.

### Daftar Cerita Pengguna Utama

### US-MUP-001 — Mengunggah file untuk modul bisnis
- **Aktor:** Pengguna berwenang pada modul induk
- **Tujuan:** Menyimpan file pendukung pada alur kerja yang relevan
- **Nilai Bisnis:** Bukti pekerjaan atau data visual dapat tersimpan dengan konsisten
- **Prasyarat:** Pengguna punya hak upload pada modul yang memakai media
- **Alur Utama:**
  1. Pengguna memulai upload dari modul bisnis.
  2. Sistem menerima dan menyimpan file.
  3. File dipakai pada konteks modul yang bersangkutan.
- **Alur Alternatif:**
  1. Pengguna mengunggah file bertahap melalui mekanisme upload yang tersedia.
- **Kasus Tepi / Kondisi Gagal:**
  - file gagal diunggah
- **Kriteria Penerimaan:**
  - file dapat diunggah dari modul yang mendukung upload


---

## Konteks Penggunaan Media


### Ringkasan Modul
Modul ini memastikan media yang diunggah digunakan pada konteks bisnis yang tepat.

### Daftar Cerita Pengguna Utama

### US-MUC-001 — Menggunakan media pada aset atau perintah kerja
- **Aktor:** Pengguna operasional
- **Tujuan:** Melihat file pendukung pada entitas bisnis yang relevan
- **Nilai Bisnis:** Bukti visual dan dokumen lebih mudah diakses dalam konteks kerja
- **Prasyarat:** Media sudah terhubung ke entitas terkait
- **Alur Utama:**
  1. Pengguna membuka aset, perintah kerja, atau konteks lain yang relevan.
  2. Sistem menampilkan media yang terkait.
- **Alur Alternatif:**
  1. Media juga terlihat pada QR public page bila konteksnya mendukung.
- **Kasus Tepi / Kondisi Gagal:**
  - media belum tersedia untuk entitas tersebut
- **Kriteria Penerimaan:**
  - media tampil pada konteks bisnis yang sesuai


---

## Pusat Notifikasi


### Ringkasan Modul
Modul ini adalah inbox notifikasi dalam aplikasi untuk pengguna login.

### Daftar Cerita Pengguna Utama

### US-NTC-001 — Membaca dan menandai notifikasi
- **Aktor:** Pengguna login
- **Tujuan:** Mengetahui event penting yang membutuhkan perhatian
- **Nilai Bisnis:** Respons terhadap event operasional menjadi lebih cepat
- **Prasyarat:** Pengguna memiliki notifikasi
- **Alur Utama:**
  1. Pengguna membuka halaman notifikasi.
  2. Sistem menampilkan daftar notifikasi.
  3. Pengguna menandai satu atau semua notifikasi sebagai dibaca.
- **Alur Alternatif:**
  1. UI mengambil perbarui notifikasi melalui polling.
- **Kasus Tepi / Kondisi Gagal:**
  - belum ada notifikasi
- **Kriteria Penerimaan:**
  - notifikasi dapat ditampilkan dan ditandai dibaca


---

## Preferensi Notifikasi


### Ringkasan Modul
Modul ini memungkinkan pengguna menyesuaikan preferensi notifikasinya sendiri.

### Daftar Cerita Pengguna Utama

### US-NTP-001 — Menyimpan preferensi notifikasi pribadi
- **Aktor:** Pengguna login
- **Tujuan:** Menentukan kanal notifikasi yang diinginkan
- **Nilai Bisnis:** Pengguna menerima informasi dengan cara yang lebih relevan
- **Prasyarat:** Pengguna sudah login
- **Alur Utama:**
  1. Pengguna membuka area preferensi notifikasi.
  2. Pengguna memperbarui pilihan kanal yang tersedia.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna membiarkan default sistem tetap berlaku.
- **Kasus Tepi / Kondisi Gagal:**
  - tipe notifikasi tertentu tidak mendukung semua kanal
- **Kriteria Penerimaan:**
  - preferensi notifikasi dapat disimpan untuk pengguna yang sedang login


---

## Administrasi Organisasi


### Ringkasan Modul
Modul ini mengelola administrasi data organisasi yang sudah aktif di sistem.

### Daftar Cerita Pengguna Utama

### US-OAD-001 — Memperbarui data organisasi
- **Aktor:** Admin organisasi
- **Tujuan:** Menjaga data organisasi tetap akurat
- **Nilai Bisnis:** Informasi organisasi yang dipakai modul lain tetap konsisten
- **Prasyarat:** Pengguna punya hak ubah organisasi
- **Alur Utama:**
  1. Pengguna membuka halaman ubah organisasi.
  2. Pengguna memperbarui data yang diperlukan.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau daftar organisasi.
- **Kasus Tepi / Kondisi Gagal:**
  - data organisasi tidak valid
- **Kriteria Penerimaan:**
  - organisasi dapat diperbarui oleh pengguna berwenang

### US-OAD-002 — Menonaktifkan organisasi
- **Aktor:** Pengguna berwenang
- **Tujuan:** Menghentikan organisasi dari penggunaan aktif bila diperlukan
- **Nilai Bisnis:** Administrasi organisasi dapat dikendalikan dari dalam aplikasi
- **Prasyarat:** Pengguna punya hak deactivate organisasi
- **Alur Utama:**
  1. Pengguna memilih aksi nonaktifkan organisasi.
  2. Sistem memproses perubahan status organisasi.
- **Alur Alternatif:**
  1. Pengguna membatalkan tindakan sebelum diproses.
- **Kasus Tepi / Kondisi Gagal:**
  - pengguna tidak berwenang
- **Kriteria Penerimaan:**
  - organisasi dapat dinonaktifkan oleh pengguna yang tepat


---

## Keanggotaan & Perpindahan Organisasi


### Ringkasan Modul
Modul ini memastikan pengguna dapat bekerja pada organisasi yang tepat dan berganti konteks bila perlu.

### Daftar Cerita Pengguna Utama

### US-OMS-001 — Berpindah organisasi aktif
- **Aktor:** Pengguna dengan lebih dari satu organisasi
- **Tujuan:** Mengganti konteks kerja
- **Nilai Bisnis:** Pengguna dapat mengelola banyak organisasi dari satu akun
- **Prasyarat:** Pengguna punya membership pada beberapa organisasi
- **Alur Utama:**
  1. Pengguna membuka pemilih organisasi.
  2. Pengguna memilih organisasi baru.
  3. Sistem mengganti organisasi aktif.
- **Alur Alternatif:**
  1. Pengguna tetap pada organisasi saat ini bila batal.
- **Kasus Tepi / Kondisi Gagal:**
  - organisasi tidak lagi dapat diakses
- **Kriteria Penerimaan:**
  - data aplikasi mengikuti organisasi aktif yang dipilih


---

## Onboarding Organisasi


### Ringkasan Modul
Modul ini membantu setup awal organisasi baru melalui langkah bertahap.

### Daftar Cerita Pengguna Utama

### US-OON-001 — Menyelesaikan onboarding organisasi bertahap
- **Aktor:** `Owner` atau admin onboarding
- **Tujuan:** Menyiapkan organisasi agar siap dipakai
- **Nilai Bisnis:** Implementasi awal sistem pada organisasi baru menjadi lebih cepat
- **Prasyarat:** Organisasi tersedia dan pengguna punya akses onboarding
- **Alur Utama:**
  1. Pengguna membuka langkah onboarding.
  2. Pengguna menyimpan profile, plan, locale, asset code, dan import sesuai kebutuhan.
  3. Sistem menyimpan setiap langkah.
- **Alur Alternatif:**
  1. Pengguna menyelesaikan onboarding sebagian demi sebagian.
- **Kasus Tepi / Kondisi Gagal:**
  - data wajib belum lengkap
- **Kriteria Penerimaan:**
  - setiap langkah onboarding dapat disimpan


---

## Halaman Publik QR Aset


### Ringkasan Modul
Modul ini menyediakan akses cepat berbasis token ke detail aset yang dibagikan melalui QR.

### Daftar Cerita Pengguna Utama

### US-QRP-001 — Membuka detail aset dari token QR
- **Aktor:** Pengguna yang memiliki link atau token QR aset
- **Tujuan:** Melihat data aset tanpa login biasa
- **Nilai Bisnis:** Identifikasi aset di lapangan menjadi lebih cepat
- **Prasyarat:** Token QR masih valid
- **Alur Utama:**
  1. Pengguna membuka link QR.
  2. Sistem menampilkan detail aset publik.
- **Alur Alternatif:**
  1. Sistem juga menampilkan lampiran bila tersedia.
- **Kasus Tepi / Kondisi Gagal:**
  - token tidak valid
  - token sudah dirotasi
- **Kriteria Penerimaan:**
  - token valid membuka halaman aset publik
  - token tidak valid ditolak


---

## Pemindaian QR


### Ringkasan Modul
Modul ini membantu pengguna internal membaca QR aset dari browser.

### Daftar Cerita Pengguna Utama

### US-QRS-001 — Memindai QR aset dengan kamera browser
- **Aktor:** Pengguna internal
- **Tujuan:** Membuka aset atau alur kerja berbasis token secara cepat
- **Nilai Bisnis:** Proses lapangan menjadi lebih efisien
- **Prasyarat:** Pengguna login dan perangkat mendukung kamera
- **Alur Utama:**
  1. Pengguna membuka fitur scan.
  2. Pengguna mengarahkan kamera ke QR.
  3. Sistem membaca token dan membuka alur target.
- **Alur Alternatif:**
  1. Pengguna menyalakan flashlight bila perangkat mendukung.
- **Kasus Tepi / Kondisi Gagal:**
  - izin kamera ditolak
  - browser tidak mendukung pemindai native
- **Kriteria Penerimaan:**
  - scanner dapat dipakai pada browser/perangkat yang didukung
  - hasil scan membuka alur target yang sesuai

### US-QRS-002 — Memasukkan token manual saat scanner tidak didukung
- **Aktor:** Pengguna internal
- **Tujuan:** Tetap bisa memakai alur QR tanpa pemindai native
- **Nilai Bisnis:** Fitur scan tetap dapat digunakan pada lebih banyak perangkat
- **Prasyarat:** Pengguna memiliki token atau URL QR yang valid
- **Alur Utama:**
  1. Pengguna membuka dialog/halaman scan.
  2. Pengguna memasukkan token atau URL QR secara manual.
  3. Sistem memvalidasi input.
  4. Sistem membuka alur target.
- **Alur Alternatif:**
  1. Pengguna memperbaiki input bila tidak valid.
- **Kasus Tepi / Kondisi Gagal:**
  - token manual tidak valid
- **Kriteria Penerimaan:**
  - fallback manual dapat dipakai pada browser yang tidak mendukung scanner


---

## Manajemen Izin Akses


### Ringkasan Modul
Modul ini mengatur pembentukan role platform dan daftar permission yang mengendalikan akses aplikasi.

### Daftar Cerita Pengguna Utama

### US-RPM-001 — Membuat atau memperbarui role platform
- **Aktor:** Admin berwenang
- **Tujuan:** Menyusun role yang sesuai kebutuhan organisasi
- **Nilai Bisnis:** Pengaturan akses menjadi lebih fleksibel dan terkontrol
- **Prasyarat:** Pengguna punya akses manajemen role
- **Alur Utama:**
  1. Admin membuka daftar role.
  2. Admin membuat atau memperbarui role.
  3. Admin memilih permission yang relevan.
  4. Sistem menyimpan role.
- **Alur Alternatif:**
  1. Admin hanya meninjau role yang sudah ada.
- **Kasus Tepi / Kondisi Gagal:**
  - nama role duplikat
- **Kriteria Penerimaan:**
  - role dapat dibuat dan diperbarui


---

## SSO, Delegasi, & Impersonation


### Ringkasan Modul
Modul ini menyediakan login berbasis provider eksternal dan pelimpahan akses operasional sementara.

### Daftar Cerita Pengguna Utama

### US-SSO-001 — Login melalui SSO
- **Aktor:** Pengguna dengan akses provider SSO
- **Tujuan:** Masuk ke aplikasi tanpa login manual biasa
- **Nilai Bisnis:** Onboarding dan pengalaman akses menjadi lebih praktis
- **Prasyarat:** Provider SSO dikonfigurasi dan akun pengguna sesuai
- **Alur Utama:**
  1. Pengguna memilih login SSO.
  2. Sistem mengarahkan pengguna ke provider.
  3. Pengguna menyelesaikan autentikasi di provider.
  4. Sistem menyelesaikan callback dan memberi akses.
- **Alur Alternatif:**
  1. Pengguna kembali ke login biasa bila SSO tidak berhasil.
- **Kasus Tepi / Kondisi Gagal:**
  - provider gagal
  - akun tidak cocok dengan data sistem
- **Kriteria Penerimaan:**
  - redirect dan callback SSO dapat dipakai sesuai konfigurasi

### US-SSO-002 — Mendelegasikan akses sementara
- **Aktor:** Pemberi delegasi, penerima delegasi, approver bila ada
- **Tujuan:** Menitipkan tanggung jawab operasional untuk periode tertentu
- **Nilai Bisnis:** Operasional tetap berjalan saat penanggung jawab utama tidak tersedia
- **Prasyarat:** Delegasi diizinkan sistem
- **Alur Utama:**
  1. Pengguna membuat delegasi.
  2. Delegasi disetujui/diaktifkan.
  3. Penerima delegasi memakai akses tersebut.
  4. Delegasi dihentikan atau dicabut.
- **Alur Alternatif:**
  1. Delegasi dibatalkan sebelum dipakai.
- **Kasus Tepi / Kondisi Gagal:**
  - approver menolak
  - delegasi tidak valid
- **Kriteria Penerimaan:**
  - delegasi dapat dibuat dan dikelola sesuai alur
  - akses delegation dapat dihentikan kembali


---

## Manajemen Akses Pengguna


### Ringkasan Modul
Modul ini mengelola pengguna yang dapat masuk dan beroperasi di dalam aplikasi.

### Daftar Cerita Pengguna Utama

### US-UAM-001 — Mengelola pengguna aplikasi
- **Aktor:** `Owner` atau `Admin`
- **Tujuan:** Menambah, melihat, dan memperbarui pengguna
- **Nilai Bisnis:** Akses anggota organisasi dapat dijaga tetap akurat
- **Prasyarat:** Pengguna punya hak kelola pengguna
- **Alur Utama:**
  1. Admin membuka daftar pengguna.
  2. Admin membuat atau memperbarui pengguna.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Admin membuka detail pengguna untuk review.
- **Kasus Tepi / Kondisi Gagal:**
  - data pengguna tidak valid
- **Kriteria Penerimaan:**
  - pengguna dapat dibuat, diubah, dan dilihat oleh admin berwenang

### US-UAM-002 — Mengundang pengguna ke sistem atau organisasi
- **Aktor:** Admin berwenang
- **Tujuan:** Menambahkan pengguna melalui mekanisme undangan
- **Nilai Bisnis:** Onboarding pengguna baru menjadi lebih terkontrol
- **Prasyarat:** Pengguna punya hak invitation
- **Alur Utama:**
  1. Admin memicu pembuatan undangan.
  2. Sistem membuat alur undangan.
  3. Pengguna yang diundang menerima dan memproses undangan.
- **Alur Alternatif:**
  1. Undangan tidak dipakai sampai kadaluarsa atau dibatalkan secara operasional.
- **Kasus Tepi / Kondisi Gagal:**
  - data undangan tidak valid
- **Kriteria Penerimaan:**
  - undangan pengguna dapat dibuat dari area administrasi yang sesuai


---

## Kontrak Vendor


### Ringkasan Modul
Modul ini menangani pencatatan kontrak vendor yang berkaitan dengan aset atau layanan operasional.

### Daftar Cerita Pengguna Utama

### US-VCT-001 — Mengelola kontrak vendor
- **Aktor:** Admin operasional atau procurement
- **Tujuan:** Menyimpan kontrak vendor yang relevan
- **Nilai Bisnis:** Organisasi dapat menelusuri dukungan vendor terhadap aset
- **Prasyarat:** Pengguna punya akses kontrak vendor
- **Alur Utama:**
  1. Pengguna membuka kontrak vendors.
  2. Pengguna membuat atau memperbarui kontrak.
  3. Sistem menyimpan kontrak.
- **Alur Alternatif:**
  1. Pengguna hanya melihat detail kontrak.
- **Kasus Tepi / Kondisi Gagal:**
  - data kontrak tidak valid
- **Kriteria Penerimaan:**
  - kontrak vendor dapat dibuat, diubah, dan dilihat


---

## Garansi & Klaim


### Ringkasan Modul
Modul ini membantu pengelolaan perlindungan warranty aset dan klaim yang terkait.

### Daftar Cerita Pengguna Utama

### US-WAR-001 — Melihat status warranty aset
- **Aktor:** Admin aset atau operator berwenang
- **Tujuan:** Mengetahui apakah aset masih terlindungi warranty
- **Nilai Bisnis:** Tindakan maintenance atau klaim bisa diambil lebih cepat
- **Prasyarat:** Aset memiliki data warranty yang relevan
- **Alur Utama:**
  1. Pengguna membuka detail aset.
  2. Sistem menampilkan status warranty.
- **Alur Alternatif:**
  1. Pengguna meninjau history klaim bila ada.
- **Kasus Tepi / Kondisi Gagal:**
  - data warranty belum lengkap
- **Kriteria Penerimaan:**
  - status warranty dapat dilihat pada aset yang relevan

### US-WAR-002 — Membuat atau memperbarui klaim warranty
- **Aktor:** Pengguna berwenang
- **Tujuan:** Mendokumentasikan klaim warranty aset
- **Nilai Bisnis:** Riwayat klaim tersimpan dan dapat ditindaklanjuti
- **Prasyarat:** Pengguna punya akses ke aset dan klaim garansi
- **Alur Utama:**
  1. Pengguna membuka area warranty pada aset.
  2. Pengguna mengisi atau memperbarui klaim.
  3. Sistem menyimpan data klaim.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau klaim lama.
- **Kasus Tepi / Kondisi Gagal:**
  - data klaim tidak lengkap
- **Kriteria Penerimaan:**
  - klaim warranty dapat dibuat dan diperbarui


---

## Lampiran Perintah Kerja


### Ringkasan Modul
Modul ini mengelola lampiran yang menjadi bukti pekerjaan perintah kerja.

### Daftar Cerita Pengguna Utama

### US-WAT-001 — Menambahkan lampiran ke perintah kerja
- **Aktor:** Teknisi atau supervisor maintenance
- **Tujuan:** Menyimpan bukti pekerjaan atau dokumen pendukung
- **Nilai Bisnis:** Hasil kerja dapat diverifikasi lebih mudah
- **Prasyarat:** Perintah kerja tersedia dan pengguna punya akses perbarui
- **Alur Utama:**
  1. Pengguna membuka detail perintah kerja.
  2. Pengguna mengunggah lampiran.
  3. Sistem menyimpan dan menampilkan lampiran.
- **Alur Alternatif:**
  1. Pengguna menambah lebih dari satu lampiran sesuai kebutuhan.
- **Kasus Tepi / Kondisi Gagal:**
  - file tidak valid
- **Kriteria Penerimaan:**
  - lampiran perintah kerja dapat ditambahkan

### US-WAT-002 — Menghapus lampiran perintah kerja
- **Aktor:** Pengguna berwenang
- **Tujuan:** Membersihkan lampiran yang tidak relevan
- **Nilai Bisnis:** Dokumentasi pekerjaan tetap rapi dan tepat guna
- **Prasyarat:** Attachment sudah ada
- **Alur Utama:**
  1. Pengguna memilih lampiran pada perintah kerja.
  2. Pengguna menjalankan aksi hapus.
  3. Sistem menghapus lampiran.
- **Alur Alternatif:**
  1. Pengguna hanya meninjau lampiran tanpa menghapusnya.
- **Kasus Tepi / Kondisi Gagal:**
  - pengguna tidak punya hak hapus
- **Kriteria Penerimaan:**
  - lampiran dapat dihapus oleh pengguna berwenang


---

## Eksekusi Perintah Kerja


### Ringkasan Modul
Modul ini menangani pelaksanaan inti perintah kerja oleh supervisor dan teknisi.

### Daftar Cerita Pengguna Utama

### US-WEX-001 — Menugaskan teknisi dan memperbarui progres perintah kerja
- **Aktor:** Supervisor maintenance atau teknisi
- **Tujuan:** Menjalankan pekerjaan dan memantau progresnya
- **Nilai Bisnis:** Pekerjaan maintenance dapat dikontrol dari awal sampai akhir
- **Prasyarat:** Perintah kerja sudah tersedia
- **Alur Utama:**
  1. Supervisor membuka detail perintah kerja.
  2. Supervisor menetapkan teknisi bila diperlukan.
  3. Teknisi atau supervisor memperbarui progres pekerjaan.
  4. Sistem menyimpan progres.
- **Alur Alternatif:**
  1. Teknisi melihat daftar `perintah kerja saya`.
- **Kasus Tepi / Kondisi Gagal:**
  - pengguna tidak punya hak perbarui
- **Kriteria Penerimaan:**
  - progres perintah kerja dapat diubah oleh pengguna berwenang

### US-WEX-002 — Menutup perintah kerja
- **Aktor:** Pengguna berwenang
- **Tujuan:** Menyelesaikan atau membatalkan pekerjaan maintenance
- **Nilai Bisnis:** Status akhir pekerjaan terdokumentasi jelas
- **Prasyarat:** Perintah kerja berada pada status yang dapat ditutup
- **Alur Utama:**
  1. Pengguna membuka detail perintah kerja.
  2. Pengguna memilih selesai atau batal.
  3. Pengguna mengisi data wajib bila diminta.
  4. Sistem menyimpan status akhir.
- **Alur Alternatif:**
  1. Pengguna menunda penutupan hingga data lengkap.
- **Kasus Tepi / Kondisi Gagal:**
  - catatan wajib belum diisi
- **Kriteria Penerimaan:**
  - perintah kerja tidak bisa ditutup bila syarat wajib belum dipenuhi


---

## Tugas & Biaya Perintah Kerja


### Ringkasan Modul
Modul ini menangani rincian task dan biaya di dalam perintah kerja.

### Daftar Cerita Pengguna Utama

### US-WTC-001 — Mengelola task perintah kerja
- **Aktor:** Supervisor maintenance atau teknisi
- **Tujuan:** Memecah pekerjaan menjadi task yang dapat dipantau
- **Nilai Bisnis:** Progres pekerjaan menjadi lebih terukur
- **Prasyarat:** Perintah kerja tersedia dan pengguna punya akses perbarui
- **Alur Utama:**
  1. Pengguna membuka detail perintah kerja.
  2. Pengguna menambah atau memperbarui task.
  3. Pengguna memperbarui completion task.
  4. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna hanya menandai task selesai tanpa menambah task baru.
- **Kasus Tepi / Kondisi Gagal:**
  - task tidak valid
- **Kriteria Penerimaan:**
  - task dapat dikelola pada perintah kerja yang valid

### US-WTC-002 — Mengelola biaya perintah kerja
- **Aktor:** Pengguna berwenang
- **Tujuan:** Mencatat biaya pekerjaan maintenance
- **Nilai Bisnis:** Biaya maintenance dapat ditinjau lebih akurat
- **Prasyarat:** Perintah kerja tersedia dan pengguna punya akses perbarui
- **Alur Utama:**
  1. Pengguna membuka area biaya perintah kerja.
  2. Pengguna menambah atau memperbarui baris biaya.
  3. Sistem menyimpan perubahan.
- **Alur Alternatif:**
  1. Pengguna menghapus baris biaya yang salah.
- **Kasus Tepi / Kondisi Gagal:**
  - data biaya tidak valid
- **Kriteria Penerimaan:**
  - baris biaya dapat ditambah, diubah, dan dihapus oleh pengguna berwenang


---

## Perintah Kerja


### Ringkasan Modul
Modul ini adalah pintu utama pembuatan dan daftar perintah kerja maintenance.

### Daftar Cerita Pengguna Utama

### US-WO-001 — Membuat perintah kerja maintenance
- **Aktor:** Admin atau supervisor maintenance
- **Tujuan:** Membuat unit kerja maintenance untuk aset tertentu
- **Nilai Bisnis:** Pekerjaan maintenance menjadi terstruktur dan dapat ditugaskan
- **Prasyarat:** Pengguna punya hak tambah perintah kerja
- **Alur Utama:**
  1. Pengguna membuka tambah perintah kerja.
  2. Pengguna memilih aset dan mengisi data perintah kerja.
  3. Sistem menyimpan perintah kerja.
- **Alur Alternatif:**
  1. Pengguna memulai tambah perintah kerja dari token aset.
- **Kasus Tepi / Kondisi Gagal:**
  - aset tidak terlihat pengguna
  - data perintah kerja tidak lengkap
- **Kriteria Penerimaan:**
  - perintah kerja dapat dibuat
  - perintah kerja muncul di daftar dan bisa dibuka detailnya

### US-WO-002 — Menelusuri daftar perintah kerja
- **Aktor:** Admin, supervisor, atau pengguna berwenang
- **Tujuan:** Menemukan pekerjaan maintenance yang sedang dipantau
- **Nilai Bisnis:** Monitoring pekerjaan menjadi lebih efisien
- **Prasyarat:** Pengguna punya akses lihat perintah kerja
- **Alur Utama:**
  1. Pengguna membuka daftar perintah kerja.
  2. Pengguna mencari atau meninjau daftar perintah kerja.
  3. Pengguna membuka perintah kerja yang diinginkan.
- **Alur Alternatif:**
  1. Pengguna teknisi membuka `perintah kerja saya` untuk daftar yang lebih personal.
- **Kasus Tepi / Kondisi Gagal:**
  - tidak ada perintah kerja yang cocok dengan pencarian
- **Kriteria Penerimaan:**
  - daftar perintah kerja dapat dibuka
  - pencarian perintah kerja bekerja pada data yang tersedia di UI

