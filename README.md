# Asetku — Asset Management Platform (Multi-Organization, Single Database)

Platform manajemen aset “enterprise-ready” berbasis **Laravel 13**, **Inertia v3**, **React 19**, dan **Tailwind CSS v4**. Asetku dirancang untuk **multi-organization** dalam **satu database** (single DB) dengan isolasi data melalui `organization_id` + Global Scope.

Repository ini berisi modul inti untuk: organisasi & cabang, master data aset, registrasi aset + lampiran foto/dokumen, QR/scan publik, siklus hidup aset (audit trail immutable), user management modern (invites, SSO, 2FA), i18n, API v1, serta tooling dev (Horizon/Telescope).

---

## Tech Stack

- **Backend**: Laravel 13 (PHP 8.3)
- **Frontend**: Inertia.js v3 + React 19 + Vite
- **UI**: Tailwind CSS v4 + Radix UI primitives
- **Auth**: Laravel Fortify (termasuk 2FA TOTP) + Socialite (SSO)
- **RBAC**: Spatie Laravel Permission (platform-wide) + role org-level via pivot `organization_user`
- **Audit log**: Spatie Activitylog + event history aset (`asset_histories`)
- **Media & Upload**: Spatie Media Library + `MediaAsset` + chunked uploads
- **Import/Export**: Maatwebsite Excel + DomPDF
- **Maps/QR/Barcode**: Leaflet + QRCode (JS) + JsBarcode
- **API**: `/api/v1/*` dengan Sanctum (personal access tokens)
- **Dokumentasi API**: Scramble (OpenAPI UI)
- **Tooling**: Telescope (dev) + Horizon (monitor queue), Sentry (optional)

---

## Konsep Utama (Multi-tenancy)

- **Single database**: semua data domain aset dan modul tertentu discope dengan `organization_id`.
- **Global Scope Laravel** memastikan query otomatis terfilter ke organisasi aktif.
- User dapat menjadi anggota banyak organisasi via pivot `organization_user`, dan organisasi aktif disimpan di `users.current_organization_id`.
- **Organization switcher** tersedia di sidebar (workspace-style).

---

## Kebutuhan

- PHP **8.3** + Composer
- Node.js + npm
- Database (SQLite / MySQL)
- Redis (direkomendasikan; dibutuhkan untuk Horizon dan sebagian cache/queue bila `QUEUE_CONNECTION=redis`)

---

## Mulai Cepat

Dari root repo:

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
php artisan storage:link
php artisan migrate --seed
npm run dev
```

Atau gunakan script setup yang sudah tersedia:

```bash
composer run setup
```

Jalankan full dev stack (server + queue + logs + Vite) dengan:

```bash
composer run dev
```

---

## Akun Default (Seeder)

`php artisan migrate --seed` akan membuat roles, permissions, dan sample users.

- **Super Admin**
  - Email: `superadmin@example.com`
  - Password: `password`
- **Admin**
  - Email: `admin@example.com`
  - Password: `password`

> Role `super-admin` punya akses penuh via rule `Gate::before`.

---

## Modul Aplikasi (Ringkasan)

### Organizations & Branches (Workspace)

- Multi-organization per platform account (holding/group → organization → branch → department → asset)
- Onboarding organisasi (profile, plan, locale, asset code format)
- Manajemen cabang (aktif/nonaktif), detail alamat, PIC, koordinat (lat/lng)
- Switch organisasi: `POST /organizations/{organization}/switch`

### Master Data (Settings → Master Data)

CRUD org-scoped (i18n) untuk master data aset:

- Status aset, kondisi aset, kelas aset, unit
- Department (terikat branch), PIC (Person-in-charge), asset users
- Kategori aset (hierarki), lokasi aset (hierarki + branch)
- Warranty, vendor contracts

Path: `GET /settings/master-data`

### Assets Module

- Registrasi aset + metadata/custom fields per kategori
- Lampiran **foto** & **dokumen** via `MediaAsset` + `asset_media`
- Search/filter + saved filters
- Export (CSV/Excel/PDF) mengikuti filter aktif
- Print label A4 (QR + barcode)
- Map view (Leaflet) untuk aset yang memiliki koordinat

### Public QR & Scan

- Public page: `GET /q/{token}` menampilkan detail aset + foto + dokumen (read-only, tanpa login)
- Scan page: `GET /scan` (kamera browser)

**Security note**: halaman `/q/{token}` menggunakan akses berbasis token (“possession-based”). Anggap `qr_token` sebagai “secret link” — jangan disebarkan publik. Jika token bocor, lakukan rotasi token (fitur rotasi bisa ditambahkan) dan cetak ulang label.

### Asset Lifecycle (Audit Trail Immutable)

- Sistem merekam perjalanan aset dari perolehan hingga penghapusan melalui `asset_histories`.
- History menggunakan `performed_at` untuk “waktu kejadian” dan bersifat **immutable** (tidak bisa dihapus/mutasi dari aplikasi).
- Movement types pada `asset_movements.type`: `placement|transfer|borrow|return`
- Dokumen pendukung bisa ditag dengan `asset_media.stage` + `document_type`.

### Siklus Aset (Menu Operasional)

Modul operasional agar user bisa melakukan perubahan lifecycle tanpa membuka detail aset:

- Path: `GET /asset-lifecycle`
- Asset picker (search + scan QR), lalu aksi cepat:
  - Status, kondisi, lifecycle event, movement (transfer/borrow/return), documents, timeline

### User Management v2 (Invites + SSO + 2FA + Access Policy)

- Undang user via email (token expire 48 jam) untuk join organisasi aktif
- SSO login Google & Microsoft 365 (hanya untuk user yang sudah ada/di-invite)
- 2FA: TOTP + SMS recovery (driver default: log)
- Access restriction per organization: IP allowlist + jam kerja
- Login history events (success/failed/logout), suspend/reactivate, delegation sementara

---

## Demo Data (Realistic Seed + Internet Images)

Seeder demo membuat holding “PT Maju Bersama” + 3 organisasi + cabang + master data + aset realistis, termasuk download foto aset dari **Wikimedia Commons** (best-effort).

Aktifkan demo seed:

```bash
SEED_DEMO_ASSETS=true php artisan migrate:fresh --seed
```

Catatan:
- Membutuhkan internet untuk download gambar (gagal download tidak membatalkan seeding).
- File media disimpan ke disk `public`. Pastikan sudah menjalankan `php artisan storage:link`.
- User default (`superadmin@example.com`, `admin@example.com`) akan di-attach sebagai member demo organizations agar bisa switch org dan melihat data demo.

---

## Settings (DB-backed + cache Redis)

- Settings admin ada di `/settings/*`:
  - **App Settings**: name, logo, timezone, locale, maintenance mode
  - **Mail Settings**: providers & secrets (stored encrypted in DB), send test email
  - **Feature Flags**: enable/disable by environment and allowlist users/roles
- Akses berbasis permission:
  - `settings.app.manage`, `settings.mail.manage`, `settings.flags.manage`

---

## API Layer (v1)

- Base API routes: `routes/api.php`
- Versioned routes: `/api/v1/*`
- Auth (Sanctum token-based):
  - `POST /api/v1/auth/tokens` → issue token
  - `DELETE /api/v1/auth/tokens/current` → revoke current token
  - `GET /api/v1/me` → current user resource (requires Bearer token)

- Dokumentasi API:
  - `GET /api/docs` → redirects to Scramble UI (default Scramble path is `/docs/api`)
  - `GET /api/docs.json` → OpenAPI JSON

- Health check:
  - `GET /api/health` → checks database/cache/queue/storage and returns 200 or 503

---

## Routes Cheat Sheet (Developer)

```text
GET  /dashboard
GET  /organizations
POST /organizations/{organization}/switch
GET  /branches
GET  /settings/master-data

GET  /assets
GET  /assets-import
GET  /assets-export
GET  /assets-labels/print
GET  /asset-lifecycle

GET  /q/{token}
GET  /scan

GET  /horizon     (optional)
GET  /telescope   (dev only)
GET  /api/docs
```

---

## Dev Tools

### Telescope (khusus development)

- Path: `/telescope`
- Access:
  - Default aktif hanya saat `APP_ENV=local` (atau set `TELESCOPE_ENABLED=true`)
  - Gate `viewTelescope` mengizinkan role `admin` (dan `super-admin` via bypass)

### Horizon (monitor queue)

- Path: `/horizon`
- Requires Redis queue (`QUEUE_CONNECTION=redis`)
- Gate `viewHorizon` mengizinkan role `admin` (dan `super-admin` via bypass)

---

## Developer Experience (DX)

Asetku menekankan DX agar developer bisa produktif dari hari pertama:

- Generator module: `php artisan make:module Post`
- Type-safe shared props Inertia: `composer inertia:types`
- IDE helper (PhpStorm/Intelephense): `composer ide-helper`
- Quality gate via Husky (pre-commit): lint-staged (auto-fix JS/TS) + Pint/PHPStan (block PHP)

Dokumentasi lengkap: `docs/developer-experience.md`.

---

## Environment Variables (umum)

Lihat `.env.example` untuk daftar lengkap. Beberapa yang sering dipakai:

- `APP_ENV`, `APP_DEBUG`, `APP_URL`
- `DB_CONNECTION` (SQLite by default in this repo)
- `CACHE_STORE=redis`
- `QUEUE_CONNECTION=redis`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `SENTRY_DSN` (optional)
- `SEED_DEMO_ASSETS=true` (optional) untuk demo realistic seed

### SSO (Google & Microsoft 365)

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`
- `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_REDIRECT_URL`, `MICROSOFT_TENANT_ID` (default `common`)

### SMS Recovery (2FA)

- `SMS_DRIVER=log` (default) — mengirim SMS recovery via log (siap diganti provider nyata).

---

## Scripts

### Backend (Composer)

```bash
composer run dev
composer run setup
composer run lint
composer run test
```

### Frontend (npm)

```bash
npm run dev
npm run build
npm run types:check
npm run lint:check
npm run format:check
```

---

## Testing

Jalankan semua test:

```bash
php artisan test
```

Jalankan subset:

```bash
php artisan test --compact tests/Feature/Api/V1/ApiAuthTest.php
```

---

## Catatan Production

- Ensure `APP_ENV=production` and `APP_DEBUG=false`.
- Pastikan **Telescope disabled** di production (`TELESCOPE_ENABLED=false`).
- Configure Redis and Horizon for stable queues.
- Configure Sentry by setting `SENTRY_DSN` (optional).

---

## Kontribusi

PR sangat diterima. Mohon:

- Keep changes focused and consistent with existing conventions.
- Add/adjust Pest tests for behavior changes.
- Run `vendor/bin/pint --dirty --format agent` and relevant tests before submitting.

---

## Lisensi

MIT (see `composer.json` for current license metadata).
