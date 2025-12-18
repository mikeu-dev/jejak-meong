'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Loader2, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { updateCatStatus } from '@/app/cat-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UpdateCatStatusDialogProps {
    catId: string;
    userId: string;
    currentStatus: 'active' | 'found' | 'closed';
    catName: string;
    children: React.ReactNode;
    onSuccess?: () => void;
}

export function UpdateCatStatusDialog({
    catId,
    userId,
    currentStatus,
    catName,
    children,
    onSuccess
}: UpdateCatStatusDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'found' | 'closed'>(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleUpdate = async () => {
        if (selectedStatus === currentStatus) {
            toast({
                title: 'Tidak Ada Perubahan',
                description: 'Status yang dipilih sama dengan status saat ini.',
                variant: 'default',
            });
            setOpen(false);
            return;
        }

        setIsUpdating(true);
        const result = await updateCatStatus(catId, userId, selectedStatus);
        setIsUpdating(false);

        toast({
            title: result.success ? 'Berhasil' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
        });

        if (result.success) {
            setOpen(false);
            onSuccess?.();
            router.refresh();
        }
    };

    const getStatusInfo = (status: 'active' | 'found' | 'closed') => {
        switch (status) {
            case 'active':
                return {
                    label: 'Aktif',
                    description: 'Laporan masih aktif, kucing belum ditemukan',
                    icon: Circle,
                    color: 'text-blue-500',
                };
            case 'found':
                return {
                    label: 'Ditemukan',
                    description: 'Kucing sudah ditemukan dan kembali ke pemilik',
                    icon: CheckCircle2,
                    color: 'text-green-500',
                };
            case 'closed':
                return {
                    label: 'Ditutup',
                    description: 'Laporan ditutup tanpa hasil',
                    icon: XCircle,
                    color: 'text-gray-500',
                };
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Status Laporan</DialogTitle>
                    <DialogDescription>
                        Ubah status laporan untuk <strong>{catName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                        {(['active', 'found', 'closed'] as const).map((status) => {
                            const info = getStatusInfo(status);
                            const Icon = info.icon;
                            return (
                                <div key={status} className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <RadioGroupItem value={status} id={status} />
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor={status} className="flex items-center gap-2 cursor-pointer">
                                            <Icon className={`h-4 w-4 ${info.color}`} />
                                            <span className="font-medium">{info.label}</span>
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            {info.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
                        Batal
                    </Button>
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            'Update Status'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
