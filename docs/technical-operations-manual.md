# Manual Operasional Teknis Asetku

Dokumen ini adalah panduan operasional teknis yang ditujukan untuk tim operasional, admin aplikasi, dan tim internal yang perlu memahami penggunaan sistem Asetku secara menyeluruh.

## 1. Gambaran Sistem

Asetku adalah sistem manajemen aset multi-organisasi yang mendukung pencatatan aset, QR publik dan pemindaian, siklus hidup aset, disposal, depresiasi, maintenance, perintah kerja, laporan, notifikasi, pengaturan aplikasi, audit, dan pengelolaan media pendukung.

Sistem bekerja dengan prinsip utama berikut:
- hampir seluruh data bisnis mengikuti **organisasi aktif** pengguna
- akses fitur dikendalikan oleh kombinasi **role platform**, **permission**, dan **role organisasi aktif**
- aset menjadi pusat relasi untuk QR, siklus hidup, maintenance, garansi, depresiasi, dan sebagian besar laporan
- notifikasi, riwayat aktivitas, dan audit trail dipakai untuk menjaga keterlacakan aktivitas operasional

## 2. Peran Pengguna dan Hak Akses

### Role Utama
- `Owner`: otoritas tertinggi di level organisasi
- `Admin`: pengelola operasional dan administrasi organisasi
- `Manager`: pengelola dengan hak operasional terbatas dibanding `Owner`/`Admin`
- `Member`: pengguna operasional atau staf dengan akses sesuai cakupan tugas
- `super-admin`: akses penuh di level platform untuk kebutuhan administrasi sistem

### Prinsip Akses
- hak akses efektif pengguna berasal dari kombinasi permission platform dan role organisasi aktif
- pengguna hanya dapat melihat data dalam organisasi aktif yang dapat diaksesnya
- beberapa modul menggunakan gate atau izin khusus, terutama untuk laporan dan pengaturan
- tidak semua aksi tersedia untuk semua pengguna, walaupun pengguna dapat melihat modul terkait

### Matriks Akses Tingkat Tinggi
| Area | Owner | Admin | Manager | Member |
| --- | --- | --- | --- | --- |
| Organisasi & pengaturan awal | Ya | Umumnya ya | Terbatas | Tidak umum |
| Cabang & master data | Ya | Ya | Sebagian | Lihat sesuai izin |
| Registri aset | Ya | Ya | Ya | Lihat sesuai cakupan |
| Detail/siklus hidup aset | Ya | Ya | Ya | Lihat / sebagian aksi |
| Disposal | Ya | Ya | Sebagian | Terbatas |
| Depresiasi | Ya | Ya | Terbatas | Lihat bila diizinkan |
| Maintenance & perintah kerja | Ya | Ya | Ya | Sesuai penugasan/cakupan |
| Laporan | Ya | Ya | Sebagian | Lihat bila diizinkan |
| Notifikasi | Ya | Ya | Ya | Ya |
| Settings | Ya | Ya | Umumnya tidak | Tidak |
| Audit | Ya | Ya | Terbatas | Terbatas |

> Catatan: matriks ini adalah panduan operasional tingkat tinggi. Hak aktual tetap mengikuti permission dan role efektif pada aplikasi.

## 3. Peta Modul Sistem

### A. Akses & Struktur Organisasi
- Autentikasi
- Akun & Profil
- SSO, Delegasi, & Impersonation
- Administrasi Organisasi
- Onboarding Organisasi
- Keanggotaan & Perpindahan Organisasi
- Cabang
- Manajemen Izin Akses
- Manajemen Akses Pengguna

### B. Data Dasar & Data Aset
- Master Data Struktural Aset
- Master Data Operasional Aset
- Registri Aset
- Detail & Aksi Aset
- Label & Ekspor Aset
- Lampiran Aset

### C. Identifikasi & Operasi Aset
- Halaman Publik QR Aset
- Pemindaian QR
- Operasi Status & Kondisi Aset
- Mutasi & Peristiwa Aset
- Disposal / Penghapusan Aset

### D. Kontrak, Garansi, dan Nilai Aset
- Kontrak Vendor
- Garansi & Klaim
- Depresiasi

### E. Maintenance & Perintah Kerja
- Kalender Maintenance & Checklist
- Jadwal Maintenance
- Perintah Kerja
- Eksekusi Perintah Kerja
- Tugas & Biaya Perintah Kerja
- Lampiran Perintah Kerja

### F. Monitoring, Laporan, dan Dukungan Sistem
- Laporan Inventaris
- Laporan Maintenance
- Pusat Notifikasi
- Preferensi Notifikasi
- Pengiriman Notifikasi Email
- Pengaturan Aplikasi
- Pengaturan Email
- Flag Fitur
- Jadwal Audit
- Temuan Audit
- Unggah Media
- Konteks Penggunaan Media
- Aktivitas & Monitoring Pengguna

## 4. SOP Operasional per Area

### 4.1 Memulai Penggunaan Sistem
1. Pengguna login ke aplikasi melalui autentikasi standar atau SSO jika tersedia.
2. Jika pengguna memiliki akses ke beberapa organisasi, pengguna memilih organisasi aktif.
3. Pengguna memastikan profil, preferensi notifikasi, dan konteks akun sudah sesuai.
4. Admin organisasi menyelesaikan pengaturan awal organisasi jika organisasi masih dalam tahap setup awal.

### 4.2 Menyiapkan Fondasi Data
1. Admin menyiapkan cabang organisasi.
2. Admin menyiapkan master data struktural aset seperti kategori, status, kondisi, kelas, unit, dan lokasi.
3. Admin menyiapkan master data operasional seperti departemen, PIC, pengguna aset, vendor, dan garansi.
4. Admin memastikan data referensi cukup sebelum pencatatan aset dimulai.

### 4.3 Pencatatan dan Pengelolaan Aset
1. Admin aset membuat aset baru pada registri aset.
2. Sistem menyimpan identitas aset, termasuk kode dan token QR sesuai aturan aktif.
3. Pengguna membuka detail aset untuk review data lengkap.
4. Jika diperlukan, pengguna menambahkan lampiran, mencetak label, menyalin tautan QR, atau membuka halaman QR publik aset.
5. Pengguna berwenang dapat memperbarui data aset atau menghapus aset sesuai hak akses.

### 4.4 Pemakaian QR dalam Operasional
1. Pengguna membuka halaman QR publik aset bila memiliki token atau tautan yang valid.
2. Pengguna internal dapat memindai QR dari browser melalui halaman scan atau dialog scan.
3. Jika browser tidak mendukung pemindai native, pengguna memakai input token manual.
4. Pengguna berwenang dapat melakukan regenerasi token QR dari detail aset bila token lama dianggap tidak aman.

### 4.5 Operasi Lifecycle Aset
1. Pengguna mencari atau membuka aset melalui halaman siklus hidup aset.
2. Pengguna mencatat perubahan status atau kondisi sesuai kejadian lapangan.
3. Sistem memvalidasi aturan transisi status yang berlaku.
4. Pengguna mencatat mutasi, peminjaman, pengembalian, atau peristiwa siklus hidup lain bila diperlukan.
5. Sistem menyimpan riwayat agar perubahan dapat ditelusuri kembali.

### 4.6 Disposal Aset
1. Pengguna berwenang membuat permintaan disposal untuk aset.
2. Disposal dapat dimulai dari halaman tambah disposal atau dari token aset yang valid.
3. Approver meninjau detail disposal.
4. Approver menyetujui atau menolak disposal sesuai proses operasional.
5. Dokumen berita acara disposal digunakan bila diperlukan oleh proses internal.

### 4.7 Kontrak Vendor, Garansi, dan Klaim
1. Admin operasional mengelola kontrak vendor yang terkait aset.
2. Admin atau operator memantau status garansi aset pada detail aset.
3. Jika terjadi kebutuhan klaim, pengguna membuat atau memperbarui klaim garansi pada aset terkait.
4. Data kontrak dan garansi dipakai sebagai konteks untuk maintenance dan tindak lanjut vendor.

### 4.8 Depresiasi
1. Pengguna berwenang meninjau daftar data depresiasi atau run depresiasi.
2. Pengguna membuka detail depresiasi per aset bila diperlukan.
3. Pengguna menjalankan proses atau ekspor depresiasi sesuai entry point yang tersedia.
4. Nilai buku dan histori depresiasi dipakai sebagai referensi keuangan internal.

### 4.9 Maintenance Preventif
1. Planner atau admin maintenance membuat jadwal maintenance untuk aset.
2. Sistem dapat memanfaatkan default schedule dari kategori aset bila relevan.
3. Pengguna meninjau kalender maintenance.
4. Pengguna melakukan reschedule bila diperlukan.
5. Checklist maintenance disiapkan agar pekerjaan lebih konsisten.

### 4.10 Perintah Kerja Maintenance
1. Admin atau supervisor membuat perintah kerja untuk aset tertentu.
2. Perintah kerja dapat dimulai dari aset atau token aset yang valid.
3. Supervisor menugaskan teknisi.
4. Teknisi atau supervisor memperbarui progres, tugas, biaya, dan lampiran pekerjaan.
5. Saat pekerjaan selesai atau dibatalkan, pengguna berwenang menutup perintah kerja dengan memenuhi data wajib yang diminta sistem.

### 4.11 Laporan Operasional
1. Pengguna berwenang membuka laporan inventaris untuk memantau kondisi inventaris.
2. Pengguna memakai stocktake print bila dibutuhkan untuk lapangan.
3. Pengguna membuka laporan maintenance untuk memantau perintah kerja dan biaya maintenance.
4. Laporan dipakai sebagai bahan evaluasi operasional dan pengambilan keputusan.

### 4.12 Notifikasi dan Komunikasi Sistem
1. Pengguna memantau pusat notifikasi untuk peristiwa penting dalam aplikasi.
2. Pengguna menyesuaikan preferensi notifikasi pribadi.
3. Sistem mengirim notifikasi email untuk event tertentu bila kanal email aktif dan konfigurasi benar.
4. Admin memakai test email dari pengaturan email untuk validasi pengiriman.

### 4.13 Pengaturan Sistem
1. Admin memperbarui pengaturan aplikasi umum bila diperlukan.
2. Admin memperbarui konfigurasi email sistem.
3. Admin mengelola flag fitur yang tersedia pada pengaturan.
4. Perubahan pengaturan harus dilakukan hati-hati karena dapat memengaruhi perilaku sistem secara langsung.

### 4.14 Audit dan Monitoring
1. Auditor atau admin berwenang membuat dan meninjau jadwal audit.
2. Auditor membuat temuan audit bila ditemukan isu yang perlu didokumentasikan.
3. Admin meninjau aktivitas sistem melalui activity & monitoring pengguna.
4. Riwayat pada aset dan modul terkait dipakai untuk penelusuran operasional bila dibutuhkan.

## 5. Alur Antar Modul

### Alur Dasar Pencatatan Aset
Organisasi aktif → cabang & master data → registri aset → detail aset → QR/label → siklus hidup/maintenance/pelaporan

### Alur Maintenance Aset
Aset → jadwal maintenance → kalender/checklist → perintah kerja → teknisi/progres → biaya/lampiran → laporan maintenance

### Alur Disposal
Aset → review kondisi/status → permintaan disposal → approval disposal → berita acara / tindak lanjut operasional

### Alur Vendor dan Garansi
Master data vendor/garansi → kontrak vendor / data garansi aset → klaim garansi → tindak lanjut operasional

### Alur Notifikasi
Event bisnis → notifikasi dalam aplikasi → preferensi pengguna → email notifikasi bila relevan dan terkonfigurasi

## 6. Notifikasi dan Eskalasi

Jenis notifikasi yang penting secara operasional umumnya terkait:
- perintah kerja
- maintenance schedule/reminder
- undangan pengguna
- keamanan akun tertentu
- event audit atau event operasional yang relevan

Panduan operasional:
- pastikan pengguna yang kritis sudah meninjau preferensi notifikasinya
- pastikan pengaturan email telah divalidasi dengan test email
- bila ada keterlambatan respons pada pekerjaan maintenance, gunakan laporan dan notifikasi bersama-sama untuk eskalasi internal

## 7. Laporan dan Monitoring

### Laporan Inventaris
Dipakai untuk:
- memantau kondisi inventaris
- melihat data berdasarkan filter yang tersedia
- mendukung stocktake lapangan

### Laporan Maintenance
Dipakai untuk:
- memantau performa perintah kerja
- meninjau biaya maintenance
- membantu evaluasi supervisor dan manajemen

### Monitoring Aktivitas
Dipakai untuk:
- meninjau perubahan penting pada sistem
- menelusuri aktivitas pada aset dan modul terkait
- membantu audit operasional dan troubleshooting

## 8. Batasan Sistem Saat Ini

- hak akses detail selalu mengikuti permission dan role efektif pengguna
- sebagian alur operasional hanya tersedia untuk organisasi aktif
- beberapa transisi status aset dibatasi oleh aturan sistem
- dukungan pemindaian QR bergantung pada browser dan perangkat
- email notifikasi bergantung pada konfigurasi email yang benar
- sebagian modul audit yang ada saat ini berfokus pada pencatatan schedule dan finding, belum seluruh siklus follow-up audit
- laporan yang tersedia berfokus pada monitoring operasional, belum business intelligence penuh

## 9. Troubleshooting Operasional Dasar

### Pengguna tidak melihat data yang seharusnya ada
Periksa:
- organisasi aktif pengguna
- hak akses pengguna
- cakupan visibilitas data pada modul terkait

### QR tidak bisa dibuka atau dipindai
Periksa:
- apakah token QR masih valid
- apakah token sudah pernah diregenerasi
- apakah browser/perangkat mendukung kamera
- gunakan input token manual bila pemindai native tidak tersedia

### Email notifikasi tidak masuk
Periksa:
- konfigurasi pada pengaturan email
- hasil test email
- preferensi notifikasi pengguna
- apakah event sumber memang memicu email

### Perintah kerja tidak dapat ditutup
Periksa:
- status perintah kerja saat ini
- data wajib seperti catatan internal atau progres/tugas yang dibutuhkan sistem
- hak akses pengguna yang mencoba menutup pekerjaan

### Pengguna tidak bisa berpindah organisasi
Periksa:
- apakah pengguna masih menjadi anggota organisasi tujuan
- apakah organisasi tujuan masih aktif dan dapat diakses

### Laporan kosong atau tidak sesuai ekspektasi
Periksa:
- filter yang sedang aktif
- organisasi aktif
- ketersediaan data sumber pada aset, maintenance, atau perintah kerja

## 10. Glosarium Istilah

- **Organisasi aktif**: organisasi yang sedang menjadi konteks kerja pengguna saat ini
- **Role organisasi**: peran pengguna di dalam organisasi aktif, mis. `Owner`, `Admin`, `Manager`, `Member`
- **Permission platform**: izin akses yang dikelola melalui role/permission level aplikasi
- **QR token**: token rahasia yang dipakai untuk membuka halaman QR publik aset
- **Siklus hidup aset**: perubahan status, kondisi, pergerakan, dan peristiwa penting pada aset
- **Disposal**: proses bisnis untuk penghapusan aset secara terkontrol
- **Jadwal maintenance**: rencana preventive maintenance aset
- **Perintah kerja**: unit eksekusi pekerjaan maintenance
- **Checklist maintenance**: daftar tugas standar untuk pekerjaan maintenance
- **Lampiran**: foto atau dokumen pendukung yang melekat pada aset atau perintah kerja
- **Temuan audit**: catatan isu atau temuan dari proses audit

## 11. Referensi Dokumen Pendukung

- `docs/user-stories/` untuk cerita pengguna per modul
- `docs/developer-experience.md` untuk dokumentasi developer experience, bila dibutuhkan oleh tim teknis
- `docs/README.md` sebagai indeks dokumentasi utama
