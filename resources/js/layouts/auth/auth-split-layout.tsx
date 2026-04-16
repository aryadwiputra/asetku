import { Link, usePage } from '@inertiajs/react';
import { Building2, Clock4, KeyRound, ShieldCheck, UsersRound } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const { t } = useTranslation();
    const titleText = title ? t(title) : '';
    const descriptionText = description ? t(description) : '';

    return (
        <div className="relative grid min-h-svh grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between overflow-hidden border-r bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-10 text-white lg:flex">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_55%)]" />

                <div className="relative z-10 space-y-10">
                    <Link href={home()} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                            <AppLogoIcon className="size-7 fill-current text-white" />
                        </span>
                        <span>{name}</span>
                    </Link>

                    <div className="space-y-4">
                        <div className="text-2xl font-semibold leading-tight">{t('auth.enterprise.tagline')}</div>

                        <div className="space-y-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-white/70">
                                {t('auth.enterprise.trust_title')}
                            </div>
                            <ul className="space-y-3 text-sm text-white/90">
                                <TrustItem icon={KeyRound} text={t('auth.enterprise.trust_items.sso')} />
                                <TrustItem icon={ShieldCheck} text={t('auth.enterprise.trust_items.two_factor')} />
                                <TrustItem icon={UsersRound} text={t('auth.enterprise.trust_items.multi_org')} />
                                <TrustItem icon={Building2} text={t('auth.enterprise.trust_items.rbac')} />
                                <TrustItem icon={Clock4} text={t('auth.enterprise.trust_items.access_policy')} />
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-white/70">
                    {t('auth.enterprise.help')}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center px-6 py-10 lg:px-10">
                <div className="w-full max-w-sm space-y-6 sm:max-w-[420px]">
                    <Link href={home()} className="flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-[var(--foreground)] dark:text-white sm:h-12" />
                    </Link>

                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader className="space-y-2 pb-4">
                            <CardTitle className="text-xl">{titleText}</CardTitle>
                            <CardDescription className="text-sm text-balance">{descriptionText}</CardDescription>
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function TrustItem({
    icon: Icon,
    text,
}: {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
}) {
    return (
        <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white">
                <Icon className="h-4 w-4" />
            </span>
            <span className="leading-6">{text}</span>
        </li>
    );
}
