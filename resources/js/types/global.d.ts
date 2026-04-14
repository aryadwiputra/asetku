import type { Auth, Impersonation } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            appLogoUrl: string | null;
            auth: Auth;
            organization: {
                id: number;
                name: string;
                slug: string;
                currency_code: string;
                timezone: string;
                asset_code_prefix: string;
                asset_code_format: string;
                is_active: boolean;
            } | null;
            organizations: Array<{
                id: number;
                name: string;
                slug: string;
                role: string | null;
                is_active: boolean;
            }>;
            orgRole: string | null;
            orgAbilities: {
                organizations: { create: boolean; update: boolean; deactivate: boolean };
                branches: { view: boolean; create: boolean; update: boolean; deactivate: boolean };
            };
            permissions: string[];
            roles: string[];
            features: string[];
            impersonating: Impersonation | null;
            sidebarOpen: boolean;
            locale: string;
            fallbackLocale: string;
            availableLocales: string[];
            localeLabels: Record<string, string>;
            translations: Record<string, unknown>;
            [key: string]: unknown;
        };
    }
}
