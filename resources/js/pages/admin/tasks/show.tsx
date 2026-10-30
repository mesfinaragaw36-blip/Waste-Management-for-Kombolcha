import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin, RefreshCw, User } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import StatusBadge from '@/components/status-badge';
import { index, reassign } from '@/actions/App/Http/Controllers/Admin/CollectionTaskController';
import type { CollectionTask, User as UserType } from '@/types';
import { useState } from 'react';

type PageProps = {
    task: CollectionTask & {
        waste_report: NonNullable<CollectionTask['waste_report']>;
        assigned_worker: NonNullable<CollectionTask['assigned_worker']>;
        assigned_by: NonNullable<CollectionTask['assigned_by']>;
        status_histories: NonNullable<CollectionTask['status_histories']>;
    };
    workers: UserType[];
};

export default function AdminShowTask({ task, workers }: PageProps) {
    const [reassignDialogOpen, setReassignDialogOpen] = useState(false);

    const reassignForm = useForm({
        assigned_worker_id: '',
        scheduled_at: '',
        notes: '',
    });

    const submitReassign = (e: React.FormEvent) => {
        e.preventDefault();
        reassignForm.post(reassign.url(task.id), {
            onSuccess: () => {
                setReassignDialogOpen(false);
                reassignForm.reset();
            },
        });
    };

    const canReassign = !['completed', 'cancelled'].includes(task.status);

    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'accepted':
                return 'bg-yellow-100 text-yellow-800';
            case 'assigned':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title={`Task #${task.id}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Task #{task.id}
                        </h1>
                        <p className="text-muted-foreground">
                            {task.waste_report.title}
                        </p>
                    </div>
                    {canReassign && (
                        <Button onClick={() => setReassignDialogOpen(true)}>
                            <RefreshCw className="mr-2 size-4" />
                            Reassign Worker
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Task Details</CardTitle>
                                    <Badge className={getTaskStatusColor(task.status)}>
                                        {task.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <User className="size-4" />
                                            Assigned Worker
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {task.assigned_worker.name}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {task.assigned_worker.email}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <User className="size-4" />
                                            Assigned By
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {task.assigned_by.name}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {new Date(task.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    {task.scheduled_at && (
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                                <Calendar className="size-4" />
                                                Scheduled Date
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(task.scheduled_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {task.started_at && (
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                                <Calendar className="size-4" />
                                                Started At
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(task.started_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {task.completed_at && (
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                                <Calendar className="size-4" />
                                                Completed At
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(task.completed_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {task.completion_notes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 font-semibold">Completion Notes</h3>
                                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                                {task.completion_notes}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {task.completion_photo_path && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 font-semibold">Completion Photo</h3>
                                            <img
                                                src={`/storage/${task.completion_photo_path}`}
                                                alt="Task completion photo"
                                                className="max-w-full rounded-lg border"
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Related Report</CardTitle>
                                <CardDescription>Original waste report</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="mb-2 font-semibold">{task.waste_report.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {task.waste_report.category?.name}
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-2 font-semibold">Description</h3>
                                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                        {task.waste_report.description}
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                        <MapPin className="size-4" />
                                        Location
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {task.waste_report.location_description}
                                    </p>
                                </div>

                                {task.waste_report.photo_path && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 font-semibold">Report Photo</h3>
                                            <img
                                                src={`/storage/${task.waste_report.photo_path}`}
                                                alt="Waste report photo"
                                                className="max-w-full rounded-lg border"
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Status History</CardTitle>
                                <CardDescription>Track task progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {task.status_histories
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((history, index) => (
                                            <div
                                                key={history.id}
                                                className={index !== task.status_histories.length - 1 ? 'border-l-2 pb-4 pl-4' : 'pl-4'}
                                            >
                                                <div className="relative">
                                                    <div className="absolute -left-[1.3rem] top-1 size-2.5 rounded-full border-2 border-background bg-primary" />
                                                    <div className="space-y-1">
                                                        <Badge className={getTaskStatusColor(history.new_status)}>
                                                            {history.new_status.replace('_', ' ')}
                                                        </Badge>
                                                        {history.notes && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {history.notes}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            {history.changed_by && (
                                                                <>
                                                                    <User className="size-3" />
                                                                    <span>{history.changed_by.name}</span>
                                                                    <span>•</span>
                                                                </>
                                                            )}
                                                            <Calendar className="size-3" />
                                                            <span>
                                                                {new Date(history.created_at).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Reassign Dialog */}
            <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
                <DialogContent>
                    <form onSubmit={submitReassign}>
                        <DialogHeader>
                            <DialogTitle>Reassign Worker</DialogTitle>
                            <DialogDescription>
                                Reassign this task to a different worker. The task status will be reset to assigned.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="worker">Worker <span className="text-destructive">*</span></Label>
                                <Select
                                    value={reassignForm.data.assigned_worker_id}
                                    onValueChange={(value) => reassignForm.setData('assigned_worker_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a worker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workers.map((worker) => (
                                            <SelectItem key={worker.id} value={worker.id.toString()}>
                                                {worker.name} ({worker.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {reassignForm.errors.assigned_worker_id && (
                                    <p className="text-sm text-destructive">{reassignForm.errors.assigned_worker_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduled_at">Scheduled Date (Optional)</Label>
                                <Input
                                    id="scheduled_at"
                                    type="date"
                                    value={reassignForm.data.scheduled_at}
                                    onChange={(e) => reassignForm.setData('scheduled_at', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {reassignForm.errors.scheduled_at && (
                                    <p className="text-sm text-destructive">{reassignForm.errors.scheduled_at}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={reassignForm.data.notes}
                                    onChange={(e) => reassignForm.setData('notes', e.target.value)}
                                    placeholder="Add reassignment notes..."
                                    rows={3}
                                />
                                {reassignForm.errors.notes && (
                                    <p className="text-sm text-destructive">{reassignForm.errors.notes}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReassignDialogOpen(false)}
                                disabled={reassignForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={reassignForm.processing}>
                                {reassignForm.processing ? 'Reassigning...' : 'Reassign Worker'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminShowTask.layout = {
    breadcrumbs: [
        { title: 'Manage Tasks', href: '/admin/tasks' },
        { title: 'View Task', href: '#' },
    ],
};
