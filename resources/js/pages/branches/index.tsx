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
            <Head title="Branches" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Branches"
                    description="Manage branches, contacts, and map locations."
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-80">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search branches…"
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
                            <ToggleGroupItem value="all" aria-label="All branches">
                                All
                            </ToggleGroupItem>
                            <ToggleGroupItem value="active" aria-label="Active branches">
                                Active
                            </ToggleGroupItem>
                            <ToggleGroupItem value="inactive" aria-label="Inactive branches">
                                Inactive
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <div className="text-sm text-muted-foreground">
                            {stats.total} total • {stats.active} active • {stats.inactive} inactive
                        </div>
                        {orgAbilities.branches.create && (
                            <Link href={BranchController.create.url()}>
                                <Button type="button">
                                    <Plus className="mr-2 h-4 w-4" />
                                    New
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-3">
                    {filtered.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">
                            No branches match your filters.
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
                                                <Badge>Active</Badge>
                                            ) : (
                                                <Badge variant="outline">Inactive</Badge>
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
                                                View
                                            </Button>
                                        </Link>
                                        {orgAbilities.branches.update && (
                                            <Link href={BranchController.edit.url({ branch: branch.id })}>
                                                <Button type="button" variant="outline">
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
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
    breadcrumbs: [{ title: 'Branches', href: branchesIndex() }],
};
