import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Building2, Clock4, KeyRound, ShieldCheck, UsersRound } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { home, login, register } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const page = usePage();
    const { name } = page.props as { name: string };
    const { t } = useTranslation();
    const titleText = title ? t(title) : '';
    const descriptionText = description ? t(description) : '';
    const isRegisterPage = page.url.includes('/register');

    const showcaseImage = isRegisterPage ? '/assets-image/images/assets (5).jpg' : '/assets-image/images/assets (2).jpg';
    const showcaseTitle = isRegisterPage
        ? 'Mulai bangun pengelolaan aset yang lebih rapi dari awal.'
        : 'Masuk lagi dan lanjutkan pengelolaan aset yang sudah berjalan.';
    const showcaseDescription = isRegisterPage
        ? 'Cocok untuk tim yang ingin meninggalkan file tercecer dan mulai kerja dengan alur aset yang lebih tertata.'
        : 'Pantau aset, maintenance, audit, dan nilai buku dari satu sistem yang tetap nyambung antar tim.';

    return (
        <div className="grid min-h-svh grid-cols-1 bg-background lg:grid-cols-2">
            <div className="relative hidden overflow-hidden border-r border-border lg:block">
                <img src={showcaseImage} alt="Visual pengelolaan aset" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.74))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%)]" />

                <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                    <div className="space-y-10">
                        <Link href={home()} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
                                <AppLogoIcon className="size-7 fill-current text-white" />
                            </span>
                            <span>{name}</span>
                        </Link>

                        <div className="max-w-xl space-y-5">
                            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Asetku</div>
                            <h1 className="text-4xl font-semibold leading-tight">{showcaseTitle}</h1>
                            <p className="max-w-lg text-base leading-8 text-white/85">{showcaseDescription}</p>
                        </div>

                        <div className="max-w-xl space-y-3">
                            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                                {t('auth.enterprise.trust_title')}
                            </div>
                            <ul className="grid gap-3 text-sm text-white/92">
                                <TrustItem icon={KeyRound} text={t('auth.enterprise.trust_items.sso')} />
                                <TrustItem icon={ShieldCheck} text={t('auth.enterprise.trust_items.two_factor')} />
                                <TrustItem icon={UsersRound} text={t('auth.enterprise.trust_items.multi_org')} />
                                <TrustItem icon={Building2} text={t('auth.enterprise.trust_items.rbac')} />
                                <TrustItem icon={Clock4} text={t('auth.enterprise.trust_items.access_policy')} />
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="max-w-sm text-xs leading-6 text-white/75">{t('auth.enterprise.help')}</div>
                        <Link href={home()}>
                            <Button variant="secondary" className="rounded-full border border-white/10 bg-white/12 text-white backdrop-blur hover:bg-white/18">
                                Lihat landing page
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-12">
                <div className="mx-auto w-full max-w-sm space-y-6 sm:max-w-[440px]">
                    <div className="flex items-center justify-between lg:hidden">
                        <Link href={home()} className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-6 fill-current" />
                            </span>
                            <span className="text-base font-semibold tracking-tight">{name}</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            {isRegisterPage ? (
                                <Link href={login()}>
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        Masuk
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={register()}>
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        Daftar
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 lg:hidden">
                        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Asetku</div>
                        <div className="text-2xl font-semibold leading-tight text-foreground">{showcaseTitle}</div>
                        <div className="text-sm leading-7 text-muted-foreground">{showcaseDescription}</div>
                    </div>

                    <Card className="rounded-[28px] border-border bg-card shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                        <CardHeader className="space-y-2 px-6 pb-4 pt-6 sm:px-7">
                            <CardTitle className="text-2xl tracking-tight">{titleText}</CardTitle>
                            <CardDescription className="text-sm leading-7 text-balance">{descriptionText}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 sm:px-7">{children}</CardContent>
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
        <li className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/12 text-white">
                <Icon className="h-4 w-4" />
            </span>
            <span className="leading-6 text-white/92">{text}</span>
        </li>
    );
}
