import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import { show as qrShow } from '@/routes/qr';
import { useTranslation } from '@/hooks/use-translation';
import { toAbsoluteUrl } from '@/lib/utils';

type Asset = {
    id: number;
    code: string;
    name: string;
    qr_token: string;
};

type Props = {
    size: string;
    assets: Asset[];
};

export default function AssetLabelsPrint({ assets }: Props) {
    const { t } = useTranslation();

    useEffect(() => {
        let cancelled = false;

        async function renderCodes() {
            try {
                const [qrcodeMod, jsbarcodeMod] = await Promise.all([import('qrcode'), import('jsbarcode')]);

                const QRCode = (qrcodeMod as any).default ?? (qrcodeMod as any);
                const JsBarcode = (jsbarcodeMod as any).default ?? (jsbarcodeMod as any);

                if (cancelled) {
                    return;
                }

                for (const asset of assets) {
                    const qrUrl = toAbsoluteUrl(qrShow(asset.qr_token).url);

                    const qrCanvas = document.querySelector<HTMLCanvasElement>(`canvas[data-qr="${asset.id}"]`);
                    const barcodeSvg = document.querySelector<SVGSVGElement>(`svg[data-barcode="${asset.id}"]`);

                    if (qrCanvas) {
                        await QRCode.toCanvas(qrCanvas, qrUrl, { margin: 1, width: 120 });
                    }

                    if (barcodeSvg) {
                        JsBarcode(barcodeSvg, asset.code, { format: 'CODE128', displayValue: false, height: 30, margin: 0 });
                    }
                }
            } catch {
                // If code libraries aren't available, labels still show code text.
            }
        }

        renderCodes();

        return () => {
            cancelled = true;
        };
    }, [assets]);

    return (
        <>
            <Head title={t('labels.title')} />

            <div className="p-6 print:p-0">
                <div className="mb-4 flex items-center justify-between print:hidden">
                    <div className="text-sm text-muted-foreground">{t('labels.hint_print')}</div>
                    <button className="rounded-md border px-3 py-2 text-sm" onClick={() => window.print()}>
                        {t('labels.actions.print')}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 print:grid-cols-3 print:gap-2">
                    {assets.map((asset) => (
                        <div key={asset.id} className="break-inside-avoid rounded-lg border p-3 print:border print:p-2">
                            <div className="text-xs font-semibold">{asset.code}</div>
                            <div className="mt-0.5 max-h-8 overflow-hidden text-[11px] text-muted-foreground">{asset.name}</div>

                            <div className="mt-2 flex items-center justify-between gap-2">
                                <canvas data-qr={asset.id} className="h-[120px] w-[120px] border" />
                                <div className="flex-1">
                                    <svg data-barcode={asset.id} className="h-10 w-full" />
                                    <div className="mt-1 text-[10px] text-muted-foreground">{toAbsoluteUrl(qrShow(asset.qr_token).url)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @page { size: A4; margin: 10mm; }
                .break-inside-avoid { break-inside: avoid; }
            `}</style>
        </>
    );
}

AssetLabelsPrint.layout = null;
