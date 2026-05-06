import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
    return (
        <div
            className={cn(
                'card-gradient-border bg-card ring-1 ring-border rounded-xl p-5 sm:p-6 flex flex-col transition-all duration-200 shadow-card hover:shadow-card-hover hover:-translate-y-0.5',
                className,
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-muted-foreground font-medium text-xs sm:text-sm tracking-wide">{title}</h3>
                {icon && (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                        {icon}
                    </div>
                )}
            </div>
            <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{value}</span>
                {trend && (
                    <span
                        className={cn(
                            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                            trend.isPositive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-destructive/10 text-destructive',
                        )}
                    >
                        {trend.isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                        {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            {description && <p className="text-muted-foreground text-xs sm:text-sm mt-1.5">{description}</p>}
        </div>
    );
}
