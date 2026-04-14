import { Head, Link, router, usePage } from '@inertiajs/react';
import { Building2, CheckCircle2, Plus, Search, Shuffle } from 'lucide-react';
import { useMemo, useState } from 'react';

import OrganizationSwitchController from '@/actions/App/Http/Controllers/OrganizationSwitchController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { index as organizationsIndex } from '@/routes/organizations';
import { profile as onboardingProfile } from '@/routes/organizations/onboarding';

type OrganizationRow = {
    id: number;
    name: string;
    slug: string;
    role: string | null;
};

type Props = {
    organizations: OrganizationRow[];
    currentOrganizationId: number | null;
};

export default function OrganizationsIndex({ organizations, currentOrganizationId }: Props) {
    const { organization } = usePage().props;
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

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
    }, [organizations, search]);

    const activeCount = organizations.length;
    const current = organizations.find((o) => o.id === currentOrganizationId) ?? null;

    return (
        <>
            <Head title="Organizations" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Organizations"
                    description="Switch context between companies/lembaga under one platform account."
                />

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <span>Organization context</span>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            Current: <span className="font-medium text-foreground">{organization?.name ?? 'None'}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name, slug, or role…"
                                    className="pl-9"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                <div className="text-sm text-muted-foreground">
                                    {activeCount} total
                                </div>
                                <Link href={onboardingProfile()}>
                                    <Button type="button">
                                        <Plus className="mr-2 h-4 w-4" />
                                        New
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {current && (
                            <>
                                <Separator />
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        <span className="font-medium">{current.name}</span>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                    <div className="text-muted-foreground">{current.slug}</div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-3 md:grid-cols-2">
                    {filtered.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground md:col-span-2">
                            No organizations match your search.
                        </Card>
                    ) : (
                        filtered.map((org) => (
                            <Card key={org.id} className={org.id === currentOrganizationId ? 'border-primary/50' : ''}>
                                <CardContent className="flex items-center justify-between gap-4 p-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="truncate font-medium">{org.name}</div>
                                            {org.role && <Badge variant="secondary">{org.role}</Badge>}
                                            {org.id === currentOrganizationId && <Badge>Active</Badge>}
                                        </div>
                                        <div className="truncate text-sm text-muted-foreground">{org.slug}</div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant={org.id === currentOrganizationId ? 'secondary' : 'default'}
                                        disabled={org.id === currentOrganizationId}
                                        onClick={() =>
                                            router.post(
                                                OrganizationSwitchController({ organization: org.id }).url,
                                                {},
                                                { preserveScroll: true },
                                            )
                                        }
                                    >
                                        <Shuffle className="mr-2 h-4 w-4" />
                                        Switch
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

OrganizationsIndex.layout = {
    breadcrumbs: [{ title: 'Organizations', href: organizationsIndex() }],
};
