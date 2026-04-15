import { Form, Head, setLayoutProps } from '@inertiajs/react';
import { useMemo } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import { accept } from '@/routes/invites';

type Props = {
    token: string;
    email: string;
    organizationName: string | null;
    expiresAt: string;
    isAvailable: boolean;
    isExistingUser: boolean;
    orgRole: string;
};

export default function AcceptInvite({
    token,
    email,
    organizationName,
    isAvailable,
    isExistingUser,
}: Props) {
    const { t } = useTranslation();
    const acceptRoute = accept({ token });

    const title = useMemo(() => {
        return isAvailable ? 'Accept invitation' : 'Invitation not available';
    }, [isAvailable]);

    const description = useMemo(() => {
        if (!isAvailable) {
            return 'This invitation is expired, revoked, or already accepted.';
        }

        return organizationName ? `Join ${organizationName}.` : 'Join organization.';
    }, [isAvailable, organizationName]);

    setLayoutProps({ title, description });

    return (
        <>
            <Head title={title} />

            {!isAvailable ? (
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div>{description}</div>
                </div>
            ) : (
                <Form
                    action={acceptRoute.url}
                    method={acceptRoute.method}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <div>
                                    Email: <span className="font-medium text-foreground">{email}</span>
                                </div>
                                <div>
                                    Status: {isExistingUser ? 'Existing account' : 'New account'}
                                </div>
                            </div>

                            {!isExistingUser && (
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">{t('common.name')}</Label>
                                        <Input id="name" name="name" required autoComplete="name" />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">{t('common.password')}</Label>
                                        <PasswordInput id="password" name="password" required autoComplete="new-password" />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">{t('common.confirm_password')}</Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            )}

                            <Button disabled={processing} className="w-full">
                                {processing && <Spinner className="mr-2 h-4 w-4" />}
                                Accept invitation
                            </Button>
                        </>
                    )}
                </Form>
            )}
        </>
    );
}
