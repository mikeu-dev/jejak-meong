'use client';

import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { deleteCat } from '@/app/cat-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface DeleteCatDialogProps {
    catId: string;
    userId: string;
    catName: string;
    children: React.ReactNode;
    onSuccess?: () => void;
}

export function DeleteCatDialog({ catId, userId, catName, children, onSuccess }: DeleteCatDialogProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteCat(catId, userId);
        setIsDeleting(false);

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

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Laporan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus laporan untuk <strong>{catName}</strong>?
                        <br />
                        <br />
                        Tindakan ini tidak dapat dibatalkan. Laporan dan semua foto yang terkait akan dihapus
                        secara permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menghapus...
                            </>
                        ) : (
                            'Hapus'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
