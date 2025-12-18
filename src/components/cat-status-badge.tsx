import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

interface CatStatusBadgeProps {
    status?: 'active' | 'found' | 'closed';
}

export function CatStatusBadge({ status = 'active' }: CatStatusBadgeProps) {
    switch (status) {
        case 'found':
            return (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Ditemukan
                </Badge>
            );
        case 'closed':
            return (
                <Badge variant="secondary">
                    <XCircle className="h-3 w-3 mr-1" />
                    Ditutup
                </Badge>
            );
        default:
            return (
                <Badge variant="default">
                    <Circle className="h-3 w-3 mr-1" />
                    Aktif
                </Badge>
            );
    }
}
