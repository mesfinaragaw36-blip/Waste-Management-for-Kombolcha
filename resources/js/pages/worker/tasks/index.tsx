import { Head, Link } from '@inertiajs/react';
import { Calendar, ClipboardList, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskStatusBadge from '@/components/task-status-badge';
import type { CollectionTask, PaginatedCollectionTasks } from '@/types';

type Props = {
    tasks: PaginatedCollectionTasks;
};

export default function Index({ tasks }: Props) {
    return (
        <>
            <Head title="My Tasks" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                    <p className="text-muted-foreground">
                        View and manage your assigned collection tasks
                    </p>
                </div>

                {tasks.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                You have no assigned tasks at the moment.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tasks.data.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}

                {tasks.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {tasks.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 text-sm rounded-md border ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background hover:bg-accent'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                preserveScroll
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function TaskCard({ task }: { task: CollectionTask }) {
    const report = task.waste_report;

    return (
        <Link href={`/worker/tasks/${task.id}`} className="block">
            <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">
                            {report?.title || `Task #${task.id}`}
                        </CardTitle>
                        <TaskStatusBadge status={task.status} />
                    </div>
                    {report?.category && (
                        <CardDescription>
                            <Badge variant="secondary">{report.category.name}</Badge>
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="space-y-2">
                    {report?.location_description && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{report.location_description}</span>
                        </div>
                    )}
                    {task.scheduled_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Scheduled: {new Date(task.scheduled_at).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    {report?.priority && (
                        <div className="pt-2">
                            <Badge
                                variant={
                                    report.priority === 'high'
                                        ? 'destructive'
                                        : report.priority === 'medium'
                                          ? 'default'
                                          : 'outline'
                                }
                            >
                                {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}{' '}
                                Priority
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
