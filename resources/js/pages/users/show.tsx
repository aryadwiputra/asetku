import { Form, Head, router, usePage } from '@inertiajs/react';
import { Activity, CalendarDays, Clock, Mail, Shield, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCan } from '@/hooks/use-permission';
import { useTranslation } from '@/hooks/use-translation';
import { approve, revoke, start, stop, store as delegationsStore } from '@/routes/delegations';
import { index as usersIndex } from '@/routes/users';
import type { User } from '@/types';

type ActivityItem = {
    id: number;
    description: string;
    event: string | null;
    subject_type: string | null;
    causer_type: string | null;
    properties: Record<string, unknown>;
    created_at: string;
};

type Props = {
    user: User;
    activities: ActivityItem[];
    loginEvents: Array<{
        id: number;
        event: string;
        auth_method: string;
        ip: string | null;
        user_agent: string | null;
        occurred_at: string;
    }>;
    delegations: Array<{
        id: number;
        status: string;
        starts_at: string;
        ends_at: string;
        reason: string | null;
        revoked_at: string | null;
        delegator: { id: number; name: string; email: string };
        delegatee: { id: number; name: string; email: string };
        approver: { id: number; name: string } | null;
    }>;
    organizationUsers: Array<{ id: number; name: string; email: string }>;
};

export default function ShowUser({
    user,
    activities,
    loginEvents,
    delegations,
    organizationUsers,
}: Props) {
    const { t } = useTranslation();
    const { auth, delegating } = usePage().props;

    const canCreateDelegation = useCan('delegation.create');
    const canApproveDelegation = useCan('delegation.approve');
    const canRevokeDelegation = useCan('delegation.delete') || canApproveDelegation;

    return (
        <>
            <Head title={user.name} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="text-center">
                            <Avatar className="mx-auto h-20 w-20">
                                {user.avatar_path && <AvatarImage src={`/storage/${user.avatar_path}`} alt={user.name} />}
                                <AvatarFallback className="text-xl">
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="mt-4">{user.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div className="flex gap-1">
                                    {user.roles?.map((role) => (
                                        <Badge key={role.id} variant={role.name === 'super-admin' ? 'default' : 'secondary'}>
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <UserCog className="h-4 w-4 text-muted-foreground" />
                                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                    {user.is_active ? t('common.active') : t('common.inactive')}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                    {t('users.show.joined', { date: new Date(user.created_at).toLocaleDateString() })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6 lg:col-span-2">
                        {/* Activity Log */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    {t('users.show.activity_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activities.length === 0 ? (
                                    <p className="py-8 text-center text-muted-foreground">
                                        {t('users.show.activity_empty')}
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <div key={activity.id}>
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="break-words text-sm font-medium">{activity.description}</p>
                                                        {activity.properties && Object.keys(activity.properties).length > 0 && (
                                                            <p className="mt-1 break-words text-xs text-muted-foreground">
                                                                {JSON.stringify(activity.properties)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="shrink-0 text-xs text-muted-foreground">
                                                        {new Date(activity.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <Separator className="mt-3" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Login History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {t('users.show.login_history_title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loginEvents.length === 0 ? (
                                    <p className="py-8 text-center text-muted-foreground">
                                        {t('users.show.login_history_empty')}
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {loginEvents.map((event) => (
                                            <div key={event.id} className="rounded-lg border p-3">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant={event.event === 'login_failed' ? 'destructive' : 'secondary'}>
                                                                {event.event}
                                                            </Badge>
                                                            <Badge variant="outline">{event.auth_method}</Badge>
                                                            {event.ip && <span className="text-xs text-muted-foreground">{event.ip}</span>}
                                                        </div>
                                                        {event.user_agent && (
                                                            <div className="mt-1 break-words text-xs text-muted-foreground">
                                                                {event.user_agent}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="shrink-0 text-xs text-muted-foreground">
                                                        {new Date(event.occurred_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Delegations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    {t('users.delegation.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {canCreateDelegation && (
                                    <Form {...delegationsStore.form()} className="grid gap-4">
                                        {({ processing, errors }) => (
                                            <>
                                                <input type="hidden" name="delegator_user_id" value={user.id} />

                                                <div className="grid gap-2">
                                                    <Label htmlFor="delegatee_user_id">
                                                        {t('users.delegation.delegatee')}
                                                    </Label>
                                                    <select
                                                        id="delegatee_user_id"
                                                        name="delegatee_user_id"
                                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                                        required
                                                    >
                                                        <option value="">
                                                            {t('users.delegation.select_user')}
                                                        </option>
                                                        {organizationUsers
                                                            .filter((u) => u.id !== user.id)
                                                            .map((u) => (
                                                                <option key={u.id} value={u.id}>
                                                                    {u.name} ({u.email})
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {errors.delegatee_user_id && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.delegatee_user_id}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="starts_at">
                                                            {t('users.delegation.starts_at')}
                                                        </Label>
                                                        <Input
                                                            id="starts_at"
                                                            name="starts_at"
                                                            type="datetime-local"
                                                            required
                                                        />
                                                        {errors.starts_at && (
                                                            <p className="text-sm text-destructive">
                                                                {errors.starts_at}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="ends_at">
                                                            {t('users.delegation.ends_at')}
                                                        </Label>
                                                        <Input
                                                            id="ends_at"
                                                            name="ends_at"
                                                            type="datetime-local"
                                                            required
                                                        />
                                                        {errors.ends_at && (
                                                            <p className="text-sm text-destructive">
                                                                {errors.ends_at}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="reason">{t('users.delegation.reason')}</Label>
                                                    <Textarea id="reason" name="reason" rows={2} />
                                                    {errors.reason && (
                                                        <p className="text-sm text-destructive">
                                                            {errors.reason}
                                                        </p>
                                                    )}
                                                </div>

                                                <Button type="submit" disabled={processing}>
                                                    {t('users.delegation.create')}
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                )}

                                {delegations.length === 0 ? (
                                    <p className="py-6 text-center text-muted-foreground">
                                        {t('users.delegation.empty')}
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {delegations.map((d) => {
                                            const isDelegatee = auth.user?.id === d.delegatee.id;
                                            const canStart = isDelegatee && d.status === 'active' && !d.revoked_at;

                                            return (
                                                <div key={d.id} className="rounded-lg border p-3">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Badge variant="secondary">
                                                                    {d.status}
                                                                </Badge>
                                                            {d.approver && (
                                                                <Badge variant="outline">
                                                                        {t('users.delegation.approved_by', { name: d.approver.name })}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                            <div className="break-words">
                                                                    {t('users.delegation.delegator')}: <span className="text-foreground">{d.delegator.name}</span>
                                                            </div>
                                                            <div className="break-words">
                                                                    {t('users.delegation.delegatee_label')}: <span className="text-foreground">{d.delegatee.name}</span>
                                                            </div>
                                                            <div className="text-xs">
                                                                {new Date(d.starts_at).toLocaleString()} → {new Date(d.ends_at).toLocaleString()}
                                                            </div>
                                                                {d.reason && (
                                                                    <div className="break-words text-xs">
                                                                        {d.reason}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 sm:justify-end">
                                                            {d.status === 'pending' && canApproveDelegation && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => router.post(approve(d.id).url)}
                                                                >
                                                                    {t('users.delegation.approve')}
                                                                </Button>
                                                            )}
                                                            {canRevokeDelegation && d.status !== 'revoked' && d.status !== 'ended' && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => router.delete(revoke(d.id).url, { preserveScroll: true })}
                                                                >
                                                                    {t('users.delegation.revoke')}
                                                                </Button>
                                                            )}
                                                            {canStart && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => router.post(start(d.id).url)}
                                                                >
                                                                    {t('users.delegation.start')}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {delegating && (
                                            <Button
                                                variant="outline"
                                                onClick={() => router.post(stop().url)}
                                            >
                                                {t('users.delegation.stop')}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ShowUser.layout = {
    breadcrumbs: [
        { title: 'users.title', href: usersIndex() },
        { title: 'users.show.breadcrumb', href: '#' },
    ],
};
