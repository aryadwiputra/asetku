# MVP Planning & Analisis — Asetku

**Tanggal:** 10 Mei 2026
**Status:** Draft

---

## Ringkasan Fitur MVP

| #   | Fitur                                       | Status              | Prioreitas |
| --- | ------------------------------------------- | ------------------- | ---------- |
| 1   | Multi-organisasi & cabang                   | ✅ Selesai          | -          |
| 2   | RBAC dasar (Owner, Admin, Staff)            | ✅ Selesai          | ~~**High**~~ |
| 3   | Manajemen aset: CRUD, foto, dokumen, status | ✅ Selesai untuk MVP | -         |
| 4   | QR Code generate + scan via browser         | ✅ Selesai          | -          |
| 5   | Pemeliharaan preventif: jadwal + work order | ✅ Selesai untuk MVP | -         |
| 6   | Laporan inventaris dasar                    | ✅ Selesai untuk MVP | -         |
| 7   | Notifikasi email                            | ✅ Selesai untuk MVP | -        |

---

## 1. Multi-Organisasi & Cabang — ✅ SELESAI

### Yang Diimplementasi

- Model `Organization` + `Branch` dengan global scope `organization_id`
- Middleware `SetCurrentOrganization` auto-set org dari session user
- Organisasi switcher dengan dukungan delegasi
- Full CRUD untuk organisasi dan cabang

### UX Issues

- Jika tidak ada org context: query mengembalikan hasil kosong tanpa instruksi
- Switching organisasi tidak ada konfirmasi toast

### Aksi

Tidak ada aksi needed. Feature complete.

---

## 2. RBAC — ✅ SELESAI (Implemented via Option A)

### Masalah Utama (SEBELUM)

**State sebelumnya:**
- **Spatie roles** (`admin`, `user`) — platform-wide, disimpan di tabel `roles`
- **Organization roles** (`Owner`, `Admin`, `Manager`, `Member`) — disimpan di pivot `organization_user`
- Organization roles **tidak secara otomatis memberikan Spatie permissions**

**Konsekuensi:**
- User dengan org role `Admin` tapi tanpa Spatie `admin` role = hampir tidak punya permission
- User dengan Spatie `admin` role tapi org role `Member` = bypass semua org restrictions

### Solusi yang Diimplementasi (Opsi A)

**File baru:**

1. **`app/Services/OrganizationRolePermissionMap.php`**
   - Mapping statis untuk setiap org role → permissions:
     - `Owner` → semua permission (CRUD semua resource)
     - `Admin` → semua CRUD kecuali `organization.delete`
     - `Manager` → view + update + create (no delete) + work_order.create
     - `Member` → view only

2. **`app/Models/Traits/HasOrganizationRolePermissions.php`**
   - Trait yang override `checkPermissionTo()` (dipanggil oleh Gate/Spatie)
   - Flow: cek Spatie permission dulu → kalau fail, cek org role permission
   - Helper methods: `hasOrgRolePermission()`, `getOrgRolePermissions()`

3. **`app/Models/User.php`** - menggunakan trait `HasOrganizationRolePermissions`

**Flow baru:**
```php
$user->can('asset.view')
  → cek Spatie permission (direct atau via role)
  → kalau fail, cek org role permission
  → return true kalau org role mengizinkan
```

**Contoh:**
- User dengan org role `Admin` + Spatie `user` role → dapat semua CRUD permission via org role
- User dengan org role `Member` → hanya view permission

### Catatan
- Spatie `super-admin` role tetap bypass via `Gate::before()` untuk backward compatibility
- Policies tidak perlu diubah (tetap sama) karena `can()` sekarang auto-grants via org role
- "Staff" dalam docs = `Member` (label UI), tidak perlu perubahan kode

### Aksi
- [x] Buat `OrganizationRolePermissionMap` - mapping org role → permissions
- [x] Buat `HasOrganizationRolePermissions` trait - override checkPermissionTo()
- [x] Update User model - use trait baru
- [ ] (Optional) Update docs untuk menjelaskan org role permission system baru
- [x] Test: user dengan org role Admin tapi bukan Spatie admin harus tetap bisa CRUD assets

---

## 3. Manajemen Aset — ✅ MVP GAP TERTUTUP

### Yang Diimplementasi

- Full CRUD dengan 40+ fields
- Soft deletes, chunked media uploads (Spatie Media Library)
- Asset status master data + immutable audit trail via `asset_histories`
- Branch/relation normalization
- QR token auto-generate 40-char
- Asset status transition rules + bulk status update
- Shortcut `Change Status` + confirmation modal delete/dispose
- Photo limit 20
- Status aset otomatis masuk `repair` saat corrective work order aktif, lalu pulih ke status sebelumnya saat work order terakhir ditutup

### UX Gaps

| Issue                                            | Dampak                                                                  | Solusi                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------- |
| Tidak ada status transition rules                | Status bisa berubah dari "Active" ke "Disposed" langsung tanpa validasi | Tambah `AssetStatusTransition` model + validasi di policy |
| Tidak ada konfirmasi dialog untuk delete/dispose | Accidental deletion                                                     | Tambah modal konfirmasi                                   |
| Status change tersembunyi                        | User harus ke Lifecycle tab → toggle Status                             | Tambah shortcut "Change Status" di header asset detail    |
| Tidak ada bulk status update                     | Harus ubah satu-satu                                                    | Tambah bulk action di asset index                         |
| Photo limit (10) terlalu restrictif              | Inventory dengan banyak foto tidak muat                                 | Naikkan ke 20 atau buat konfigurasi                       |
| Tidak ada "Under Maintenance" dedicated status   | Workflow maintenance terpisah dari status                               | Tambah status baru atau hubungkan ke workflow maintenance |

### Quick UX Wins (Effort Kecil, Impact Besar)

- [x] Tambah confirmation modal di delete asset & dispose
- [x] Tambah tombol "Change Status" di asset detail page header
- [x] Tambah hint transisi status ("Active → Disposed tidak direkomendasikan")
- [x] Update photo limit dari 10 ke 20
- [x] Tambah bulk action update status di asset index
- [x] Tambah rule transisi status dasar + validasi backend
- [x] Hubungkan workflow maintenance corrective ke status aset `repair`

---

## 4. QR Code + Scan — ✅ SELESAI

### Yang Diimplementasi

- 40-char token auto-generated on asset creation
- Public page `/q/{token}` dengan full asset details
- Auth-aware: show "Open Asset" button jika same org + permission
- Camera scanning via native `BarcodeDetector` API
- Flashlight toggle untuk device yang mendukung torch camera
- Sound + vibration feedback saat QR berhasil discan
- Pesan permission kamera yang lebih jelas dengan instruksi enable access
- Offline scan queue dengan localStorage + auto-sync
- Asset label printing dengan QR + CODE128 barcode (A4)

### UX Gaps

| Issue                                               | Dampak                             | Solusi                                             |
| --------------------------------------------------- | ---------------------------------- | -------------------------------------------------- |
| `BarcodeDetector` tidak support Safari <17, Firefox | User tidak bisa scan               | Tambah fallback:手动输入token atau upload QR image |
| No token regeneration                               | Jika token bocor tidak bisa rotate | Tambah tombol "Regenerate Token" di asset detail   |
| No camera flashlight toggle                         | Sulit scan di ruangan gelap        | Tambah toggle torch button                         |
| Camera permission denied menunjukkan raw error      | User bingung                       | Tambah user-friendly message + instruksi enable    |
| No sound/haptic feedback saat scan berhasil         | User tidak yakin scan berhasil     | Tambah beep sound + vibration                      |

### Aksi

- [ ] Tambah fallback UI untuk browser yang tidak support BarcodeDetector
- [ ] Tambah tombol regenerate token (asset detail → action menu)
- [x] Tambah flashlight toggle di scan dialog
- [x] Improve camera permission error message
- [x] Tambah sound feedback on successful scan

---

## 5. Pemeliharaan Preventif — ✅ MVP GAP TERTUTUP

### Yang Diimplementasi

- `MaintenanceSchedule` per asset dengan `interval_days`, `next_due_at`
- `GenerateWorkOrdersFromSchedulesJob` (daily 02:00)
- Maintenance Calendar dengan FullCalendar + drag-to-reschedule
- Work order lifecycle: open → acknowledged → in_progress → completed/cancelled
- Checklist templates, cost lines, SLA tracking, technician assignment
- Daily reminders: 7-day, 3-day, 1-day before due
- Work order numbering immutable format `WO-YYYY-001`
- Required reason (`internal_notes`) saat complete / cancel work order
- Category default maintenance interval + auto-create default preventive schedule saat asset baru dibuat
- Auto-update `progress_percent` dari checklist completion
- Maintenance reports:
  - `/reports/work-orders`
  - `/reports/maintenance-costs`
  - KPI + tabel summary bulanan + technician performance / cost breakdown

### Gaps

| Feature                                      | Status      | Notes                                                                     |
| -------------------------------------------- | ----------- | ------------------------------------------------------------------------- |
| Work order reports                           | ✅ Ada      | Summary WO, overdue, SLA breached, technician performance                  |
| Maintenance cost reports                     | ✅ Ada      | Monthly totals, cost by asset, cost by category                            |
| Work order numbering                         | ✅ Ada      | Format `WO-YYYY-001`, unique per organisasi per tahun                      |
| Status change reasons                        | ✅ Ada      | Complete/cancel wajib isi alasan di `internal_notes`                       |
| Auto-create schedules dari category defaults | ✅ Ada      | Schedule default dibuat otomatis saat asset baru dibuat                    |
| Task completion auto-update progress         | ✅ Ada      | Progress dihitung dari rasio task selesai, tanpa auto-complete work order |

### Aksi untuk MVP

- [x] Tambah work order numbering format di `AssetMaintenance` model + seeder/backfill
- [x] Tambah required note saat complete/cancel work order
- [x] Tambah field `category_default_maintenance_interval` di `asset_categories`
- [x] Auto-create preventive schedule default saat asset baru dibuat dari category yang punya interval default
- [x] Auto-update progress work order dari checklist completion
- [x] Tambah report work order
- [x] Tambah report biaya maintenance

### Nice to Have (Post-MVP)

- [ ] Export laporan maintenance
- [ ] Visual chart untuk trend WO / biaya maintenance
- [ ] Asset downtime tracking report

---

## 6. Laporan Inventaris — ✅ MVP GAP TERTUTUP

### Yang Ada

- `/reports/inventory` — KPI cards (total assets, value, by branch/status/condition)
- Filter: branch, status, condition, category, location, department
- Excel export via Maatwebsite Excel
- Stocktake print (PDF)
- `/reports/work-orders` — work order summary, SLA compliance, technician performance, downtime
- `/reports/maintenance-costs` — monthly totals, cost per asset, cost per kategori

### Sisa Gap Besar

| Report / Capability      | Kebutuhan                                 |
| ------------------------ | ----------------------------------------- |
| Export maintenance report| Export khusus report WO / biaya maintenance |
| Chart visualization      | Visual trend untuk WO, SLA, downtime, cost |
| Asset downtime detail    | Breakdown lebih detail per incident / per cabang |

### Minimum untuk MVP

- [x] Work order summary report (simple table: period, opened, completed, overdue)
- [x] Maintenance cost summary per month (table)
- [x] SLA compliance report yang lebih eksplisit (% on-time vs breached)
- [x] Asset downtime tracking

---

## 7. Notifikasi Email — ✅ MVP GAP TERTUTUP

### Yang Diimplementasi

- 13 notification classes (work orders, maintenance, warranties, invitations)
- Semua notification penting sekarang implement `ShouldQueue` → processed via Horizon
- Notification preferences system (database + mail channels)
- Scheduled commands: daily reminders, SLA escalation
- `ImportantSecurityNotification` sudah queued
- `AuditFindingSubmittedNotification` sudah terdaftar di `config/notification_types.php`
- Theme email markdown branded untuk notification mail + test mail sudah dipasang
- SMTP environment sudah bisa dipakai untuk kirim email uji

### Aksi

- [x] Ubah `.env` production ke SMTP yang benar
- [x] Fix `ImportantSecurityNotification` → implement `ShouldQueue`
- [x] Tambah `audit.finding_submitted` ke `config/notification_types.php`
- [x] Buat branded email template dasar untuk notification mail

---

## Priority Matrix

```
                    Impact
                    High      Low
              ┌────────────┬────────────┐
       High   │ RBAC Fix   │ Email Fix  │
  Priority    │ Reports    │            │
              ├────────────┼────────────┤
       Low    │ Asset UX   │ QR UX      │
  Priority    │ Maintenance │            │
              └────────────┴────────────┘
```

### Must Fix Before MVP (Week 1)

1. **RBAC** — Connect org roles to permissions properly ✅
2. **Email** — Switch from `log` to real SMTP ✅
3. **Reports** — Add basic work order summary report ✅

### Should Fix (Week 2)

4. **Asset UX** — Add status change shortcut, confirmations ✅
5. **Maintenance** — Add work order numbering, status change notes ✅

### Can Defer (Post-MVP)

6. QR token regeneration
7. Flashlight toggle / scan UX polish
8. Maintenance report export + charts
9. Downtime detail per incident / cabang
10. Branded email templates

---

## Quick Wins Checklist

### Effort < 1 jam

- [x] Confirmation modal on asset delete/dispose
- [x] Status change shortcut button on asset detail header
- [x] Flashlight toggle in scan dialog
- [x] Sound feedback on QR scan
- [x] Improve camera permission denied message
- [x] Work order numbering format
- [x] Required note on work order complete/cancel

### Effort 1-4 jam

- [ ] OrganizationRolePermissionSeeder
- [x] Bulk status update in asset index
- [ ] Fallback UI for BarcodeDetector unsupported browsers
- [x] Basic work order summary report page
- [x] Photo limit increase (10 → 20)

---

## Files Reference

| Component             | Key Files                                                              |
| --------------------- | ---------------------------------------------------------------------- |
| Organization Model    | `app/Models/Organization.php`                                          |
| Branch Model          | `app/Models/Branch.php`                                                |
| Global Scope          | `app/Models/Concerns/BelongsToOrganization.php`                        |
| Organization Context  | `app/Services/OrganizationContext.php`                                 |
| RBAC Policy           | `app/Policies/OrganizationPolicy.php`, `app/Policies/BranchPolicy.php` |
| Asset Model           | `app/Models/Asset.php`                                                 |
| Asset Controller      | `app/Http/Controllers/AssetController.php`                             |
| Media Upload          | `app/Http/Controllers/MediaUploadController.php`                       |
| QR Page               | `app/Http/Controllers/QrController.php`                                |
| Scan Page             | `resources/js/pages/scan/index.tsx`                                    |
| Label Print           | `resources/js/pages/assets/labels/print.tsx`                           |
| Maintenance Schedule  | `app/Models/MaintenanceSchedule.php`                                   |
| Work Order            | `app/Models/AssetMaintenance.php`                                      |
| Work Order Controller | `app/Http/Controllers/WorkOrderController.php`                         |
| Maintenance Commands  | `app/Console/Commands/Maintenance/`                                    |
| Reports               | `app/Http/Controllers/Reports/`                                        |
| Notifications         | `app/Notifications/`                                                   |
| Horizon Config        | `config/horizon.php`                                                   |
