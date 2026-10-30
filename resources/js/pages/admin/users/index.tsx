import { Head, Link, router } from '@inertiajs/react';
import { Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { index, show } from '@/actions/App/Http/Controllers/Admin/UserController';
import type { PaginatedUsers } from '@/types';
import { useState } from 'react';

type PageProps = {
    users: PaginatedUsers;
    filters: {
        role?: string;
        search?: string;
    };
    roles: string[];
};

export default function AdminUsersIndex({ users, filters, roles }: PageProps) {
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

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'administrator':
                return 'destructive' as const;
            case 'worker':
                return 'default' as const;
            case 'resident':
                return 'secondary' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <>
            <Head title="Manage Users" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
                    <p className="text-muted-foreground">
                        View and manage user accounts and roles
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Search and filter users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Search users..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                                <Button type="submit" variant="secondary">
                                    <Search className="size-4" />
                                </Button>
                            </form>

                            <Select
                                value={filters.role || 'all'}
                                onValueChange={(value) => handleFilter('role', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {(filters.role || filters.search) && (
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

                {users.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="mb-4 size-12 text-muted-foreground" />
                            <p className="text-lg text-muted-foreground">
                                No users found matching your filters.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {users.data.map((user) => (
                                <Link key={user.id} href={show.url(user.id)}>
                                    <Card className="h-full transition-shadow hover:shadow-md">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-2">
                                                <CardTitle className="line-clamp-1">
                                                    {user.name}
                                                </CardTitle>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </Badge>
                                            </div>
                                            <CardDescription className="line-clamp-1">
                                                {user.email}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                {user.role === 'resident' && (
                                                    <div className="rounded-lg bg-muted p-2">
                                                        <div className="font-semibold">
                                                            {user.waste_reports_count || 0}
                                                        </div>
                                                        <div className="text-muted-foreground">Reports</div>
                                                    </div>
                                                )}
                                                {user.role === 'worker' && (
                                                    <div className="rounded-lg bg-muted p-2">
                                                        <div className="font-semibold">
                                                            {user.assigned_collection_tasks_count || 0}
                                                        </div>
                                                        <div className="text-muted-foreground">Tasks</div>
                                                    </div>
                                                )}
                                                {user.role === 'administrator' && (
                                                    <>
                                                        <div className="rounded-lg bg-muted p-2">
                                                            <div className="font-semibold">
                                                                {user.created_collection_tasks_count || 0}
                                                            </div>
                                                            <div className="text-muted-foreground">Assigned</div>
                                                        </div>
                                                        <div className="rounded-lg bg-muted p-2">
                                                            <div className="font-semibold">
                                                                {user.report_status_changes_count || 0}
                                                            </div>
                                                            <div className="text-muted-foreground">Reviews</div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Joined: {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {users.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {users.links.map((link, index) => (
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

AdminUsersIndex.layout = {
    breadcrumbs: [
        { title: 'Manage Users', href: '/admin/users' },
    ],
};
