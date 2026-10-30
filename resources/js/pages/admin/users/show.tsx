import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, Shield, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { index, updateRole } from '@/actions/App/Http/Controllers/Admin/UserController';
import type { User } from '@/types';
import { useState } from 'react';

type PageProps = {
    user: User;
    roles: string[];
};

export default function AdminShowUser({ user, roles }: PageProps) {
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);

    const roleForm = useForm({
        role: user.role,
    });

    const submitRoleChange = (e: React.FormEvent) => {
        e.preventDefault();
        roleForm.patch(updateRole.url(user.id), {
            onSuccess: () => {
                setRoleDialogOpen(false);
            },
        });
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'administrator':
                return 'destructive' as const;
            case 'worker':
                return 'default' as const;
            case 'resident':
                return 'secondary' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <>
            <Head title={user.name} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button onClick={() => setRoleDialogOpen(true)}>
                        <Shield className="mr-2 size-4" />
                        Change Role
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>User Information</CardTitle>
                                    <Badge variant={getRoleBadgeVariant(user.role)}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <UserIcon className="size-4" />
                                            Name
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <Mail className="size-4" />
                                            Email
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                        {user.email_verified_at ? (
                                            <Badge variant="secondary" className="mt-1">
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="mt-1">
                                                Not Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <Calendar className="size-4" />
                                            Joined
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <Shield className="size-4" />
                                            Current Role
                                        </h3>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {user.role === 'resident' && user.waste_reports && user.waste_reports.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Reports</CardTitle>
                                    <CardDescription>Latest waste reports submitted</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {user.waste_reports.map((report) => (
                                            <div key={report.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div className="flex-1">
                                                    <p className="font-medium">{report.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {report.category?.name}
                                                    </p>
                                                </div>
                                                <Badge>
                                                    {report.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {user.role === 'worker' && user.assigned_collection_tasks && user.assigned_collection_tasks.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Tasks</CardTitle>
                                    <CardDescription>Latest assigned collection tasks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {user.assigned_collection_tasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {task.waste_report?.title || `Task #${task.id}`}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {task.waste_report?.category?.name}
                                                    </p>
                                                </div>
                                                <Badge>
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Statistics</CardTitle>
                                <CardDescription>User activity summary</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {user.role === 'resident' && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Total Reports
                                            </span>
                                            <span className="font-semibold">
                                                {user.waste_reports_count || 0}
                                            </span>
                                        </div>
                                    )}

                                    {user.role === 'worker' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Assigned Tasks
                                                </span>
                                                <span className="font-semibold">
                                                    {user.assigned_collection_tasks_count || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Status Changes
                                                </span>
                                                <span className="font-semibold">
                                                    {user.task_status_changes_count || 0}
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    {user.role === 'administrator' && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Tasks Created
                                                </span>
                                                <span className="font-semibold">
                                                    {user.created_collection_tasks_count || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Report Reviews
                                                </span>
                                                <span className="font-semibold">
                                                    {user.report_status_changes_count || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Task Status Changes
                                                </span>
                                                <span className="font-semibold">
                                                    {user.task_status_changes_count || 0}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Change Role Dialog */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <form onSubmit={submitRoleChange}>
                        <DialogHeader>
                            <DialogTitle>Change User Role</DialogTitle>
                            <DialogDescription>
                                Update the role for {user.name}. This will change their permissions immediately.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    Role <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={roleForm.data.role}
                                    onValueChange={(value) => roleForm.setData('role', value as any)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {roleForm.errors.role && (
                                    <p className="text-sm text-destructive">{roleForm.errors.role}</p>
                                )}
                            </div>

                            {roleForm.data.role !== user.role && (
                                <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                                    <strong>Warning:</strong> Changing the user role will immediately affect their
                                    permissions and access to features.
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setRoleDialogOpen(false)}
                                disabled={roleForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={roleForm.processing || roleForm.data.role === user.role}
                            >
                                {roleForm.processing ? 'Updating...' : 'Update Role'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminShowUser.layout = {
    breadcrumbs: [
        { title: 'Manage Users', href: '/admin/users' },
        { title: 'View User', href: '#' },
    ],
};
