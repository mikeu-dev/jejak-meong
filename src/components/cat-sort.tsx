'use client';

import { ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

interface CatSortProps {
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
}

export function CatSort({ sortBy, onSortChange }: CatSortProps) {
    const getSortLabel = (sort: SortOption) => {
        switch (sort) {
            case 'newest':
                return 'Terbaru';
            case 'oldest':
                return 'Terlama';
            case 'name-asc':
                return 'Nama A-Z';
            case 'name-desc':
                return 'Nama Z-A';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Urutkan: {getSortLabel(sortBy)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Urutkan Berdasarkan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                    <DropdownMenuRadioItem value="newest">
                        Terbaru
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">
                        Terlama
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name-asc">
                        Nama A-Z
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="name-desc">
                        Nama Z-A
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
