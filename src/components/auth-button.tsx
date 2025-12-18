'use client';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { LogIn, LogOut, Plus, User } from 'lucide-react';

import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AddCatSheet } from './add-cat-sheet';
import Link from 'next/link';

export function AuthButton() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <AddCatSheet>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('reportCatButton')}
          </Button>
        </AddCatSheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logoutButton')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button onClick={handleLogin}>
      <LogIn className="mr-2 h-4 w-4" />
      {t('loginButton')}
    </Button>
  );
}
