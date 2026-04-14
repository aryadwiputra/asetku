import { Form, Head, Link } from '@inertiajs/react';
import { useCallback, useState } from 'react';

import BranchController from '@/actions/App/Http/Controllers/BranchController';
import BranchLocationPicker from '@/components/branch-location-picker';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export default function EditBranch({ branch }: Props) {
    const [latitude, setLatitude] = useState<number | null>(branch.latitude);
    const [longitude, setLongitude] = useState<number | null>(branch.longitude);

    const handleLocationChange = useCallback((value: { latitude: number; longitude: number }) => {
        setLatitude(value.latitude);
        setLongitude(value.longitude);
    }, []);

    return (
        <>
            <Head title={`Edit ${branch.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title="Edit branch" description={branch.name} />

                <Form
                    {...BranchController.update.form({ branch: branch.id })}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <Card className="space-y-4 p-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required defaultValue={branch.name} />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input id="code" name="code" required defaultValue={branch.code} />
                                    <InputError message={errors.code} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" defaultValue={branch.address ?? ''} />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="pic_name">PIC name</Label>
                                    <Input id="pic_name" name="pic_name" defaultValue={branch.pic_name ?? ''} />
                                    <InputError message={errors.pic_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="pic_email">PIC email</Label>
                                    <Input id="pic_email" name="pic_email" type="email" defaultValue={branch.pic_email ?? ''} />
                                    <InputError message={errors.pic_email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="pic_phone">PIC phone</Label>
                                    <Input id="pic_phone" name="pic_phone" defaultValue={branch.pic_phone ?? ''} />
                                    <InputError message={errors.pic_phone} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="grid gap-1">
                                        <Label htmlFor="is_active">Active</Label>
                                        <div className="text-sm text-muted-foreground">Inactive branches stay in history.</div>
                                    </div>
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked={branch.is_active}
                                        value="1"
                                    />
                                </div>
                                <InputError message={errors.is_active} />
                            </Card>

                            <Card className="space-y-4 p-6">
                                <div className="text-sm font-medium">Location (optional)</div>
                                <BranchLocationPicker latitude={latitude} longitude={longitude} onChange={handleLocationChange} />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input
                                            id="latitude"
                                            name="latitude"
                                            value={latitude ?? ''}
                                            onChange={(e) => setLatitude(e.target.value === '' ? null : Number(e.target.value))}
                                        />
                                        <InputError message={errors.latitude} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input
                                            id="longitude"
                                            name="longitude"
                                            value={longitude ?? ''}
                                            onChange={(e) => setLongitude(e.target.value === '' ? null : Number(e.target.value))}
                                        />
                                        <InputError message={errors.longitude} />
                                    </div>
                                </div>
                            </Card>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                                <Link href={branchesIndex()}>
                                    <Button type="button" variant="outline">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditBranch.layout = {
    breadcrumbs: [
        { title: 'Branches', href: branchesIndex() },
        { title: 'Edit', href: branchesIndex() },
    ],
};
