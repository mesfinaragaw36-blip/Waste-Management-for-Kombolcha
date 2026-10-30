import { Head, Link } from '@inertiajs/react';
import { FileText, ClipboardList, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/status-badge';
import { index as reportsIndex, show as reportsShow } from '@/actions/App/Http/Controllers/Admin/WasteReportController';
import { index as tasksIndex, show as tasksShow } from '@/actions/App/Http/Controllers/Admin/CollectionTaskController';
import { index as usersIndex } from '@/actions/App/Http/Controllers/Admin/UserController';
import type { AdminReportMetrics, AdminTaskMetrics, AdminUserMetrics, WasteReport, CollectionTask } from '@/types/waste';

type PageProps = {
    reportMetrics: AdminReportMetrics;
    taskMetrics: AdminTaskMetrics;
    userMetrics: AdminUserMetrics;
    recentReports: WasteReport[];
    recentCompletedTasks: CollectionTask[];
};

export default function AdminDashboard({
    reportMetrics,
    taskMetrics,
    userMetrics,
    recentReports,
    recentCompletedTasks,
}: PageProps) {
    const totalReports = Object.values(reportMetrics).reduce((sum, count) => sum + count, 0);
    const totalTasks = Object.values(taskMetrics).reduce((sum, count) => sum + count, 0);
    const totalUsers = Object.values(userMetrics).reduce((sum, count) => sum + count, 0);

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        System overview and recent activity
                    </p>
                </div>

                {/* Overview Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                            <FileText className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalReports}</div>
                            <p className="text-xs text-muted-foreground">All waste reports</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <ClipboardList className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalTasks}</div>
                            <p className="text-xs text-muted-foreground">Collection tasks</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                {userMetrics.residents} residents, {userMetrics.workers} workers
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Report Status Breakdown</CardTitle>
                        <CardDescription>Current state of all waste reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{reportMetrics.pending}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Under Review</p>
                                <p className="text-2xl font-bold">{reportMetrics.under_review}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Approved</p>
                                <p className="text-2xl font-bold">{reportMetrics.approved}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Assigned</p>
                                <p className="text-2xl font-bold">{reportMetrics.assigned}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">In Progress</p>
                                <p className="text-2xl font-bold">{reportMetrics.in_progress}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Resolved</p>
                                <p className="text-2xl font-bold">{reportMetrics.resolved}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Rejected</p>
                                <p className="text-2xl font-bold">{reportMetrics.rejected}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Task Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Task Status Breakdown</CardTitle>
                        <CardDescription>Current state of collection tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Assigned</p>
                                <p className="text-2xl font-bold">{taskMetrics.assigned}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Accepted</p>
                                <p className="text-2xl font-bold">{taskMetrics.accepted}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">In Progress</p>
                                <p className="text-2xl font-bold">{taskMetrics.in_progress}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{taskMetrics.completed}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Cancelled</p>
                                <p className="text-2xl font-bold">{taskMetrics.cancelled}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Reports */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Reports</CardTitle>
                                <CardDescription>Latest waste reports from residents</CardDescription>
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
                                <p className="text-muted-foreground">No reports yet.</p>
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
                                                {report.resident && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Reported by: {report.resident.name}
                                                    </p>
                                                )}
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

                {/* Recent Completed Tasks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Completed Tasks</CardTitle>
                                <CardDescription>Latest finished collection tasks</CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href={tasksIndex.url()}>View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentCompletedTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Activity className="mb-4 size-12 text-muted-foreground" />
                                <p className="text-muted-foreground">No completed tasks yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentCompletedTasks.map((task) => (
                                    <Link
                                        key={task.id}
                                        href={tasksShow.url(task.id)}
                                        className="block rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">
                                                        {task.waste_report?.title}
                                                    </p>
                                                    <StatusBadge status={task.status} />
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {task.waste_report?.category?.name}
                                                </p>
                                                {task.assigned_worker && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Completed by: {task.assigned_worker.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right text-xs text-muted-foreground">
                                                {task.completed_at
                                                    ? new Date(task.completed_at).toLocaleDateString()
                                                    : ''}
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
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href={reportsIndex.url()}>
                                    <FileText className="mr-2 size-4" />
                                    Manage Reports
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={tasksIndex.url()}>
                                    <ClipboardList className="mr-2 size-4" />
                                    Manage Tasks
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={usersIndex.url()}>
                                    <Users className="mr-2 size-4" />
                                    Manage Users
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};
