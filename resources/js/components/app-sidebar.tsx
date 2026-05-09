import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, CalendarDays, ChevronDown, ClipboardList, ClipboardCheck, FolderGit2, History, LayoutGrid, MapPin, Package, Plus, Settings, TrendingDown, Trash2, UploadCloud, Users, Wrench } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { OrganizationSwitcherMenu } from '@/components/organization-switcher-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useTranslation } from '@/hooks/use-translation';
import { dashboard } from '@/routes';
import { edit as editAppSettings } from '@/routes/app-settings';
import { index as activityIndex } from '@/routes/activity';
import { index as featureFlagsIndex } from '@/routes/feature-flags';
import { edit as editMailSettings } from '@/routes/mail-settings';
import { index as settingsIndex } from '@/routes/settings';
import { index as usersIndex } from '@/routes/users';
import { index as mediaIndex } from '@/routes/media';
import { index as organizationsIndex } from '@/routes/organizations';
import { index as branchesIndex } from '@/routes/branches';
import { index as masterDataIndex } from '@/routes/master-data';
import { create as assetsCreate, index as assetsIndex } from '@/routes/assets';
import { index as assetsImportIndex } from '@/routes/assets/import';
import { index as assetLifecycleIndex } from '@/routes/assets/lifecycle';
import { index as depreciationIndex } from '@/routes/depreciation';
import { index as disposalsIndex } from '@/routes/disposals';
import { index as workOrdersIndex } from '@/routes/work-orders';
import { my as workOrdersMy } from '@/routes/work-orders';
import { index as maintenanceSchedulesIndex } from '@/routes/maintenance-schedules';
import { index as maintenanceChecklistsIndex } from '@/routes/maintenance-checklists';
import { index as techniciansIndex } from '@/routes/technicians';
import { index as maintenanceCalendarIndex } from '@/routes/maintenance-calendar';
import { index as inventoryReportIndex } from '@/routes/reports/inventory';
import { index as auditSchedulesIndex } from '@/actions/App/Http/Controllers/AuditScheduleController';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { permissions } = usePage().props;
    const { orgAbilities } = usePage().props as {
        orgAbilities?: { branches?: { view?: boolean } };
    };
    const { moduleAbilities } = usePage().props as {
        moduleAbilities?: {
            assets?: { view?: boolean; create?: boolean; import?: boolean };
            workOrders?: { viewIndex?: boolean; viewAssigned?: boolean };
            maintenanceSchedules?: { view?: boolean };
            audit?: { view?: boolean; create?: boolean };
            reports?: { inventoryView?: boolean };
        };
    };
    const { masterDataAbilities } = usePage().props as {
        masterDataAbilities?: Record<string, { view: boolean }>;
    };
    const userPermissions = permissions as string[];
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { t } = useTranslation();

    const canViewBranches = orgAbilities?.branches?.view === true;
    const canViewAssets = moduleAbilities?.assets?.view === true;
    const canCreateAsset = moduleAbilities?.assets?.create === true;
    const canImportAssets = moduleAbilities?.assets?.import === true;
    const canViewWorkOrders = moduleAbilities?.workOrders?.viewIndex === true;
    const canViewAssignedWorkOrders = moduleAbilities?.workOrders?.viewAssigned === true;
    const canViewMaintenanceSchedules = moduleAbilities?.maintenanceSchedules?.view === true;
    const canViewAudit = moduleAbilities?.audit?.view === true;

    const workspaceNavItems: NavItem[] = [
        {
            title: t('common.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('common.organizations'),
            href: organizationsIndex(),
            icon: Building2,
        },
        ...(canViewBranches
            ? [
                  {
                      title: t('common.branches'),
                      href: branchesIndex(),
                      icon: MapPin,
                  },
              ]
            : []),
    ];

    const assetCoreNavItems: NavItem[] = canViewAssets
        ? [
              {
                  title: t('common.assets'),
                  href: assetsIndex(),
                  icon: Package,
              },
              ...(canImportAssets
                  ? [
                        {
                            title: t('common.asset_import'),
                            href: assetsImportIndex(),
                            icon: UploadCloud,
                        },
                    ]
                  : []),
          ]
        : [];

    const maintenanceNavItems: NavItem[] = canViewAssets
        ? [
              {
                  title: t('common.maintenance_calendar'),
                  href: maintenanceCalendarIndex(),
                  icon: CalendarDays,
              },
              ...(canViewWorkOrders
                  ? [
                        {
                            title: t('common.work_orders'),
                            href: workOrdersIndex(),
                            icon: Wrench,
                        },
                    ]
                  : []),
              ...(canViewAssignedWorkOrders
                  ? [
                        {
                            title: t('common.my_work_orders'),
                            href: workOrdersMy(),
                            icon: ClipboardList,
                        },
                    ]
                  : []),
              ...(canViewMaintenanceSchedules
                  ? [
                        {
                            title: t('common.maintenance_schedules'),
                            href: maintenanceSchedulesIndex(),
                            icon: ClipboardList,
                        },
                    ]
                  : []),
              {
                  title: t('common.maintenance_checklists'),
                  href: maintenanceChecklistsIndex(),
                  icon: ClipboardList,
              },
              {
                  title: t('common.technicians'),
                  href: techniciansIndex(),
                  icon: Users,
              },
          ]
        : [];

    const operationsNavItems: NavItem[] = canViewAssets
        ? [
              {
                  title: t('common.asset_lifecycle'),
                  href: assetLifecycleIndex(),
                  icon: History,
              },
              {
                  title: t('common.disposals'),
                  href: disposalsIndex(),
                  icon: Trash2,
              },
          ]
        : [];

    const financeNavItems: NavItem[] = canViewAssets
        ? [
              {
                  title: t('common.depreciation'),
                  href: depreciationIndex(),
                  icon: TrendingDown,
              },
          ]
        : [];

    const auditNavItems: NavItem[] = canViewAudit
        ? [
              {
                  title: t('audit.title'),
                  href: auditSchedulesIndex(),
                  icon: ClipboardCheck,
              },
          ]
        : [];

    const adminNavItems: NavItem[] = [
        ...(userPermissions.includes('user.view')
            ? [
                  {
                      title: t('common.user_management'),
                      href: usersIndex(),
                      icon: Users,
                      },
              ]
            : []),
        ...(userPermissions.includes('media.manage')
            ? [
                  {
                      title: t('common.media'),
                      href: mediaIndex(),
                      icon: UploadCloud,
                  },
              ]
            : []),
    ];

    const canManageApp = userPermissions.includes('settings.app.manage');
    const canManageMail = userPermissions.includes('settings.mail.manage');
    const canManageFlags = userPermissions.includes('settings.flags.manage');
    const canViewActivity = userPermissions.includes('activity.view');
    const canViewMasterData = masterDataAbilities?.asset_statuses?.view === true;
    const canViewInventoryReport = moduleAbilities?.reports?.inventoryView === true;

    const settingsItems: NavItem[] = [
        ...(canViewMasterData ? [{ title: t('common.master_data'), href: masterDataIndex(), icon: null }] : []),
        ...(canManageApp ? [{ title: t('common.settings_app'), href: editAppSettings(), icon: null }] : []),
        ...(canManageMail ? [{ title: t('common.settings_mail'), href: editMailSettings(), icon: null }] : []),
        ...(canManageFlags ? [{ title: t('common.settings_feature_flags'), href: featureFlagsIndex(), icon: null }] : []),
        ...(canViewActivity ? [{ title: t('common.audit_log'), href: activityIndex(), icon: null }] : []),
    ];

    const reportsNavItems: NavItem[] = [
        ...(canViewInventoryReport
            ? [
                  {
                      title: t('common.inventory_report'),
                      href: inventoryReportIndex(),
                      icon: null,
                  },
              ]
            : []),
    ];

    const settingsActive =
        isCurrentOrParentUrl(settingsIndex()) ||
        settingsItems.some((item) => isCurrentOrParentUrl(item.href));

    const showSettings = canManageApp || canManageMail || canManageFlags || canViewActivity || canViewMasterData;
    const footerNavItems: NavItem[] = [
        {
            title: t('common.repository'),
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: t('common.documentation'),
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <OrganizationSwitcherMenu variant="sidebar" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain label={t('common.workspace')} items={workspaceNavItems} />
                {assetCoreNavItems.length > 0 ? (
                    <NavMain
                        label={t('common.assets')}
                        items={assetCoreNavItems}
                        action={
                            canCreateAsset ? (
                                <Link href={assetsCreate()} prefetch aria-label={t('common.new_asset')} title={t('common.new_asset')}>
                                    <Plus />
                                </Link>
                            ) : null
                        }
                    />
                ) : null}
                {maintenanceNavItems.length > 0 ? <NavMain label={t('common.maintenance')} items={maintenanceNavItems} /> : null}
                {operationsNavItems.length > 0 ? <NavMain label={t('common.operations')} items={operationsNavItems} /> : null}
                {financeNavItems.length > 0 ? <NavMain label={t('common.finance')} items={financeNavItems} /> : null}
                {auditNavItems.length > 0 ? <NavMain label={t('audit.title')} items={auditNavItems} /> : null}
                {reportsNavItems.length > 0 ? <NavMain label={t('common.reports')} items={reportsNavItems} /> : null}
                {adminNavItems.length > 0 ? <NavMain label={t('common.administration')} items={adminNavItems} /> : null}
                {showSettings && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                            {t('common.settings')}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Collapsible defaultOpen={settingsActive}>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={settingsActive}
                                            tooltip={{ children: t('common.settings') }}
                                            className="group transition-all duration-150"
                                        >
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground">
                                                <Settings className="size-4" />
                                            </span>
                                            <span>{t('common.settings')}</span>
                                            <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {settingsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isCurrentOrParentUrl(item.href)}
                                                    >
                                                        <Link href={item.href} prefetch>
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border pt-2">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
