import { Head, router } from '@inertiajs/react';
import { Camera, Flashlight, FlashlightOff, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { parseQrToken, useQrScanner } from '@/hooks/use-qr-scanner';
import { useTranslation } from '@/hooks/use-translation';
import { show as qrShow } from '@/routes/qr';

type PendingScan = { token: string; scanned_at: string };

function loadPending(): PendingScan[] {
    try {
        return JSON.parse(localStorage.getItem('pending_scans') || '[]') as PendingScan[];
    } catch {
        return [];
    }
}

function savePending(items: PendingScan[]) {
    localStorage.setItem('pending_scans', JSON.stringify(items.slice(-50)));
}

export default function ScanIndex() {
    const { t } = useTranslation();
    const [manual, setManual] = useState('');
    const [pending, setPending] = useState<PendingScan[]>(() => loadPending());
    const {
        error,
        flashlightAvailable,
        flashlightEnabled,
        scanning,
        supported,
        toggleFlashlight,
        videoRef,
        start,
        stop,
    } = useQrScanner({
        t,
        unsupportedMessage: t('qr.scan.not_supported'),
        onDetected: (token) => {
            if (!navigator.onLine) {
                const next = [...pending, { token, scanned_at: new Date().toISOString() }];

                setPending(next);
                savePending(next);

                return;
            }

            router.visit(qrShow(token).url);
        },
    });

    function handleManualOpen() {
        const token = parseQrToken(manual);

        if (!token) {
            return;
        }

        if (!navigator.onLine) {
            const next = [...pending, { token, scanned_at: new Date().toISOString() }];

            setPending(next);
            savePending(next);

            return;
        }

        router.visit(qrShow(token).url);
    }

    function flushPending() {
        const items = loadPending();

        if (items.length === 0) {
            return;
        }

        const token = items[items.length - 1]?.token;
        savePending([]);
        setPending([]);

        if (token) {
            router.visit(qrShow(token).url);
        }
    }

    useEffect(() => {
        function onOnline() {
            flushPending();
        }

        window.addEventListener('online', onOnline);

        return () => window.removeEventListener('online', onOnline);
    }, []);

    return (
        <>
            <Head title={t('qr.scan.title')} />

            <div className="flex w-full flex-1 flex-col gap-6">
                <Heading variant="small" title={t('qr.scan.title')} description={t('qr.scan.description')} />

                <Card className="space-y-4 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                            {supported ? t('qr.scan.supported') : t('qr.scan.not_supported')}
                        </div>
                        {!scanning ? (
                            <Button onClick={start} className="w-full sm:w-auto" disabled={!supported}>
                                <Camera className="mr-2 h-4 w-4" />
                                {t('qr.scan.actions.start')}
                            </Button>
                        ) : (
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                {flashlightAvailable ? (
                                    <Button onClick={toggleFlashlight} variant="secondary" className="w-full sm:w-auto">
                                        {flashlightEnabled ? (
                                            <FlashlightOff className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Flashlight className="mr-2 h-4 w-4" />
                                        )}
                                        {flashlightEnabled ? t('common.flashlight_off') : t('common.flashlight_on')}
                                    </Button>
                                ) : null}
                                <Button onClick={stop} variant="outline" className="w-full sm:w-auto">
                                    {t('qr.scan.actions.stop')}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <video ref={videoRef} className="h-72 w-full bg-black object-cover" playsInline muted />
                    </div>

                    {error ? (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    ) : (
                        <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                            {t('common.camera_permission_tip')}
                        </div>
                    )}
                </Card>

                <Card className="space-y-4 p-6">
                    <div className="text-sm font-medium">{t('qr.scan.manual_title')}</div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input value={manual} onChange={(e) => setManual(e.target.value)} placeholder={t('qr.scan.manual_placeholder')} />
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={handleManualOpen}
                        >
                            {t('common.open')}
                        </Button>
                    </div>
                </Card>

                {!navigator.onLine || pending.length > 0 ? (
                    <Card className="space-y-3 p-6">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <WifiOff className="h-4 w-4" />
                            {t('qr.scan.offline.title')}
                        </div>
                        <div className="text-sm text-muted-foreground">{t('qr.scan.offline.description')}</div>
                        {pending.length > 0 ? (
                            <div className="space-y-2">
                                {pending.slice(-5).map((p, idx) => (
                                    <div key={`${p.token}-${idx}`} className="rounded-md border p-3 text-xs">
                                        <div className="break-all">{p.token}</div>
                                        <div className="mt-1 text-muted-foreground">{new Date(p.scanned_at).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </Card>
                ) : null}
            </div>
        </>
    );
}

// Uses PublicLayout via inertia layout resolver.
