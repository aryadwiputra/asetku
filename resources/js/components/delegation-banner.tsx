import { router, usePage } from '@inertiajs/react';
import { Handshake, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stop } from '@/routes/delegations';

export function DelegationBanner() {
    const { delegating } = usePage().props;

    if (!delegating) {
        return null;
    }

    function stopDelegation() {
        router.post(stop().url);
    }

    return (
        <div className="flex items-center justify-between gap-4 bg-sky-500 px-4 py-2 text-sky-950">
            <div className="flex items-center gap-2">
                <Handshake className="h-4 w-4" />
                <span className="text-sm font-medium">
                    Delegation active.
                </span>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="border-sky-700 bg-sky-600 text-sky-50 hover:bg-sky-700"
                onClick={stopDelegation}
            >
                <X className="mr-1 h-3 w-3" />
                Stop
            </Button>
        </div>
    );
}

