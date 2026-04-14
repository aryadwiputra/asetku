import { Head, Link } from '@inertiajs/react';
import BranchController from '@/actions/App/Http/Controllers/BranchController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    return (
        <>
            <Head title="Branches" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Branches"
                    description="Manage branches and locations."
                />

                <div className="flex items-center justify-end">
                    <Link href={BranchController.create.url()}>
                        <Button type="button">New branch</Button>
                    </Link>
                </div>

                <div className="grid gap-3">
                    {branches.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">
                            No branches yet.
                        </Card>
                    ) : (
                        branches.map((branch) => (
                            <Card key={branch.id} className="flex items-center justify-between p-4">
                                <div className="min-w-0">
                                    <div className="truncate font-medium">
                                        {branch.name} {branch.is_active ? '' : '(Inactive)'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{branch.code}</div>
                                </div>

                                <Link href={BranchController.show.url({ branch: branch.id })}>
                                    <Button type="button" variant="secondary">
                                        View
                                    </Button>
                                </Link>
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
