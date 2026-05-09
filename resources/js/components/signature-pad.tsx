import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onClear: () => void;
    initialData?: string;
}

export function SignaturePad({ onSave, onClear, initialData }: SignaturePadProps) {
    const { t } = useTranslation();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (initialData) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                setHasSignature(true);
            };
            img.src = initialData;
        }
    }, [initialData]);

    const getPosition = useCallback(
        (e: MouseEvent | TouchEvent) => {
            const canvas = canvasRef.current;
            if (!canvas) return { x: 0, y: 0 };

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            if ('touches' in e) {
                return {
                    x: (e.touches[0].clientX - rect.left) * scaleX,
                    y: (e.touches[0].clientY - rect.top) * scaleY,
                };
            }

            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY,
            };
        },
        [],
    );

    const startDrawing = useCallback(
        (e: MouseEvent | TouchEvent) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx) return;

            const pos = getPosition(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            setIsDrawing(true);
        },
        [getPosition],
    );

    const draw = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx) return;

            const pos = getPosition(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            setHasSignature(true);
        },
        [isDrawing, getPosition],
    );

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    const handleClear = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        onClear();
    }, [onClear]);

    const handleSave = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
    }, [onSave]);

    return (
        <div className="space-y-2">
            <div className="rounded-md border bg-white overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleClear}>
                    {t('common.clear')}
                </Button>
                <Button type="button" size="sm" onClick={handleSave} disabled={!hasSignature}>
                    {t('common.save')}
                </Button>
            </div>
        </div>
    );
}
