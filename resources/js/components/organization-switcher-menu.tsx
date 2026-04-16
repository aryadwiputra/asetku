import { Link, router, usePage } from '@inertiajs/react';
import { Building2, Check, ChevronRight, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useTranslation } from '@/hooks/use-translation';
import { index as organizationsIndex, switchMethod as switchOrganization } from '@/routes/organizations';
import { profile as onboardingProfile } from '@/routes/organizations/onboarding';

type Props = {
    variant: 'sidebar' | 'menu';
    onAfterSelect?: () => void;
};

export function OrganizationSwitcherMenu({ variant, onAfterSelect }: Props) {
    const { t } = useTranslation();
    const { organization, organizations, orgAbilities } = usePage().props as {
        organization: { id: number; name: string } | null;
        organizations: Array<{ id: number; name: string; slug: string; role: string | null; is_active: boolean }>;
        orgAbilities: { organizations: { create: boolean } };
    };

    const [orgSearch, setOrgSearch] = useState('');
    const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false);
    const orgSearchInputId = variant === 'sidebar' ? 'org-switcher-search-sidebar' : 'org-switcher-search-menu';

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

        return t(`common.org_roles.${role}`);
    }, [currentOrganization?.role, t]);

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

    const content = (
        <>
            <DropdownMenuLabel>{t('common.switch_organization')}</DropdownMenuLabel>
            <div className="px-2 pb-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id={orgSearchInputId}
                        value={orgSearch}
                        onChange={(e) => setOrgSearch(e.target.value)}
                        placeholder={t('common.search_organizations')}
                        className="pl-8"
                    />
                    {orgSearch.trim() !== '' ? (
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setOrgSearch('')}
                        >
                            {t('common.clear')}
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="max-h-72 overflow-y-auto px-1">
                {filteredOrganizations.length === 0 ? (
                    <div className="px-3 pb-2 text-sm text-muted-foreground">{t('common.organizations_empty')}</div>
                ) : (
                    filteredOrganizations.map((org) => {
                        const isCurrent = organization?.id === org.id;
                        const roleLabel = org.role === null ? null : t(`common.org_roles.${org.role}`);

                        return (
                            <DropdownMenuItem
                                key={org.id}
                                disabled={!org.is_active || isCurrent}
                                onSelect={(e) => {
                                    e.preventDefault();
                                    onAfterSelect?.();
                                    setOrgSearch('');
                                    setOrgSwitcherOpen(false);
                                    router.post(switchOrganization({ organization: org.id }).url, {}, { preserveScroll: true });
                                }}
                                className="flex items-center justify-between gap-2"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="truncate font-medium">{org.name}</span>
                                    {roleLabel && <Badge variant="secondary">{roleLabel}</Badge>}
                                    {!org.is_active && <Badge variant="outline">{t('common.inactive')}</Badge>}
                                </div>

                                {isCurrent && <Check className="h-4 w-4 text-emerald-600" />}
                            </DropdownMenuItem>
                        );
                    })
                )}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full cursor-pointer" href={organizationsIndex()} prefetch onClick={onAfterSelect}>
                    {t('common.manage_organizations')}
                </Link>
            </DropdownMenuItem>
            {orgAbilities.organizations.create && (
                <DropdownMenuItem asChild>
                    <Link className="block w-full cursor-pointer" href={onboardingProfile()} prefetch onClick={onAfterSelect}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('common.create_organization')}
                    </Link>
                </DropdownMenuItem>
            )}
        </>
    );

    if (variant === 'sidebar') {
        return (
            <DropdownMenu
                open={orgSwitcherOpen}
                onOpenChange={(open) => {
                    setOrgSwitcherOpen(open);

                    if (!open) {
                        setOrgSearch('');
                        return;
                    }

                    requestAnimationFrame(() => {
                        const input = document.getElementById(orgSearchInputId);
                        if (input instanceof HTMLInputElement) {
                            input.focus();
                            input.select();
                        }
                    });
                }}
            >
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="default" className="w-full">
                        <Building2 />
                        <span className="min-w-0 flex-1 truncate font-medium">
                            {organization?.name ?? t('common.organizations_none')}
                        </span>
                        {currentOrganizationRoleLabel ? <Badge variant="secondary">{currentOrganizationRoleLabel}</Badge> : null}
                        {currentOrganization && !currentOrganization.is_active ? <Badge variant="outline">{t('common.inactive')}</Badge> : null}
                        <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="right" className="w-72">
                    {content}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <DropdownMenuSub
            open={orgSwitcherOpen}
            onOpenChange={(open) => {
                setOrgSwitcherOpen(open);

                if (!open) {
                    setOrgSearch('');
                    return;
                }

                requestAnimationFrame(() => {
                    const input = document.getElementById(orgSearchInputId);
                    if (input instanceof HTMLInputElement) {
                        input.focus();
                        input.select();
                    }
                });
            }}
        >
            <DropdownMenuSubTrigger className="w-full">
                <Building2 className="h-4 w-4" />
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="truncate font-medium">{organization?.name ?? t('common.organizations_none')}</span>
                    {currentOrganizationRoleLabel && <Badge variant="secondary">{currentOrganizationRoleLabel}</Badge>}
                    {currentOrganization && !currentOrganization.is_active && <Badge variant="outline">{t('common.inactive')}</Badge>}
                </div>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="w-80">
                {content}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
