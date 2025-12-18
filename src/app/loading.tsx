import { Skeleton } from '@/components/ui/skeleton';
import { PawPrint } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex flex-col h-svh w-screen">
            <header className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm shadow-md">
                <div className="flex items-center gap-3">
                    <PawPrint className="h-8 w-8 text-primary" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-24 rounded-md" />
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </main>
        </div>
    );
}
