import { Badge } from '@/components/ui/badge';
import type { CollectionTask } from '@/types';

type TaskStatusBadgeProps = {
    status: CollectionTask['status'];
};

const taskStatusConfig: Record<
    CollectionTask['status'],
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
    assigned: { label: 'Assigned', variant: 'outline' },
    accepted: { label: 'Accepted', variant: 'secondary' },
    in_progress: { label: 'In Progress', variant: 'default' },
    completed: { label: 'Completed', variant: 'default' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
};

export default function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
    const config = taskStatusConfig[status];

    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
}
