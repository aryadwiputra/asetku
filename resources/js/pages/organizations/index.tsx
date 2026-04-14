import { Head, Link, router, usePage } from '@inertiajs/react';
import OrganizationSwitchController from '@/actions/App/Http/Controllers/OrganizationSwitchController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

    return (
        <>
            <Head title="Organizations" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Heading
                    variant="small"
                    title="Organizations"
                    description="Manage organizations and switch context."
                />

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Current: {organization?.name ?? 'None'}
                    </div>

                    <Link href={onboardingProfile()}>
                        <Button type="button">New organization</Button>
                    </Link>
                </div>

                <div className="grid gap-3">
                    {organizations.length === 0 ? (
                        <Card className="p-6 text-sm text-muted-foreground">
                            No organizations yet. Create one to get started.
                        </Card>
                    ) : (
                        organizations.map((org) => (
                            <Card key={org.id} className="flex items-center justify-between p-4">
                                <div className="min-w-0">
                                    <div className="truncate font-medium">{org.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {org.slug} {org.role ? `• ${org.role}` : ''}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant={currentOrganizationId === org.id ? 'secondary' : 'default'}
                                    disabled={currentOrganizationId === org.id}
                                    onClick={() =>
                                        router.post(
                                            OrganizationSwitchController({ organization: org.id }).url,
                                        )
                                    }
                                >
                                    {currentOrganizationId === org.id ? 'Active' : 'Switch'}
                                </Button>
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
