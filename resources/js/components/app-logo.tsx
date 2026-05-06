import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, appLogoUrl } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-linear-to-br from-foreground to-foreground/80 text-background shadow-sm">
                {appLogoUrl ? (
                    <img src={appLogoUrl} alt={name} className="size-7 rounded object-contain" />
                ) : (
                    <AppLogoIcon className="size-5 fill-current" />
                )}
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold tracking-tight">
                    {name}
                </span>
            </div>
        </>
    );
}
