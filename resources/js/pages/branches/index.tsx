import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, Pencil, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import BranchController from '@/actions/App/Http/Controllers/BranchController';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslation } from '@/hooks/use-translation';
import { index as branchesIndex } from '@/routes/branches';

type BranchRow = {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    address: string | null;
    pic_name: string | null;
    pic_email: string | null;
    pic_phone: string | null;
    latitude: number | null;
    longitude: number | null;
};

type Props = {
    branches: BranchRow[];
};

export default function BranchesIndex({ branches }: Props) {
    const { orgAbilities } = usePage().props as {
        orgAbilities: { branches: { create: boolean; update: boolean; deactivate: boolean } };
    };
    const { t } = useTranslation();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const stats = useMemo(() => {
        const active = branches.filter((b) => b.is_active).length;
        const inactive = branches.length - active;

        return { active, inactive, total: branches.length };
    }, [branches]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return branches
            .filter((branch) => {
                if (statusFilter === 'active') {
                    return branch.is_active;
                }

                if (statusFilter === 'inactive') {
                    return !branch.is_active;
                }

                return true;
            })
            .filter((branch) => {
                if (query === '') {
                    return true;
                }

                return (
                    branch.name.toLowerCase().includes(query) ||
                    branch.code.toLowerCase().includes(query) ||
                    (branch.address ?? '').toLowerCase().includes(query) ||
                    (branch.pic_name ?? '').toLowerCase().includes(query)
                );
            });
    }, [branches, search, statusFilter]);

    return (
        <>
            <Head title={t('branches.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading
                    variant="small"
                    title={t('branches.title')}
                    description={t('branches.description')}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('branches.search_placeholder')}
                                className="pl-9"
                            />
                        </div>

                        <ToggleGroup
                            type="single"
                            value={statusFilter}
                            onValueChange={(value) => {
                                if (value === 'all' || value === 'active' || value === 'inactive') {
                                    setStatusFilter(value);
                                }
                            }}
                            className="justify-start"
                        >
                            <ToggleGroupItem value="all" aria-label={t('branches.filters.all_aria')}>
                                {t('branches.filters.all')}
                            </ToggleGroupItem>
                            <ToggleGroupItem value="active" aria-label={t('branches.filters.active_aria')}>
                                {t('branches.filters.active')}
                            </ToggleGroupItem>
                            <ToggleGroupItem value="inactive" aria-label={t('branches.filters.inactive_aria')}>
                                {t('branches.filters.inactive')}
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="text-sm text-muted-foreground">
                            {t('branches.stats', { total: stats.total, active: stats.active, inactive: stats.inactive })}
                        </div>
                        {orgAbilities.branches.create && (
                            <Link href={BranchController.create.url()}>
                                <Button type="button">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('branches.actions.new')}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    {filtered.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">
                            {t('branches.empty')}
                        </Card>
                    ) : (
                        filtered.map((branch) => (
                            <Card key={branch.id} className="flex items-center justify-between p-4">
                                <CardContent className="flex w-full items-center justify-between gap-4 p-0">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="truncate font-medium">{branch.name}</div>
                                            <Badge variant="secondary">{branch.code}</Badge>
                                            {branch.is_active ? (
                                                <Badge>{t('common.active')}</Badge>
                                            ) : (
                                                <Badge variant="outline">{t('common.inactive')}</Badge>
                                            )}
                                        </div>
                                        <div className="truncate text-sm text-muted-foreground">
                                            {branch.address ?? '—'}
                                        </div>
                                        <div className="truncate text-sm text-muted-foreground">
                                            {branch.pic_name ? `PIC: ${branch.pic_name}` : 'PIC: —'}
                                            {branch.pic_email ? ` • ${branch.pic_email}` : ''}
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Link href={BranchController.show.url({ branch: branch.id })}>
                                            <Button type="button" variant="secondary">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                {t('branches.actions.view')}
                                            </Button>
                                        </Link>
                                        {orgAbilities.branches.update && (
                                            <Link href={BranchController.edit.url({ branch: branch.id })}>
                                                <Button type="button" variant="outline">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    {t('branches.actions.edit')}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

BranchesIndex.layout = {
    breadcrumbs: [{ title: 'branches.title', href: branchesIndex() }],
};
