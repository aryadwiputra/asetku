import { useEffect, useRef, useState } from 'react';

type TranslationFn = (key: string, replacements?: Record<string, string | number>) => string;

type TorchCapabilities = {
    torch?: boolean;
    fillLightMode?: string[];
};

type TorchTrack = MediaStreamTrack & {
    getCapabilities?: () => TorchCapabilities;
    getSettings?: () => { torch?: boolean };
    applyConstraints: (constraints: MediaTrackConstraints & { advanced?: Array<{ torch?: boolean }> }) => Promise<void>;
};

type UseQrScannerOptions = {
    t: TranslationFn;
    onDetected: (token: string) => void;
    unsupportedMessage: string;
};

export function parseQrToken(raw: string): string | null {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return null;
    }

    try {
        const url = new URL(trimmed);
        const match = url.pathname.match(/^\/q\/([^/]+)$/);

        if (match?.[1]) {
            return match[1];
        }
    } catch {
        // Ignore non-URL values.
    }

    return trimmed.length >= 16 ? trimmed : null;
}

export function useQrScanner({ t, onDetected, unsupportedMessage }: UseQrScannerOptions) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const detectorRef = useRef<BarcodeDetector | null>(null);
    const rafRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const onDetectedRef = useRef(onDetected);

    const [supported] = useState(() => typeof window !== 'undefined' && 'BarcodeDetector' in window);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flashlightAvailable, setFlashlightAvailable] = useState(false);
    const [flashlightEnabled, setFlashlightEnabled] = useState(false);

    useEffect(() => {
        onDetectedRef.current = onDetected;
    }, [onDetected]);

    function currentVideoTrack(): TorchTrack | null {
        return (streamRef.current?.getVideoTracks()[0] as TorchTrack | undefined) ?? null;
    }

    function syncTorchAvailability(track: TorchTrack | null) {
        const capabilities = track?.getCapabilities?.() as TorchCapabilities | undefined;
        const available = capabilities?.torch === true || capabilities?.fillLightMode?.includes('flash') === true;

        setFlashlightAvailable(available);
        setFlashlightEnabled(track?.getSettings?.().torch === true);
    }

    async function playSuccessFeedback() {
        try {
            if (typeof window === 'undefined') {
                return;
            }

            const AudioContextClass = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

            if (!AudioContextClass) {
                navigator.vibrate?.(80);

                return;
            }

            const context = audioContextRef.current ?? new AudioContextClass();
            audioContextRef.current = context;

            if (context.state === 'suspended') {
                await context.resume();
            }

            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const now = context.currentTime;

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1046.5, now);
            oscillator.frequency.exponentialRampToValueAtTime(1318.5, now + 0.08);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(now);
            oscillator.stop(now + 0.12);

            navigator.vibrate?.(80);
        } catch {
            // Ignore audio feedback errors.
        }
    }

    function stop() {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
        }

        detectorRef.current = null;
        setScanning(false);
        setFlashlightAvailable(false);
        setFlashlightEnabled(false);
    }

    useEffect(() => () => stop(), []);

    async function scanLoop() {
        if (!videoRef.current || !detectorRef.current) {
            return;
        }

        try {
            const barcodes = await detectorRef.current.detect(videoRef.current);
            const rawValue = barcodes[0]?.rawValue;

            if (rawValue) {
                const token = parseQrToken(rawValue);

                if (token) {
                    stop();
                    void playSuccessFeedback();
                    onDetectedRef.current(token);

                    return;
                }
            }
        } catch {
            // Ignore intermittent frame read failures.
        }

        rafRef.current = window.requestAnimationFrame(scanLoop);
    }

    function humanizeCameraError(cause: unknown): string {
        if (cause instanceof DOMException) {
            if (cause.name === 'NotAllowedError' || cause.name === 'SecurityError') {
                return t('common.camera_permission_denied_help');
            }

            if (cause.name === 'NotFoundError' || cause.name === 'DevicesNotFoundError') {
                return t('common.camera_unavailable');
            }
        }

        return t('common.camera_start_failed');
    }

    async function start() {
        setError(null);

        if (!supported) {
            setError(unsupportedMessage);

            return;
        }

        if (!videoRef.current) {
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } },
                audio: false,
            });

            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            const track = currentVideoTrack();
            syncTorchAvailability(track);

            detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
            setScanning(true);
            rafRef.current = window.requestAnimationFrame(scanLoop);
        } catch (cause) {
            stop();
            setError(humanizeCameraError(cause));
        }
    }

    async function toggleFlashlight() {
        const track = currentVideoTrack();

        if (!track || !flashlightAvailable) {
            setError(t('common.flashlight_not_supported'));

            return;
        }

        const nextValue = !flashlightEnabled;

        try {
            await track.applyConstraints({
                advanced: [{ torch: nextValue }],
            });
            setFlashlightEnabled(nextValue);
        } catch {
            setError(t('common.flashlight_not_supported'));
        }
    }

    return {
        error,
        flashlightAvailable,
        flashlightEnabled,
        scanning,
        supported,
        videoRef,
        start,
        stop,
        toggleFlashlight,
    };
}
