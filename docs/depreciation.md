# Dokumentasi Penyusutan Aset Asetku

Dokumen ini menjelaskan implementasi penyusutan aset yang **saat ini berjalan** di sistem Asetku, mulai dari pengisian field saat pembuatan aset, pewarisan default dari kategori, cara kerja masing-masing metode, sampai flow posting penyusutan periodik.

## Ringkasan

- Parameter penyusutan disimpan di level aset.
- Saat membuat aset, sistem **belum langsung mem-post penyusutan**.
- Penyusutan dihitung saat modul depreciation run dijalankan.
- Sistem saat ini mendukung 5 metode penyusutan di level aset:
  - `straight_line`
  - `diminishing`
  - `double_declining`
  - `syd`
  - `units_of_production`

## Field Penyusutan pada Aset

Field utama yang dipakai sistem:

- `depreciation_method`
- `useful_life_months`
- `residual_value`
- `production_units_total_estimate`
- `production_units_unit`
- `purchase_date`
- `cost`
- `book_value_cached`

Makna field:

- `depreciation_method`: metode penyusutan yang dipakai aset.
- `useful_life_months`: umur ekonomis dalam bulan.
- `residual_value`: nilai residu atau batas bawah nilai buku.
- `production_units_total_estimate`: estimasi total kapasitas produksi selama umur aset, dipakai khusus metode produksi.
- `production_units_unit`: satuan kapasitas produksi, misalnya `hours`, `km`, `cycles`, atau unit lain yang relevan.
- `purchase_date`: tanggal perolehan aset.
- `cost`: harga perolehan aset.
- `book_value_cached`: cache nilai buku akhir terbaru, terutama relevan untuk metode berbasis usage.

## Flow Penyusutan dari Create Asset sampai Posting

### 1. Pembuatan aset

Saat user membuat aset baru:

1. Form create aset mengirim data dasar aset dan parameter penyusutan.
2. Request divalidasi.
3. Controller menormalkan relasi cabang/lokasi/departemen.
4. Controller menerapkan default dari kategori aset bila field depresiasi tertentu kosong.
5. Asset record dibuat.
6. History `created` dicatat.
7. Belum ada entry penyusutan yang dipost pada tahap ini.

Intinya: create asset hanya menyimpan **konfigurasi penyusutan**, bukan hasil perhitungannya.

### 2. Asset menjadi eligible untuk penyusutan

Aset baru bisa dihitung saat depreciation run bila minimal memenuhi kondisi berikut:

- `purchase_date` terisi
- `cost > 0`
- `useful_life_months > 0`
- `cost > residual_value`
- tanggal perolehan tidak melewati akhir periode run
- khusus `units_of_production`: ada `production_units_total_estimate > 0`

### 3. Depreciation run

Saat penyusutan dijalankan untuk suatu periode:

1. Sistem mengambil aset eligible.
2. Sistem menghitung nilai buku awal periode.
3. Sistem menghitung nilai buku akhir periode.
4. Selisih keduanya menjadi nilai penyusutan periode.
5. Sistem membuat `asset_depreciation_entries`.
6. Sistem memperbarui `book_value_cached`.
7. Jika nilai buku sudah mencapai residu, aset bisa memicu notifikasi terkait residu.

### 4. Pelacakan hasil

Hasil penyusutan bisa dilihat melalui halaman depreciation per aset dan data entry penyusutan per periode.

## Diagram Alur End-to-End

```text
[Create Asset Form]
        |
        v
[StoreAssetRequest Validation]
        |
        v
[AssetController::store]
        |
        +--> normalizeBranchAndRelations()
        |
        +--> applyCategoryDefaults()
        |
        v
[assets table]
        |
        +--> asset_histories: created
        |
        v
[Asset exists with depreciation config]
        |
        v
[Depreciation Run per period]
        |
        +--> AssetDepreciationCalculator
        |       |
        |       +--> validate eligibility
        |       +--> calculate by method
        |
        v
[asset_depreciation_entries]
        |
        +--> update book_value_cached
        |
        v
[Depreciation schedule / asset depreciation page]
```

## Input Penyusutan pada Form Create Asset

Pada form aset, user saat ini bisa memilih 5 metode:

- `straight_line`
- `diminishing`
- `double_declining`
- `syd`
- `units_of_production`

Field tampil di form:

- `depreciation_method`
- `useful_life_months`
- `residual_value`

Tambahan yang hanya muncul bila metode = `units_of_production`:

- `production_units_total_estimate`
- `production_units_unit`

### Catatan UX saat create

- User boleh membiarkan field depresiasi kosong.
- Jika kategori aset punya default depresiasi, sistem akan mengisi dari kategori.
- Jika field tetap kosong setelah create, aset mungkin belum bisa dihitung saat depreciation run.

## Default Penyusutan dari Kategori Aset

Kategori aset dapat memiliki default:

- `depreciation_method`
- `useful_life_months`
- `residual_value`

Saat create atau update asset:

- jika `depreciation_method` pada aset kosong, sistem memakai default kategori
- jika `useful_life_months` pada aset kosong, sistem memakai default kategori
- jika `residual_value` pada aset kosong, sistem memakai default kategori

Catatan:

- saat ini default kategori hanya tervalidasi untuk:
  - `straight_line`
  - `diminishing`
- sementara form aset mendukung 5 metode.
- ini berarti implementasi sistem saat ini **belum sepenuhnya konsisten** antara master data kategori dan level aset.

## Logika Kelayakan Penyusutan

Sistem akan men-skip penyusutan bila menemukan salah satu kondisi berikut:

- `missing_purchase_date`
- `missing_cost`
- `missing_useful_life`
- `not_acquired_yet`
- `already_at_residual`
- `no_depreciation_for_period`
- `missing_production_total_estimate`
- `missing_production_units_for_period`

Arti bisnis dari masing-masing kondisi:

- `missing_purchase_date`: belum diketahui kapan aset mulai dimiliki.
- `missing_cost`: tidak ada basis nilai awal penyusutan.
- `missing_useful_life`: umur ekonomis belum diset.
- `not_acquired_yet`: aset belum seharusnya masuk periode itu.
- `already_at_residual`: nilai buku sudah menyentuh nilai residu.
- `no_depreciation_for_period`: tidak ada perubahan nilai buku pada periode tersebut.
- `missing_production_total_estimate`: metode produksi dipilih tetapi total kapasitas belum diisi.
- `missing_production_units_for_period`: tidak ada usage log pada periode tersebut.

## Metode Penyusutan yang Saat Ini Ada

### 1. `straight_line` — Garis Lurus

#### Konsep

Biaya yang bisa disusutkan dibagi rata ke seluruh umur ekonomis aset.

#### Parameter yang dipakai

- `cost`
- `residual_value`
- `useful_life_months`
- `purchase_date`

#### Rumus implementasi

```text
depreciable = cost - residual_value
monthly_depreciation = depreciable / useful_life_months
book_value = cost - (monthly_depreciation * months_used)
```

#### Karakteristik

- paling sederhana
- beban penyusutan stabil setiap bulan
- cocok untuk aset umum yang manfaat ekonominya relatif merata sepanjang umur aset

#### Batas bawah

Nilai buku tidak boleh turun di bawah `residual_value`.

### 2. `diminishing` — Saldo Menurun

#### Konsep

Penyusutan lebih besar di awal dan makin mengecil di periode-periode akhir.

#### Parameter yang dipakai

- `cost`
- `residual_value`
- `useful_life_months`
- `purchase_date`

#### Rumus implementasi saat ini

```text
rate = (residual_value / cost) ^ (1 / useful_life_months)
book_value = cost * (rate ^ months_used)
```

#### Karakteristik

- penurunan nilai bersifat eksponensial
- depresiasi awal lebih besar daripada garis lurus
- mendekati nilai residu secara bertahap

#### Batas bawah

Nilai buku tidak boleh turun di bawah `residual_value`.

### 3. `double_declining` — Saldo Menurun Ganda

#### Konsep

Metode akselerasi yang lebih agresif daripada garis lurus dan umumnya lebih agresif daripada diminishing biasa di awal umur aset.

#### Parameter yang dipakai

- `cost`
- `residual_value`
- `useful_life_months`
- `purchase_date`

#### Rumus implementasi saat ini

```text
ratio = 1 - (2 / useful_life_months)
book_value = cost * (ratio ^ months_used)
```

#### Karakteristik

- depresiasi awal sangat besar
- cocok bila manfaat ekonomis aset paling besar di periode awal
- sistem test saat ini memang mengonfirmasi metode ini lebih agresif daripada `straight_line` pada fase awal

#### Batas bawah

Nilai buku tidak boleh turun di bawah `residual_value`.

### 4. `syd` — Sum of Years Digits / Jumlah Angka Tahun

#### Konsep

Penyusutan dipercepat dengan bobot lebih besar pada awal umur aset, tetapi dibagi dengan skema bobot bertingkat.

#### Parameter yang dipakai

- `cost`
- `residual_value`
- `useful_life_months`
- `purchase_date`

#### Implementasi saat ini

Implementasi di sistem memakai **granularity bulan**, bukan tahun.

```text
sum_digits = life_months * (life_months + 1) / 2
used_weight_sum = months_used * ((2 * life_months) - months_used + 1) / 2
depreciation_used = depreciable * (used_weight_sum / sum_digits)
book_value = cost - depreciation_used
```

#### Karakteristik

- penyusutan dipercepat di awal
- beban menurun bertahap secara terstruktur
- lebih “weighted” daripada garis lurus

#### Batas bawah

Nilai buku tidak boleh turun di bawah `residual_value`.

### 5. `units_of_production` — Satuan Produksi

#### Konsep

Penyusutan tidak bergantung pada umur waktu, tetapi pada tingkat pemakaian aktual aset.

#### Parameter yang dipakai

- `cost`
- `residual_value`
- `purchase_date`
- `useful_life_months`
- `production_units_total_estimate`
- `production_units_unit`
- data `asset_usage_logs`

#### Rumus konsep

```text
depreciable = cost - residual_value
rate_per_unit = depreciable / production_units_total_estimate
depreciation_for_period = rate_per_unit * units_in_period
```

#### Cara sistem menghitung

Sistem mengambil:

- total pemakaian sebelum periode
- pemakaian pada periode berjalan

Lalu sistem menghitung:

- nilai buku awal periode berdasarkan akumulasi usage sebelum periode
- nilai buku akhir periode berdasarkan usage kumulatif hingga akhir periode
- selisih keduanya menjadi penyusutan periode

#### Karakteristik

- cocok untuk mesin, kendaraan, genset, alat produksi, atau aset dengan basis output/jam operasi
- bila tidak ada usage log pada periode tertentu, penyusutan periode itu bisa di-skip
- sangat tergantung kualitas pencatatan `asset_usage_logs`

#### Batas bawah

Nilai buku tidak boleh turun di bawah `residual_value`.

## Perbandingan Singkat Metode

| Metode | Basis | Pola Beban | Cocok untuk |
|---|---|---|---|
| `straight_line` | waktu | stabil | aset umum |
| `diminishing` | waktu | besar di awal, turun bertahap | aset yang cepat turun nilainya di awal |
| `double_declining` | waktu | sangat besar di awal | aset dengan manfaat awal dominan |
| `syd` | waktu | dipercepat berbobot | aset yang manfaatnya menurun bertahap |
| `units_of_production` | pemakaian | tergantung usage | mesin/alat operasional berbasis output |

## Cara Sistem Menghitung Nilai Buku

### Untuk metode berbasis waktu

Metode berikut dihitung dari selisih bulan sejak `purchase_date`:

- `straight_line`
- `diminishing`
- `double_declining`
- `syd`

### Untuk metode berbasis produksi

Metode `units_of_production` menghitung nilai buku dari akumulasi usage log.

Jika `book_value_cached` tersedia, nilai itu dapat dipakai sebagai basis tampilan/as-of tertentu agar lebih efisien.

## Data yang Dihasilkan Setelah Penyusutan Dipost

Saat penyusutan berhasil dipost, sistem menyimpan entry yang memuat:

- metode
- periode
- nilai buku awal
- nilai penyusutan periode
- akumulasi penyusutan
- nilai buku akhir
- units in period
- units unit

Data ini dipakai untuk:

- halaman schedule penyusutan
- detail penyusutan per aset
- rekap penyusutan
- notifikasi saat mencapai residu

## Catatan Implementasi Penting

### 1. Create asset tidak otomatis membuat entry penyusutan

Ini behavior yang benar pada sistem saat ini. Pembuatan aset hanya menyimpan setup awal.

### 2. `useful_life_months` masih diwajibkan untuk semua metode

Walaupun `units_of_production` secara konsep berbasis usage, kalkulator tetap melakukan validasi `useful_life_months > 0` sebelum masuk perhitungan khusus. Jadi pada implementasi saat ini, metode produksi juga tetap membutuhkan umur ekonomis terisi agar tidak di-skip.

### 3. Validasi metode di level aset dan kategori belum konsisten

- Form aset mendukung 5 metode.
- Validasi kategori saat ini hanya menerima 2 metode:
  - `straight_line`
  - `diminishing`

Ini berarti default kategori belum bisa sepenuhnya mewakili seluruh metode yang didukung sistem di level aset.

### 4. Validasi `depreciation_method` di request aset masih longgar

Saat create/update aset, field `depreciation_method` masih divalidasi sebagai `string` biasa, belum dibatasi ke daftar metode resmi. Implementasi UI memang hanya menawarkan 5 metode, tetapi validasi backend saat ini masih belum ketat.

## Rekomendasi Penggunaan Operasional

### Untuk aset umum

Gunakan:

- `straight_line`

Isi minimal:

- `purchase_date`
- `cost`
- `useful_life_months`
- `residual_value`

### Untuk aset yang turun nilai cepat di awal

Pertimbangkan:

- `diminishing`
- `double_declining`
- `syd`

### Untuk aset berbasis jam/output

Gunakan:

- `units_of_production`

Isi tambahan wajib:

- `production_units_total_estimate`
- `production_units_unit`

Serta pastikan:

- usage log dicatat rutin

## Kesimpulan

Sistem penyusutan Asetku saat ini sudah cukup fleksibel karena mendukung 5 metode di level aset. Namun, behavior operasionalnya penting dipahami:

- create asset hanya menyimpan konfigurasi
- posting penyusutan terjadi saat depreciation run
- kelengkapan data awal sangat menentukan apakah aset bisa dihitung
- metode `units_of_production` sangat bergantung pada usage log
- masih ada inkonsistensi kecil antara validasi level aset dan kategori

Dokumen ini mengikuti implementasi aktual sistem pada saat dokumen ini dibuat.
