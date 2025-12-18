'use client';

import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mail, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { UserReportsList } from './user-reports-list';

export function UserProfile() {
    const { user } = useAuth();
    const { t } = useLanguage();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4">
                            <LogIn className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <CardTitle>Login Diperlukan</CardTitle>
                        <CardDescription>
                            Anda harus login untuk melihat profil dan mengelola laporan Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Link href="/">
                            <Button>Kembali ke Beranda</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* User Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Akun</CardTitle>
                    <CardDescription>Detail akun Google Anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                            <AvatarFallback className="text-2xl">
                                {user.displayName?.charAt(0) || user.email?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Nama</p>
                                    <p className="font-medium">{user.displayName || 'Tidak tersedia'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* User Reports */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Laporan Saya</h2>
                <UserReportsList userId={user.uid} />
            </div>
        </div>
    );
}
