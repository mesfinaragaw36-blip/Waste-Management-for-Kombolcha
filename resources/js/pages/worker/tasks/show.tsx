import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, FileText, MapPin, PlayCircle, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import StatusBadge from '@/components/status-badge';
import TaskStatusBadge from '@/components/task-status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { CollectionTask } from '@/types';

type Props = {
    task: CollectionTask;
};

export default function Show({ task }: Props) {
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);
    const report = task.waste_report;

    const handleAccept = () => {
        router.post(`/worker/tasks/${task.id}/accept`, {}, {
            preserveScroll: true,
        });
    };

    const handleStart = () => {
        router.post(`/worker/tasks/${task.id}/start`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Task #${task.id}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/worker/tasks">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Task #{task.id}</h1>
                            <TaskStatusBadge status={task.status} />
                        </div>
                        {report?.category && (
                            <p className="text-muted-foreground">{report.category.name}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {task.status === 'assigned' && (
                            <>
                                <Button onClick={handleAccept} variant="secondary">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept Task
                                </Button>
                                <Button onClick={handleStart}>
                                    <PlayCircle className="h-4 w-4 mr-2" />
                                    Start Task
                                </Button>
                            </>
                        )}
                        {task.status === 'accepted' && (
                            <Button onClick={handleStart}>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Start Task
                            </Button>
                        )}
                        {task.status === 'in_progress' && (
                            <Button onClick={() => setShowCompleteDialog(true)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete Task
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Report Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{report?.title}</h3>
                                    <p className="text-muted-foreground mt-1">{report?.description}</p>
                                </div>

                                {report?.priority && (
                                    <div>
                                        <Badge
                                            variant={
                                                report.priority === 'high'
                                                    ? 'destructive'
                                                    : report.priority === 'medium'
                                                      ? 'default'
                                                      : 'outline'
                                            }
                                        >
                                            {report.priority.charAt(0).toUpperCase() +
                                                report.priority.slice(1)}{' '}
                                            Priority
                                        </Badge>
                                    </div>
                                )}

                                {report?.location_description && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm">{report.location_description}</p>
                                            {report.latitude && report.longitude && (
                                                <p className="text-xs text-muted-foreground">
                                                    {report.latitude}, {report.longitude}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {report?.photo_path && (
                                    <div>
                                        <img
                                            src={`/storage/${report.photo_path}`}
                                            alt="Report photo"
                                            className="rounded-lg max-h-96 w-auto"
                                        />
                                    </div>
                                )}

                                <Separator />

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span>Report Status:</span>
                                    </div>
                                    {report?.status && <StatusBadge status={report.status} />}
                                </div>

                                {report?.created_at && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Submitted:{' '}
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {task.status === 'completed' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Completion Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Completion Notes</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {task.completion_notes}
                                        </p>
                                    </div>

                                    {task.completion_photo_path && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Completion Photo</h4>
                                            <img
                                                src={`/storage/${task.completion_photo_path}`}
                                                alt="Completion photo"
                                                className="rounded-lg max-h-96 w-auto"
                                            />
                                        </div>
                                    )}

                                    {task.completed_at && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Completed:{' '}
                                                {new Date(task.completed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {task.assigned_worker && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <User className="h-4 w-4" />
                                            <span>Assigned Worker</span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {task.assigned_worker.name}
                                        </p>
                                    </div>
                                )}

                                {task.assigned_by_user && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Assigned By
                                        </div>
                                        <p className="text-sm font-medium">
                                            {task.assigned_by_user.name}
                                        </p>
                                    </div>
                                )}

                                {task.scheduled_at && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>Scheduled Date</span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {new Date(task.scheduled_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {task.started_at && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Started Date
                                        </div>
                                        <p className="text-sm font-medium">
                                            {new Date(task.started_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}

                                {task.completed_at && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">
                                            Completed Date
                                        </div>
                                        <p className="text-sm font-medium">
                                            {new Date(task.completed_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {task.status_histories && task.status_histories.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status History</CardTitle>
                                    <CardDescription>Timeline of status changes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {task.status_histories.map((history) => (
                                            <div key={history.id} className="relative pl-4 pb-4 last:pb-0">
                                                <div className="absolute left-0 top-2 h-full w-px bg-border" />
                                                <div className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary -translate-x-[3px]" />
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <TaskStatusBadge status={history.new_status as any} />
                                                    </div>
                                                    {history.notes && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {history.notes}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        {history.changed_by && (
                                                            <span>{history.changed_by.name}</span>
                                                        )}
                                                        <span>•</span>
                                                        <span>
                                                            {new Date(history.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <CompleteTaskDialog
                task={task}
                open={showCompleteDialog}
                onOpenChange={setShowCompleteDialog}
            />
        </>
    );
}

function CompleteTaskDialog({
    task,
    open,
    onOpenChange,
}: {
    task: CollectionTask;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        completion_notes: '',
        completion_photo: null as File | null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/worker/tasks/${task.id}/complete`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Complete Task</DialogTitle>
                    <DialogDescription>
                        Add completion notes and an optional photo to finalize this task.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="completion_notes">
                            Completion Notes <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="completion_notes"
                            value={data.completion_notes}
                            onChange={(e) => setData('completion_notes', e.target.value)}
                            placeholder="Describe what was done to complete this task..."
                            rows={4}
                            required
                        />
                        {errors.completion_notes && (
                            <p className="text-sm text-destructive">{errors.completion_notes}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="completion_photo">Completion Photo (optional)</Label>
                        <Input
                            id="completion_photo"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) =>
                                setData('completion_photo', e.target.files?.[0] || null)
                            }
                        />
                        {errors.completion_photo && (
                            <p className="text-sm text-destructive">{errors.completion_photo}</p>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Completing...' : 'Complete Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
