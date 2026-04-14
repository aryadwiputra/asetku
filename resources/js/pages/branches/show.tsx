import { Head, Link } from '@inertiajs/react';
import BranchController from '@/actions/App/Http/Controllers/BranchController';
import BranchLocationPicker from '@/components/branch-location-picker';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { index as branchesIndex } from '@/routes/branches';

type Props = {
    branch: {
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
};

export default function ShowBranch({ branch }: Props) {
    return (
        <>
            <Head title={branch.name} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title={branch.name}
                    description={`${branch.code}${branch.is_active ? '' : ' • Inactive'}`}
                />

                <div className="flex items-center gap-3">
                    <Link href={BranchController.edit.url({ branch: branch.id })}>
                        <Button type="button">Edit</Button>
                    </Link>
                    <Link href={branchesIndex()}>
                        <Button type="button" variant="outline">
                            Back
                        </Button>
                    </Link>
                </div>

                <Card className="max-w-2xl space-y-2 p-6 text-sm">
                    <div className="flex justify-between">
                        <div className="text-muted-foreground">Address</div>
                        <div className="text-right">{branch.address ?? '-'}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-muted-foreground">PIC</div>
                        <div className="text-right">{branch.pic_name ?? '-'}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-muted-foreground">Email</div>
                        <div className="text-right">{branch.pic_email ?? '-'}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-muted-foreground">Phone</div>
                        <div className="text-right">{branch.pic_phone ?? '-'}</div>
                    </div>
                </Card>

                <Card className="max-w-2xl space-y-4 p-6">
                    <div className="text-sm font-medium">Map</div>
                    <BranchLocationPicker
                        latitude={branch.latitude}
                        longitude={branch.longitude}
                        onChange={() => {}}
                        readOnly
                    />
                    <div className="text-sm text-muted-foreground">
                        {branch.latitude && branch.longitude
                            ? `${branch.latitude}, ${branch.longitude}`
                            : 'No coordinates set.'}
                    </div>
                </Card>
            </div>
        </>
    );
}

ShowBranch.layout = {
    breadcrumbs: [{ title: 'Branches', href: branchesIndex() }],
};
