'use client';

import { PawPrint } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { AuthButton } from '@/components/auth-button';
import { useLanguage } from '@/context/language-context';

export function PageHeader() {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm shadow-md">
            <div className="flex items-center gap-3">
                <PawPrint className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline text-foreground">
                    {t('appName')}
                </h1>
            </div>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
                <AuthButton />
            </div>
        </header>
    );
}
