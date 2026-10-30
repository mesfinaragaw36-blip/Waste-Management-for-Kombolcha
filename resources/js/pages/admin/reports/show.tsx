import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CheckCircle, MapPin, User, UserPlus, XCircle } from 'lucide-react';
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
    DialogTrigger,
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
import { assignTask, index, review } from '@/actions/App/Http/Controllers/Admin/WasteReportController';
import type { User as UserType, WasteReport } from '@/types';
import { useState } from 'react';

type PageProps = {
    report: WasteReport & {
        category: NonNullable<WasteReport['category']>;
        resident: NonNullable<WasteReport['resident']>;
        status_histories: NonNullable<WasteReport['status_histories']>;
    };
    workers: UserType[];
};

export default function AdminShowReport({ report, workers }: PageProps) {
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);

    const reviewForm = useForm({
        status: '' as 'under_review' | 'approved' | 'rejected' | '',
        notes: '',
    });

    const assignForm = useForm({
        assigned_worker_id: '',
        scheduled_at: '',
        notes: '',
    });

    const handleReview = (status: 'under_review' | 'approved' | 'rejected') => {
        reviewForm.setData('status', status);
        setReviewDialogOpen(true);
    };

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(review.url(report.id), {
            onSuccess: () => {
                setReviewDialogOpen(false);
                reviewForm.reset();
            },
        });
    };

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        assignForm.post(assignTask.url(report.id), {
            onSuccess: () => {
                setAssignDialogOpen(false);
                assignForm.reset();
            },
        });
    };

    const canReview = ['pending', 'under_review'].includes(report.status);
    const canAssign = report.status === 'approved' && !report.collection_task;

    const priorityVariant = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'destructive' as const;
            case 'medium':
                return 'default' as const;
            case 'low':
                return 'secondary' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <>
            <Head title={report.title} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
                        <p className="text-muted-foreground">{report.category.name}</p>
                    </div>
                    {canReview && (
                        <div className="flex gap-2">
                            {report.status === 'pending' && (
                                <Button onClick={() => handleReview('under_review')}>
                                    <CheckCircle className="mr-2 size-4" />
                                    Review
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => handleReview('approved')}>
                                <CheckCircle className="mr-2 size-4" />
                                Approve
                            </Button>
                            <Button variant="destructive" onClick={() => handleReview('rejected')}>
                                <XCircle className="mr-2 size-4" />
                                Reject
                            </Button>
                        </div>
                    )}
                    {canAssign && (
                        <Button onClick={() => setAssignDialogOpen(true)}>
                            <UserPlus className="mr-2 size-4" />
                            Assign Worker
                        </Button>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Report Details</CardTitle>
                                    <div className="flex gap-2">
                                        <StatusBadge status={report.status} />
                                        <Badge variant={priorityVariant(report.priority)}>
                                            {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="mb-2 font-semibold">Description</h3>
                                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                        {report.description}
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <MapPin className="size-4" />
                                            Location
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {report.location_description}
                                        </p>
                                        {report.latitude && report.longitude && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Coordinates: {report.latitude}, {report.longitude}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <User className="size-4" />
                                            Resident
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {report.resident.name}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {report.resident.email}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <Calendar className="size-4" />
                                            Submitted
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(report.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                            <Calendar className="size-4" />
                                            Last Updated
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(report.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {report.photo_path && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 font-semibold">Photo</h3>
                                            <img
                                                src={`/storage/${report.photo_path}`}
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
                                <CardDescription>Track report progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {report.status_histories
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((history, index) => (
                                            <div
                                                key={history.id}
                                                className={index !== report.status_histories.length - 1 ? 'border-l-2 pb-4 pl-4' : 'pl-4'}
                                            >
                                                <div className="relative">
                                                    <div className="absolute -left-[1.3rem] top-1 size-2.5 rounded-full border-2 border-background bg-primary" />
                                                    <div className="space-y-1">
                                                        <StatusBadge status={history.new_status as any} />
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

            {/* Review Dialog */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent>
                    <form onSubmit={submitReview}>
                        <DialogHeader>
                            <DialogTitle>
                                {reviewForm.data.status === 'under_review' && 'Move to Under Review'}
                                {reviewForm.data.status === 'approved' && 'Approve Report'}
                                {reviewForm.data.status === 'rejected' && 'Reject Report'}
                            </DialogTitle>
                            <DialogDescription>
                                {reviewForm.data.status === 'rejected'
                                    ? 'Please provide a reason for rejecting this report.'
                                    : 'You can add optional notes about this review.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="notes">
                                    Notes {reviewForm.data.status === 'rejected' && <span className="text-destructive">*</span>}
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={reviewForm.data.notes}
                                    onChange={(e) => reviewForm.setData('notes', e.target.value)}
                                    placeholder="Add review notes..."
                                    rows={4}
                                    required={reviewForm.data.status === 'rejected'}
                                />
                                {reviewForm.errors.notes && (
                                    <p className="text-sm text-destructive">{reviewForm.errors.notes}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReviewDialogOpen(false)}
                                disabled={reviewForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={reviewForm.processing}>
                                {reviewForm.processing ? 'Processing...' : 'Confirm'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <form onSubmit={submitAssign}>
                        <DialogHeader>
                            <DialogTitle>Assign Worker</DialogTitle>
                            <DialogDescription>
                                Assign this report to a collection worker for action.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="worker">Worker <span className="text-destructive">*</span></Label>
                                <Select
                                    value={assignForm.data.assigned_worker_id}
                                    onValueChange={(value) => assignForm.setData('assigned_worker_id', value)}
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
                                {assignForm.errors.assigned_worker_id && (
                                    <p className="text-sm text-destructive">{assignForm.errors.assigned_worker_id}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="scheduled_at">Scheduled Date (Optional)</Label>
                                <Input
                                    id="scheduled_at"
                                    type="date"
                                    value={assignForm.data.scheduled_at}
                                    onChange={(e) => assignForm.setData('scheduled_at', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {assignForm.errors.scheduled_at && (
                                    <p className="text-sm text-destructive">{assignForm.errors.scheduled_at}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assign_notes">Notes (Optional)</Label>
                                <Textarea
                                    id="assign_notes"
                                    value={assignForm.data.notes}
                                    onChange={(e) => assignForm.setData('notes', e.target.value)}
                                    placeholder="Add assignment notes..."
                                    rows={3}
                                />
                                {assignForm.errors.notes && (
                                    <p className="text-sm text-destructive">{assignForm.errors.notes}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAssignDialogOpen(false)}
                                disabled={assignForm.processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={assignForm.processing}>
                                {assignForm.processing ? 'Assigning...' : 'Assign Worker'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminShowReport.layout = {
    breadcrumbs: [
        { title: 'Manage Reports', href: '/admin/reports' },
        { title: 'View Report', href: '#' },
    ],
};
