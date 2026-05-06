import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({
    label,
    action,
    items = [],
}: {
    label: string;
    action?: React.ReactNode;
    items: NavItem[];
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                {label}
            </SidebarGroupLabel>
            {action ? <SidebarGroupAction asChild>{action}</SidebarGroupAction> : null}
            <SidebarMenu>
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    'transition-all duration-150',
                                    active && 'bg-(--sidebar-active-bg) font-medium border-l-2 border-(--sidebar-active-border) rounded-l-none',
                                )}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <span
                                            className={cn(
                                                'flex size-6 shrink-0 items-center justify-center rounded-md transition-colors duration-150',
                                                active
                                                    ? 'bg-foreground/10 text-foreground'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            <item.icon className="size-4" />
                                        </span>
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
