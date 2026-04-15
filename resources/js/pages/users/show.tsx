import { Head } from '@inertiajs/react';
import { Activity, CalendarDays, Clock, Mail, Shield, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
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
};

export default function ShowUser({ user, activities, loginEvents }: Props) {
    const { t } = useTranslation();

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
                                    Login history
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loginEvents.length === 0 ? (
                                    <p className="py-8 text-center text-muted-foreground">
                                        No login activity yet.
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
