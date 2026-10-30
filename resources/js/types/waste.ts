export type WasteCategory = {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type ReportStatusHistory = {
    id: number;
    waste_report_id: number;
    changed_by: number | null;
    old_status: string | null;
    new_status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    changed_by?: {
        id: number;
        name: string;
        email: string;
        role: 'resident' | 'worker' | 'administrator';
    };
};

export type WasteReport = {
    id: number;
    resident_id: number;
    waste_category_id: number;
    title: string;
    description: string;
    photo_path: string | null;
    location_description: string;
    latitude: string | null;
    longitude: string | null;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'under_review' | 'approved' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    category?: WasteCategory;
    resident?: {
        id: number;
        name: string;
        email: string;
        role: 'resident' | 'worker' | 'administrator';
    };
    status_histories?: ReportStatusHistory[];
    collection_task?: CollectionTask;
    status_histories_count?: number;
};

export type PaginatedReports = {
    data: WasteReport[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type TaskStatusHistory = {
    id: number;
    collection_task_id: number;
    changed_by: number | null;
    old_status: string | null;
    new_status: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    changed_by?: {
        id: number;
        name: string;
        email: string;
        role: 'resident' | 'worker' | 'administrator';
    };
};

export type CollectionTask = {
    id: number;
    waste_report_id: number;
    assigned_worker_id: number;
    assigned_by: number;
    scheduled_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    completion_notes: string | null;
    completion_photo_path: string | null;
    created_at: string;
    updated_at: string;
    waste_report?: WasteReport;
    assigned_worker?: {
        id: number;
        name: string;
        email: string;
        role: 'resident' | 'worker' | 'administrator';
    };
    assigned_by?: {
        id: number;
        name: string;
        email: string;
        role: 'resident' | 'worker' | 'administrator';
    };
    status_histories?: TaskStatusHistory[];
};

export type PaginatedCollectionTasks = {
    data: CollectionTask[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: 'resident' | 'worker' | 'administrator';
    created_at: string;
    updated_at: string;
    waste_reports_count?: number;
    assigned_collection_tasks_count?: number;
    created_collection_tasks_count?: number;
    report_status_changes_count?: number;
    task_status_changes_count?: number;
    waste_reports?: WasteReport[];
    assigned_collection_tasks?: CollectionTask[];
};

export type PaginatedUsers = {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type ResidentDashboardMetrics = {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
    rejected: number;
};

export type WorkerDashboardMetrics = {
    assigned: number;
    accepted: number;
    in_progress: number;
    completed: number;
};

export type AdminReportMetrics = {
    pending: number;
    under_review: number;
    approved: number;
    assigned: number;
    in_progress: number;
    resolved: number;
    rejected: number;
};

export type AdminTaskMetrics = {
    assigned: number;
    accepted: number;
    in_progress: number;
    completed: number;
    cancelled: number;
};

export type AdminUserMetrics = {
    residents: number;
    workers: number;
    administrators: number;
};

