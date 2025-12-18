'use client';

import { Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';

export interface CatFilters {
    status: string[];
    gender: string[];
    type: string[];
}

interface CatFiltersProps {
    filters: CatFilters;
    onFiltersChange: (filters: CatFilters) => void;
    availableBreeds?: string[];
}

export function CatFiltersComponent({ filters, onFiltersChange, availableBreeds = [] }: CatFiltersProps) {
    const toggleFilter = (category: keyof CatFilters, value: string) => {
        const currentValues = filters[category];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        onFiltersChange({
            ...filters,
            [category]: newValues,
        });
    };

    const clearFilters = () => {
        onFiltersChange({
            status: [],
            gender: [],
            type: [],
        });
    };

    const activeFilterCount =
        filters.status.length +
        filters.gender.length +
        filters.type.length;

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Status Laporan</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={filters.status.includes('active')}
                        onCheckedChange={() => toggleFilter('status', 'active')}
                    >
                        Aktif
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={filters.status.includes('found')}
                        onCheckedChange={() => toggleFilter('status', 'found')}
                    >
                        Ditemukan
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={filters.status.includes('closed')}
                        onCheckedChange={() => toggleFilter('status', 'closed')}
                    >
                        Ditutup
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Jenis Kelamin</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={filters.gender.includes('Male')}
                        onCheckedChange={() => toggleFilter('gender', 'Male')}
                    >
                        Jantan
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={filters.gender.includes('Female')}
                        onCheckedChange={() => toggleFilter('gender', 'Female')}
                    >
                        Betina
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={filters.gender.includes('Unknown')}
                        onCheckedChange={() => toggleFilter('gender', 'Unknown')}
                    >
                        Tidak Diketahui
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Tipe Laporan</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem
                        checked={filters.type.includes('Hilang')}
                        onCheckedChange={() => toggleFilter('type', 'Hilang')}
                    >
                        Hilang
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={filters.type.includes('Ditemukan')}
                        onCheckedChange={() => toggleFilter('type', 'Ditemukan')}
                    >
                        Ditemukan
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Reset Filter
                </Button>
            )}
        </div>
    );
}
