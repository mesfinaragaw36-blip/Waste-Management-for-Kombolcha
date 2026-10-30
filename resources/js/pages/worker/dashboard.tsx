import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Clock, CheckCircle, PlayCircle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/status-badge';
import { index as tasksIndex, show as tasksShow } from '@/actions/App/Http/Controllers/Worker/CollectionTaskController';
import type { WorkerDashboardMetrics, CollectionTask } from '@/types/waste';

type PageProps = {
    metrics: WorkerDashboardMetrics;
    recentTasks: CollectionTask[];
};

export default function WorkerDashboard({ metrics, recentTasks }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your collection tasks
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                            <Inbox className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.assigned}</div>
                            <p className="text-xs text-muted-foreground">Awaiting acceptance</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                            <Clock className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.accepted}</div>
                            <p className="text-xs text-muted-foreground">Ready to start</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                            <PlayCircle className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.in_progress}</div>
                            <p className="text-xs text-muted-foreground">Currently working</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.completed}</div>
                            <p className="text-xs text-muted-foreground">Finished tasks</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tasks */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Tasks</CardTitle>
                                <CardDescription>Your latest collection assignments</CardDescription>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href={tasksIndex.url()}>View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <ClipboardList className="mb-4 size-12 text-muted-foreground" />
                                <p className="mb-4 text-muted-foreground">
                                    No tasks assigned yet.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Tasks will appear here when an administrator assigns them to you.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentTasks.map((task) => (
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
                                                <p className="text-xs text-muted-foreground">
                                                    Location: {task.waste_report?.location_description}
                                                </p>
                                                {task.waste_report?.resident && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Reported by: {task.waste_report.resident.name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right text-xs text-muted-foreground">
                                                {task.scheduled_at
                                                    ? new Date(task.scheduled_at).toLocaleDateString()
                                                    : new Date(task.created_at).toLocaleDateString()}
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
                                <Link href={tasksIndex.url()}>
                                    <ClipboardList className="mr-2 size-4" />
                                    View All Tasks
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

WorkerDashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/worker/dashboard' },
    ],
};
