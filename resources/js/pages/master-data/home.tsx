import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, LayoutGrid } from 'lucide-react';

import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { index as masterDataIndex } from '@/routes/master-data';
import { index as assetStatusesIndex } from '@/routes/master-data/asset-statuses';
import { index as assetConditionsIndex } from '@/routes/master-data/asset-conditions';
import { index as assetClassesIndex } from '@/routes/master-data/asset-classes';
import { index as unitsIndex } from '@/routes/master-data/units';
import { index as departmentsIndex } from '@/routes/master-data/departments';
import { index as personInChargesIndex } from '@/routes/master-data/person-in-charges';
import { index as assetUsersIndex } from '@/routes/master-data/asset-users';
import { index as assetCategoriesIndex } from '@/routes/master-data/asset-categories';
import { index as assetLocationsIndex } from '@/routes/master-data/asset-locations';
import { index as vendorsIndex } from '@/routes/master-data/vendors';
import { index as warrantiesIndex } from '@/routes/master-data/warranties';
import { index as vendorContractsIndex } from '@/routes/vendor-contracts';
import { index as settingsIndex } from '@/routes/settings';

type MasterDataItem = {
    key: string;
    title: string;
    description: string;
    href: string;
};

export default function MasterDataHome() {
    const { orgRole } = usePage().props as { orgRole: string | null };
    const { t } = useTranslation();

    const items: MasterDataItem[] = [
        {
            key: 'asset_statuses',
            title: t('asset_statuses.title'),
            description: t('asset_statuses.description'),
            href: assetStatusesIndex.url(),
        },
        {
            key: 'asset_conditions',
            title: t('asset_conditions.title'),
            description: t('asset_conditions.description'),
            href: assetConditionsIndex.url(),
        },
        {
            key: 'asset_classes',
            title: t('asset_classes.title'),
            description: t('asset_classes.description'),
            href: assetClassesIndex.url(),
        },
        {
            key: 'units',
            title: t('units.title'),
            description: t('units.description'),
            href: unitsIndex.url(),
        },
        {
            key: 'departments',
            title: t('departments.title'),
            description: t('departments.description'),
            href: departmentsIndex.url(),
        },
        {
            key: 'person_in_charges',
            title: t('person_in_charges.title'),
            description: t('person_in_charges.description'),
            href: personInChargesIndex.url(),
        },
        {
            key: 'asset_users',
            title: t('asset_users.title'),
            description: t('asset_users.description'),
            href: assetUsersIndex.url(),
        },
        {
            key: 'asset_categories',
            title: t('asset_categories.title'),
            description: t('asset_categories.description'),
            href: assetCategoriesIndex.url(),
        },
        {
            key: 'asset_locations',
            title: t('asset_locations.title'),
            description: t('asset_locations.description'),
            href: assetLocationsIndex.url(),
        },
        {
            key: 'vendors',
            title: t('vendors.title'),
            description: t('vendors.description'),
            href: vendorsIndex.url(),
        },
        {
            key: 'vendor_contracts',
            title: t('vendor_contracts.title'),
            description: t('vendor_contracts.description'),
            href: vendorContractsIndex.url(),
        },
        {
            key: 'warranties',
            title: t('warranties.title'),
            description: t('warranties.description'),
            href: warrantiesIndex.url(),
        },
    ];

    return (
        <>
            <Head title={t('master_data.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <Heading variant="small" title={t('master_data.title')} description={t('master_data.description')} />

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => {
                        const card = (
                            <Card className={`h-full ${item.href ? 'transition hover:bg-muted/30' : 'opacity-60'}`}>
                                <CardContent className="flex h-full flex-col gap-3 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="truncate font-medium">{item.title}</div>
                                            <div className="min-h-10 text-sm text-muted-foreground line-clamp-2">{item.description}</div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
                                        <LayoutGrid className="h-4 w-4" />
                                        <span>{t('master_data.actions.open')}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );

                        return item.href ? (
                            <Link key={item.key} href={item.href} className="block h-full">
                                {card}
                            </Link>
                        ) : (
                            <div key={item.key} className="h-full">
                                {card}
                            </div>
                        );
                    })}
                </div>

                {orgRole ? (
                    <div className="text-sm text-muted-foreground">
                        <Building2 className="mr-2 inline h-4 w-4" />
                        {t('master_data.current_role', { role: orgRole })}
                        <Badge className="ml-2" variant="secondary">
                            {t('common.active')}
                        </Badge>
                    </div>
                ) : null}
            </div>
        </>
    );
}

MasterDataHome.layout = {
    breadcrumbs: [
        { title: 'common.settings', href: settingsIndex.url() },
        { title: 'common.master_data', href: masterDataIndex.url() },
    ],
};
