import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, MapPin, Search, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/status-badge';
import { index, show } from '@/actions/App/Http/Controllers/Admin/CollectionTaskController';
import type { PaginatedCollectionTasks, User as UserType } from '@/types';
import { useState } from 'react';

type PageProps = {
    tasks: PaginatedCollectionTasks;
    workers: UserType[];
    filters: {
        status?: string;
        worker_id?: string;
        search?: string;
    };
};

export default function AdminTasksIndex({ tasks, workers, filters }: PageProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleFilter = (key: string, value: string) => {
        router.get(
            index.url(),
            { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('search', searchValue);
    };

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
            <Head title="Manage Tasks" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Tasks</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitor and manage all collection tasks
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Search and filter tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Search tasks..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="size-4" />
                                </Button>
                            </form>

                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilter('status', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="assigned">Assigned</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.worker_id || 'all'}
                                onValueChange={(value) => handleFilter('worker_id', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Worker" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Workers</SelectItem>
                                    {workers.map((worker) => (
                                        <SelectItem key={worker.id} value={worker.id.toString()}>
                                            {worker.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(filters.status || filters.worker_id || filters.search) && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.get(index.url())}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {tasks.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ClipboardList className="mb-4 size-12 text-muted-foreground" />
                            <p className="text-lg text-muted-foreground">
                                No tasks found matching your filters.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tasks.data.map((task) => (
                                <Link key={task.id} href={show.url(task.id)}>
                                    <Card className="h-full transition-shadow hover:shadow-md">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="line-clamp-1">
                                                    {task.waste_report?.title || 'Task #' + task.id}
                                                </CardTitle>
                                                <Badge className={getTaskStatusColor(task.status)}>
                                                    {task.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <CardDescription className="line-clamp-1">
                                                {task.waste_report?.category?.name}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    <span className="line-clamp-1">
                                                        {task.waste_report?.location_description}
                                                    </span>
                                                </div>
                                                {task.assigned_worker && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="size-3" />
                                                        <span>{task.assigned_worker.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                {task.scheduled_at && (
                                                    <span>
                                                        Scheduled: {new Date(task.scheduled_at).toLocaleDateString()}
                                                    </span>
                                                )}
                                                <span>
                                                    Created: {new Date(task.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {tasks.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {tasks.links.map((link, index) => (
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

AdminTasksIndex.layout = {
    breadcrumbs: [
        { title: 'Manage Tasks', href: '/admin/tasks' },
    ],
};
