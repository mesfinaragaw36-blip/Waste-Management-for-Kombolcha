export type User = {
    id: number;
    name: string;
    email: string;
    role: 'resident' | 'worker' | 'administrator';
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    waste_reports_count?: number;
    assigned_collection_tasks_count?: number;
    created_collection_tasks_count?: number;
    report_status_changes_count?: number;
    task_status_changes_count?: number;
    waste_reports?: Array<{
        id: number;
        title: string;
        category?: { name: string } | null;
        status: string;
    }>;
    assigned_collection_tasks?: Array<{
        id: number;
        status: string;
        waste_report?: {
            title?: string;
            category?: { name: string } | null;
        };
    }>;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
