import { Link } from '@inertiajs/react';
import { QrCode } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { index as scanIndex } from '@/routes/scan';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-svh bg-muted/30">
            <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
                <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <AppLogoIcon className="size-6 fill-current text-[var(--foreground)] dark:text-white" />
                        <span className="text-sm font-semibold tracking-tight">{t('qr.public.title')}</span>
                    </Link>

                    <Link href={scanIndex()}>
                        <Button variant="outline" size="sm">
                            <QrCode className="mr-2 h-4 w-4" />
                            {t('qr.actions.scan_again')}
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-6">{children}</main>
        </div>
    );
}
