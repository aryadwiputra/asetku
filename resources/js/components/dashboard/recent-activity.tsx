import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

export interface ActivityItem {
    id: string | number;
    user: string;
    action: string;
    target?: string;
    time: string;
    avatar?: string;
}

interface RecentActivityProps {
    items: ActivityItem[];
    title?: string;
    className?: string;
}

export function RecentActivity({ items, title, className }: RecentActivityProps) {
    const { t } = useTranslation();

    return (
        <div className={cn('card-gradient-border bg-card ring-1 ring-border rounded-xl p-6 shadow-card', className)}>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">{title ?? t('dashboard.recent_activity')}</h3>
            <div className="mt-5 flex flex-col">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                            <span className="text-muted-foreground text-lg">📋</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('dashboard.empty_states.recent_activity')}</p>
                    </div>
                ) : null}
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="group flex gap-4 items-start relative py-3 rounded-lg -mx-2 px-2 transition-colors duration-150 hover:bg-muted/40"
                    >
                        {/* Timeline connector */}
                        {index < items.length - 1 && (
                            <div className="absolute left-[1.45rem] top-[3.25rem] bottom-0 w-px bg-border" />
                        )}

                        <div className="size-10 rounded-full bg-surface flex items-center justify-center shrink-0 ring-1 ring-border overflow-hidden relative z-10">
                            {item.avatar ? (
                                <img src={item.avatar} alt={item.user} className="size-full object-cover" />
                            ) : (
                                <span className="text-foreground/70 font-medium text-sm">
                                    {item.user.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="text-sm text-foreground leading-snug">
                                <span className="font-medium">{item.user}</span>{' '}
                                <span className="text-muted-foreground">{item.action}</span>{' '}
                                {item.target && <span className="font-medium">{item.target}</span>}
                            </p>
                            <span className="text-xs text-muted-foreground/70">{item.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
