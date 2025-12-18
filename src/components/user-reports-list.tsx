'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Cat } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Calendar, Edit, Trash2, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import Link from 'next/link';
import { EditCatDialog } from './edit-cat-dialog';
import { DeleteCatDialog } from './delete-cat-dialog';
import { UpdateCatStatusDialog } from './update-cat-status-dialog';

interface UserReportsListProps {
    userId: string;
}

export function UserReportsList({ userId }: UserReportsListProps) {
    const [cats, setCats] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'found' | 'closed'>('all');

    useEffect(() => {
        if (!userId) return;

        const catsCollection = collection(db, 'cats');
        const q = query(
            catsCollection,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const catsData: Cat[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const latitude = data.location?.latitude || 0;
                const longitude = data.location?.longitude || 0;

                return {
                    id: doc.id,
                    name: data.name,
                    gender: data.gender,
                    type: data.type,
                    breed: data.breed,
                    imageUrl: data.imageUrl,
                    locationText: data.locationText,
                    location: { latitude, longitude },
                    latitude,
                    longitude,
                    createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
                    userId: data.userId,
                    userEmail: data.userEmail,
                    userName: data.userName,
                    userPhotoURL: data.userPhotoURL,
                    status: data.status || 'active',
                    contactInfo: data.contactInfo,
                    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp)?.toDate().toISOString() : undefined,
                } as Cat;
            });
            setCats(catsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const filteredCats = filter === 'all'
        ? cats
        : cats.filter(cat => cat.status === filter);

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'found':
                return <Badge variant="default" className="bg-green-500">Ditemukan</Badge>;
            case 'closed':
                return <Badge variant="secondary">Ditutup</Badge>;
            default:
                return <Badge variant="default">Aktif</Badge>;
        }
    };

    const stats = {
        total: cats.length,
        active: cats.filter(c => c.status === 'active').length,
        found: cats.filter(c => c.status === 'found').length,
        closed: cats.filter(c => c.status === 'closed').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Laporan</CardDescription>
                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Aktif</CardDescription>
                        <CardTitle className="text-3xl text-blue-500">{stats.active}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Ditemukan</CardDescription>
                        <CardTitle className="text-3xl text-green-500">{stats.found}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Ditutup</CardDescription>
                        <CardTitle className="text-3xl text-gray-500">{stats.closed}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Semua ({stats.total})
                </Button>
                <Button
                    variant={filter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('active')}
                >
                    Aktif ({stats.active})
                </Button>
                <Button
                    variant={filter === 'found' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('found')}
                >
                    Ditemukan ({stats.found})
                </Button>
                <Button
                    variant={filter === 'closed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('closed')}
                >
                    Ditutup ({stats.closed})
                </Button>
            </div>

            {/* Reports Grid */}
            {filteredCats.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            {filter === 'all'
                                ? 'Anda belum membuat laporan apapun'
                                : `Tidak ada laporan dengan status "${filter}"`}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCats.map((cat) => (
                        <Card key={cat.id} className="overflow-hidden">
                            {cat.imageUrl && (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="line-clamp-1">{cat.name}</CardTitle>
                                        <CardDescription className="line-clamp-1">
                                            {cat.breed} • {cat.gender === 'Male' ? 'Jantan' : cat.gender === 'Female' ? 'Betina' : 'Tidak Diketahui'}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(cat.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2">{cat.locationText}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {format(new Date(cat.createdAt), 'dd MMM yyyy', { locale: idLocale })}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Link href={`/cat/${cat.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Lihat Detail
                                    </Button>
                                </Link>
                                <UpdateCatStatusDialog
                                    catId={cat.id}
                                    userId={userId}
                                    currentStatus={cat.status || 'active'}
                                    catName={cat.name}
                                >
                                    <Button variant="outline" size="sm" title="Update Status">
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </UpdateCatStatusDialog>
                                <EditCatDialog cat={cat} userId={userId}>
                                    <Button variant="outline" size="sm" title="Edit">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </EditCatDialog>
                                <DeleteCatDialog catId={cat.id} userId={userId} catName={cat.name}>
                                    <Button variant="outline" size="sm" title="Hapus">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </DeleteCatDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
