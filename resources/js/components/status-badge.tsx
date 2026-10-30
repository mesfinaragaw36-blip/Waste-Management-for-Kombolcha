import { Badge } from '@/components/ui/badge';
import type { WasteReport } from '@/types';

type StatusBadgeProps = {
    status: WasteReport['status'];
};

const statusConfig: Record<
    WasteReport['status'],
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
    pending: { label: 'Pending', variant: 'outline' },
    under_review: { label: 'Under Review', variant: 'secondary' },
    approved: { label: 'Approved', variant: 'default' },
    assigned: { label: 'Assigned', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'default' },
    resolved: { label: 'Resolved', variant: 'default' },
    rejected: { label: 'Rejected', variant: 'destructive' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
}
