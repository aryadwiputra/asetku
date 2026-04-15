import { Head, router } from '@inertiajs/react';
import { Camera, WifiOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const detectorRef = useRef<BarcodeDetector | null>(null);
    const rafRef = useRef<number | null>(null);

    const [supported, setSupported] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [manual, setManual] = useState('');
    const [pending, setPending] = useState<PendingScan[]>(() => loadPending());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setSupported(typeof window !== 'undefined' && 'BarcodeDetector' in window);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function start() {
        setError(null);

        if (!videoRef.current) {
            return;
        }

        if (!supported) {
            setError(t('qr.scan.not_supported'));
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
            setScanning(true);

            const tick = async () => {
                if (!videoRef.current || !detectorRef.current) {
                    return;
                }

                try {
                    const barcodes = await detectorRef.current.detect(videoRef.current);
                    const raw = barcodes[0]?.rawValue;
                    if (raw) {
                        handleScan(raw);
                        return;
                    }
                } catch {
                    // ignore frame errors
                }

                rafRef.current = window.requestAnimationFrame(tick);
            };

            rafRef.current = window.requestAnimationFrame(tick);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    }

    function stop() {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }

        setScanning(false);
    }

    function parseToken(raw: string): string | null {
        const trimmed = raw.trim();
        if (trimmed === '') {
            return null;
        }

        // If QR contains a full URL, extract /q/{token}.
        try {
            const url = new URL(trimmed);
            const match = url.pathname.match(/^\/q\/([^/]+)$/);
            if (match?.[1]) {
                return match[1];
            }
        } catch {
            // not a URL
        }

        // If it already looks like a token.
        if (trimmed.length >= 16) {
            return trimmed;
        }

        return null;
    }

    function handleScan(raw: string) {
        const token = parseToken(raw);
        if (!token) {
            return;
        }

        stop();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head title={t('qr.scan.title')} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
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
                            <Button onClick={stop} variant="outline" className="w-full sm:w-auto">
                                {t('qr.scan.actions.stop')}
                            </Button>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-lg border">
                        <video ref={videoRef} className="h-72 w-full bg-black object-cover" playsInline muted />
                    </div>

                    {error ? <div className="text-sm text-destructive">{error}</div> : null}
                </Card>

                <Card className="space-y-4 p-6">
                    <div className="text-sm font-medium">{t('qr.scan.manual_title')}</div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input value={manual} onChange={(e) => setManual(e.target.value)} placeholder={t('qr.scan.manual_placeholder')} />
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => handleScan(manual)}
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

ScanIndex.layout = null;

