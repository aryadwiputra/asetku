import { Link, router, usePage } from '@inertiajs/react';
import { Building2, Check, ChevronsUpDown, LogOut, Monitor, Moon, Plus, Search, Sun, User as UserIcon } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import { update as updateLocale } from '@/routes/locale';
import { edit } from '@/routes/profile';
import { index as organizationsIndex, switchMethod as switchOrganization } from '@/routes/organizations';
import { profile as onboardingProfile } from '@/routes/organizations/onboarding';
import type { User } from '@/types';
import { useMemo, useState } from 'react';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();
    const { t } = useTranslation();
    const { locale, availableLocales, localeLabels } = usePage().props as {
        locale: string;
        availableLocales: string[];
        localeLabels: Record<string, string>;
    };
    const { organization, organizations, orgAbilities } = usePage().props as {
        organization: { id: number; name: string } | null;
        organizations: Array<{ id: number; name: string; slug: string; role: string | null; is_active: boolean }>;
        orgAbilities: { organizations: { create: boolean } };
    };
    const [orgSearch, setOrgSearch] = useState('');

    const currentOrganization = useMemo(() => {
        if (!organization) {
            return null;
        }

        return organizations.find((org) => org.id === organization.id) ?? null;
    }, [organization, organizations]);

    const currentOrganizationRoleLabel = useMemo(() => {
        const role = currentOrganization?.role;

        if (!role) {
            return null;
        }

        const labels: Record<string, string> = {
            Owner: 'Pemilik',
            Admin: 'Admin',
            Manager: 'Manajer',
            Member: 'Anggota',
        };

        return labels[role] ?? role;
    }, [currentOrganization?.role]);

    const filteredOrganizations = useMemo(() => {
        const query = orgSearch.trim().toLowerCase();

        if (query === '') {
            return organizations;
        }

        return organizations.filter((org) => {
            return (
                org.name.toLowerCase().includes(query) ||
                org.slug.toLowerCase().includes(query) ||
                (org.role ?? '').toLowerCase().includes(query)
            );
        });
    }, [orgSearch, organizations]);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <UserIcon className="mr-2" />
                        {t('common.profile')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center justify-between">
                <span>Organisasi</span>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuLabel>
            <div className="px-2 pb-2">
                <div className="flex items-start justify-between gap-2 rounded-md border bg-muted/20 px-2 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="truncate text-sm font-medium">
                                    {organization?.name ?? 'Belum memilih organisasi'}
                                </div>
                                {currentOrganizationRoleLabel && (
                                    <Badge variant="secondary">{currentOrganizationRoleLabel}</Badge>
                                )}
                                {currentOrganization && !currentOrganization.is_active && (
                                    <Badge variant="outline">Nonaktif</Badge>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Data dipisahkan per organisasi. Pastikan organisasi aktif sesuai kebutuhan.
                            </div>
                        </div>
                    </div>

                    <Link href={organizationsIndex()} prefetch onClick={cleanup}>
                        <Button type="button" size="sm" variant="outline">
                            Kelola
                        </Button>
                    </Link>
                </div>
            </div>

            {orgAbilities.organizations.create && (
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={onboardingProfile()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Buat organisasi baru
                    </Link>
                </DropdownMenuItem>
            )}

            <div className="px-2 pb-2">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        placeholder="Cari organisasi…"
                        className="h-9 pr-9 pl-9"
                    />
                    {orgSearch.trim() !== '' && (
                        <button
                            type="button"
                            onClick={() => setOrgSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        >
                            Bersihkan
                        </button>
                    )}
                </div>
            </div>

            <DropdownMenuGroup className="max-h-72 overflow-y-auto px-1">
                {filteredOrganizations.length === 0 ? (
                    <div className="px-3 pb-2 text-sm text-muted-foreground">
                        Organisasi tidak ditemukan.
                    </div>
                ) : (
                    filteredOrganizations.map((org) => {
                        const isCurrent = organization?.id === org.id;
                        const roleLabel =
                            org.role === null
                                ? null
                                : ({ Owner: 'Pemilik', Admin: 'Admin', Manager: 'Manajer', Member: 'Anggota' }[org.role] ??
                                  org.role);

                        return (
                            <DropdownMenuItem
                                key={org.id}
                                disabled={!org.is_active || isCurrent}
                                onSelect={(e) => {
                                    e.preventDefault();
                                    cleanup();
                                    router.post(
                                        switchOrganization({ organization: org.id }).url,
                                        {},
                                        { preserveScroll: true },
                                    );
                                }}
                                className="flex items-center justify-between gap-2"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate font-medium">{org.name}</span>
                                        {roleLabel && <Badge variant="secondary">{roleLabel}</Badge>}
                                        {!org.is_active && <Badge variant="outline">Nonaktif</Badge>}
                                        {isCurrent && <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Aktif</Badge>}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        Kode: {org.slug}
                                    </div>
                                </div>

                                {isCurrent && <Check className="h-4 w-4 text-emerald-600" />}
                            </DropdownMenuItem>
                        );
                    })
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('common.theme')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
                value={appearance}
                onValueChange={(value) =>
                    updateAppearance(value as 'light' | 'dark' | 'system')
                }
            >
                <DropdownMenuRadioItem value="light">
                    <Sun className="h-4 w-4" />
                    {t('common.light')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                    <Moon className="h-4 w-4" />
                    {t('common.dark')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                    <Monitor className="h-4 w-4" />
                    {t('common.system')}
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('common.language')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
                value={locale}
                onValueChange={(value) =>
                    router.post(updateLocale().url, { locale: value }, { preserveScroll: true })
                }
            >
                {availableLocales.map((option) => (
                    <DropdownMenuRadioItem key={option} value={option}>
                        {localeLabels[option] ?? option}
                    </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {t('common.logout')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
