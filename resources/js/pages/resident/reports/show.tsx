import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, MapPin, Trash2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/status-badge';
import { destroy, edit, index } from '@/actions/App/Http/Controllers/Resident/WasteReportController';
import type { WasteReport } from '@/types';

type PageProps = {
    report: WasteReport & {
        category: NonNullable<WasteReport['category']>;
        status_histories: NonNullable<WasteReport['status_histories']>;
    };
};

export default function ShowReport({ report }: PageProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            router.delete(destroy.url(report.id));
        }
    };

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
                        <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
                        <p className="text-sm text-muted-foreground">{report.category.name}</p>
                    </div>
                    {report.status === 'pending' && (
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link href={edit.url(report.id)}>
                                    <Edit className="mr-2 size-4" />
                                    Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 size-4" />
                                Delete
                            </Button>
                        </div>
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
                                            <Calendar className="size-4" />
                                            Submitted
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(report.created_at).toLocaleString()}
                                        </p>
                                        {report.updated_at !== report.created_at && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Updated: {new Date(report.updated_at).toLocaleString()}
                                            </p>
                                        )}
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
                                <CardDescription>
                                    Track the progress of your report
                                </CardDescription>
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
                                                        <div className="flex items-center gap-2">
                                                            <StatusBadge status={history.new_status as any} />
                                                        </div>
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
        </>
    );
}

ShowReport.layout = {
    breadcrumbs: [
        { title: 'My Reports', href: '/resident/reports' },
        { title: 'View Report', href: '#' },
    ],
};
