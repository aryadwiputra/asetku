# Asetku — Laravel + React SPA

## Stack
Laravel 13, PHP 8.3, React 19, Inertia v3, Tailwind v4, Pest 4, SQLite (`database/database.sqlite`), Horizon

## Developer Commands

```bash
composer run dev      # server + queue + logs + vite (concurrently)
composer run ci:check # lint:check → format:check → types:check → phpstan → test
composer test         # lint:check → test
composer run setup    # fresh repo bootstrap

npm run build         # production frontend
npm run types:check   # TypeScript validation
```

## Verification Order (CI)
1. `npm run lint:check` / `npm run format:check`
2. `npm run types:check`
3. `vendor/bin/phpstan analyse` (level 6)
4. `php artisan test --compact`

## PHP Code Style
After editing PHP: `vendor/bin/pint --dirty --format agent`

## Frontend
- Pages: `resources/js/pages/`
- Components: `resources/js/components/`
- Entry: `resources/js/app.tsx`, `resources/css/app.css`
- Vite HMR works in WSL

## Laravel
- Routes: `routes/web.php`, `routes/api.php` (versioned `/api/v1/*`)
- Models: `app/Models/`
- Use `php artisan make:` commands for new files
- Helpers: `app/Support/helpers.php`

## Key Conventions
- Multi-org isolation via `organization_id` + Global Scope (single DB)
- Asset lifecycle immutable via `asset_histories` table
- Public QR token (`/q/{token}`) = secret link — treat as credential
- Module generator: `php artisan make:module Post`
- Inertia types: `composer inertia:types`

## MCP Server (Laravel Boost)
WSL-required. Config in `.mcp.json`. PHP path: `/usr/bin/php8.3`

## Activated Skills
`fortify-development`, `laravel-best-practices`, `wayfinder-development`, `pest-testing`, `inertia-react-development`, `tailwindcss-development`, `configuring-horizon`, `laravel-inertia-react`
