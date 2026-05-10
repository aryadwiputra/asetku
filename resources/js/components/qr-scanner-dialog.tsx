import { Camera, Flashlight, FlashlightOff, X } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseQrToken, useQrScanner } from '@/hooks/use-qr-scanner';
import { useTranslation } from '@/hooks/use-translation';

type Props = {
    label: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onToken: (token: string) => void;
    title: string;
    unsupportedMessage: string;
    startLabel: string;
    stopLabel: string;
    triggerClassName?: string;
};

export function QrScannerDialog({
    label,
    open,
    onOpenChange,
    onToken,
    title,
    unsupportedMessage,
    startLabel,
    stopLabel,
    triggerClassName,
}: Props) {
    const { t } = useTranslation();
    const [manualValue, setManualValue] = useState('');
    const [manualError, setManualError] = useState<string | null>(null);
    const { error, flashlightAvailable, flashlightEnabled, scanning, supported, videoRef, start, stop, toggleFlashlight } = useQrScanner({
        t,
        unsupportedMessage,
        onDetected: (token) => {
            onOpenChange(false);
            onToken(token);
        },
    });

    function handleOpenChange(nextOpen: boolean) {
        onOpenChange(nextOpen);
        setManualError(null);

        if (!nextOpen) {
            setManualValue('');
        }

        if (!nextOpen) {
            stop();
        }
    }

    function handleManualOpen() {
        const token = parseQrToken(manualValue);

        if (!token) {
            setManualError(t('common.invalid_qr_token'));

            return;
        }

        setManualError(null);
        onOpenChange(false);
        onToken(token);
    }

    return (
        <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(true)} className={triggerClassName}>
                <Camera className="mr-2 h-4 w-4" />
                {label}
            </Button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>

                    {!supported ? (
                        <div className="space-y-4">
                            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">{unsupportedMessage}</div>
                            <div className="grid gap-2">
                                <Label htmlFor="qr-manual-token">{t('common.manual_qr_token')}</Label>
                                <Input
                                    id="qr-manual-token"
                                    value={manualValue}
                                    onChange={(e) => {
                                        setManualValue(e.target.value);
                                        if (manualError) {
                                            setManualError(null);
                                        }
                                    }}
                                    placeholder={t('common.manual_qr_token_placeholder')}
                                />
                                <InputError message={manualError ?? undefined} />
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                <Button onClick={handleManualOpen} className="w-full sm:w-auto">
                                    {t('common.open')}
                                </Button>
                                <Button variant="ghost" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
                                    <X className="mr-2 h-4 w-4" />
                                    {t('common.close')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <video ref={videoRef} className="aspect-video w-full rounded-lg border bg-black object-cover" playsInline muted />
                            {error ? (
                                <div className="rounded-lg border bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                            ) : (
                                <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                                    {t('common.camera_permission_tip')}
                                </div>
                            )}
                            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                {!scanning ? (
                                    <Button onClick={start} className="w-full sm:w-auto">
                                        {startLabel}
                                    </Button>
                                ) : (
                                    <Button variant="outline" onClick={stop} className="w-full sm:w-auto">
                                        {stopLabel}
                                    </Button>
                                )}
                                {scanning && flashlightAvailable ? (
                                    <Button variant="secondary" onClick={toggleFlashlight} className="w-full sm:w-auto">
                                        {flashlightEnabled ? (
                                            <FlashlightOff className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Flashlight className="mr-2 h-4 w-4" />
                                        )}
                                        {flashlightEnabled ? t('common.flashlight_off') : t('common.flashlight_on')}
                                    </Button>
                                ) : null}
                                <Button variant="ghost" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
                                    <X className="mr-2 h-4 w-4" />
                                    {t('common.close')}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
