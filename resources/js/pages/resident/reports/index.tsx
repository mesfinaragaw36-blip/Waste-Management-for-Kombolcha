import { Head, Link } from '@inertiajs/react';
import { FileText, MapPin, Clock, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/status-badge';
import { create, show } from '@/actions/App/Http/Controllers/Resident/WasteReportController';
import type { PaginatedReports } from '@/types';

type PageProps = {
    reports: PaginatedReports;
};

export default function ReportsIndex({ reports }: PageProps) {
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
            <Head title="My Reports" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
                        <p className="text-muted-foreground">
                            View and manage your waste reports
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus className="mr-2 size-4" />
                            Report Waste
                        </Link>
                    </Button>
                </div>

                {reports.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="mb-4 size-12 text-muted-foreground" />
                            <p className="mb-4 text-lg text-muted-foreground">
                                You haven&apos;t reported any waste issues yet.
                            </p>
                            <Button asChild>
                                <Link href={create.url()}>
                                    <Plus className="mr-2 size-4" />
                                    Report Waste
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reports.data.map((report) => (
                                <Link key={report.id} href={show.url(report.id)}>
                                    <Card className="h-full transition-shadow hover:shadow-md">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="line-clamp-1">
                                                    {report.title}
                                                </CardTitle>
                                                <StatusBadge status={report.status} />
                                            </div>
                                            <CardDescription className="line-clamp-1">
                                                {report.category?.name}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {report.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    <span className="line-clamp-1">
                                                        {report.location_description}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Badge variant={priorityVariant(report.priority)}>
                                                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                                                </Badge>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="size-3" />
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {reports.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {reports.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        asChild={!!link.url}
                                        disabled={!link.url}
                                    >
                                        {link.url ? (
                                            <Link href={link.url}>
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Link>
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'My Reports', href: '/resident/reports' },
    ],
};
