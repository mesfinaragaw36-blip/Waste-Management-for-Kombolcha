import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, FileText, FolderGit2, LayoutGrid, PlusCircle, Shield, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { index as reportsIndex, create as reportsCreate } from '@/actions/App/Http/Controllers/Resident/WasteReportController';
import { index as workerTasksIndex } from '@/actions/App/Http/Controllers/Worker/CollectionTaskController';
import { index as adminReportsIndex } from '@/actions/App/Http/Controllers/Admin/WasteReportController';
import { index as adminTasksIndex } from '@/actions/App/Http/Controllers/Admin/CollectionTaskController';
import { index as adminUsersIndex } from '@/actions/App/Http/Controllers/Admin/UserController';
import type { Auth, NavItem } from '@/types';

function useMainNavItems(): NavItem[] {
    const { auth } = usePage<{ auth: Auth }>().props;

    // Role-specific dashboard URL
    const dashboardUrl = auth.user.role === 'resident' 
        ? '/resident/dashboard'
        : auth.user.role === 'worker'
        ? '/worker/dashboard'
        : auth.user.role === 'administrator'
        ? '/admin/dashboard'
        : '/dashboard';

    const items: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
    ];

    if (auth.user.role === 'resident') {
        items.push(
            {
                title: 'My Reports',
                href: reportsIndex.url(),
                icon: FileText,
            },
            {
                title: 'Report Waste',
                href: reportsCreate.url(),
                icon: PlusCircle,
            }
        );
    }

    if (auth.user.role === 'worker') {
        items.push({
            title: 'My Tasks',
            href: workerTasksIndex.url(),
            icon: ClipboardList,
        });
    }

    if (auth.user.role === 'administrator') {
        items.push(
            {
                title: 'Manage Reports',
                href: adminReportsIndex.url(),
                icon: FileText,
            },
            {
                title: 'Manage Tasks',
                href: adminTasksIndex.url(),
                icon: ClipboardList,
            },
            {
                title: 'Manage Users',
                href: adminUsersIndex.url(),
                icon: Users,
            }
        );
    }

    return items;
}

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: FolderGit2,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const mainNavItems = useMainNavItems();
    const { auth } = usePage<{ auth: Auth }>().props;

    // Role-specific dashboard URL
    const dashboardUrl = auth.user.role === 'resident' 
        ? '/resident/dashboard'
        : auth.user.role === 'worker'
        ? '/worker/dashboard'
        : auth.user.role === 'administrator'
        ? '/admin/dashboard'
        : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
