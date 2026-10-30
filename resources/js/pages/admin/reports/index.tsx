import { Head, Link, router } from '@inertiajs/react';
import { FileText, MapPin, Search, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/status-badge';
import { index, show } from '@/actions/App/Http/Controllers/Admin/WasteReportController';
import type { PaginatedReports } from '@/types';
import { useState } from 'react';

type PageProps = {
    reports: PaginatedReports;
    filters: {
        status?: string;
        priority?: string;
        category_id?: string;
        search?: string;
    };
};

export default function AdminReportsIndex({ reports, filters }: PageProps) {
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
            <Head title="Manage Reports" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manage Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        Review and manage all waste reports
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Search and filter reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <form onSubmit={handleSearch} className="flex gap-2 sm:col-span-2 lg:col-span-1">
                                <Input
                                    placeholder="Search reports..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <Button type="submit" variant="secondary" size="icon" className="shrink-0">
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
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="assigned">Assigned</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.priority || 'all'}
                                onValueChange={(value) => handleFilter('priority', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>

                            {(filters.status || filters.priority || filters.search) && (
                                <Button
                                    variant="outline"
                                    onClick={() => router.get(index.url())}
                                    className="sm:col-span-2 lg:col-span-1"
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {reports.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="mb-4 size-12 text-muted-foreground" />
                            <p className="text-lg text-muted-foreground">
                                No reports found matching your filters.
                            </p>
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
                                            <div className="space-y-2 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    <span className="line-clamp-1">
                                                        {report.location_description}
                                                    </span>
                                                </div>
                                                {report.resident && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="size-3" />
                                                        <span>{report.resident.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Badge variant={priorityVariant(report.priority)}>
                                                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(report.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {reports.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {reports.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        asChild={!!link.url}
                                        disabled={!link.url}
                                        className="min-w-[2.5rem]"
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

AdminReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Manage Reports', href: '/admin/reports' },
    ],
};
