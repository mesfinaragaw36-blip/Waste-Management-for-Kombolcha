import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/status-badge';
import { index as reportsIndex, create as reportsCreate, show as reportsShow } from '@/actions/App/Http/Controllers/Resident/WasteReportController';
import type { ResidentDashboardMetrics, WasteReport } from '@/types/waste';

type PageProps = {
    metrics: ResidentDashboardMetrics;
    recentReports: WasteReport[];
};

export default function ResidentDashboard({ metrics, recentReports }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of your waste reports
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                            <FileText className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.total}</div>
                            <p className="text-xs text-muted-foreground">All reports submitted</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.pending}</div>
                            <p className="text-xs text-muted-foreground">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <AlertCircle className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.in_progress}</div>
                            <p className="text-xs text-muted-foreground">Being handled</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.resolved}</div>
                            <p className="text-xs text-muted-foreground">Completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.rejected}</div>
                            <p className="text-xs text-muted-foreground">Not approved</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Reports</CardTitle>
                                <CardDescription>Your latest waste reports</CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href={reportsIndex.url()}>View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentReports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <FileText className="mb-4 size-12 text-muted-foreground" />
                                <p className="mb-4 text-muted-foreground">
                                    You haven&apos;t reported any waste issues yet.
                                </p>
                                <Button asChild>
                                    <Link href={reportsCreate.url()}>
                                        <Plus className="mr-2 size-4" />
                                        Create Your First Report
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentReports.map((report) => (
                                    <Link
                                        key={report.id}
                                        href={reportsShow.url(report.id)}
                                        className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{report.title}</p>
                                                    <StatusBadge status={report.status} />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {report.category?.name}
                                                </p>
                                                {report.collection_task?.assigned_worker && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Assigned to: {report.collection_task.assigned_worker.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right text-xs text-muted-foreground">
                                                {new Date(report.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and navigation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href={reportsCreate.url()}>
                                    <Plus className="mr-2 size-4" />
                                    Report Waste
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={reportsIndex.url()}>
                                    <FileText className="mr-2 size-4" />
                                    View All Reports
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ResidentDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/resident/dashboard' },
    ],
};
