'use client';

import Image from 'next/image';
import type { Cat } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type CatListProps = {
  cats: Cat[];
};

export function CatList({ cats }: CatListProps) {
  if (cats.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20">
        <h2 className="text-2xl font-semibold">No Cats Reported Yet</h2>
        <p>Be the first to report a missing or found cat in your area!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cats.map((cat) => (
        <Card key={cat.id} className="flex flex-col overflow-hidden">
          <CardHeader className="p-0">
            <div className="aspect-video relative bg-muted">
              {cat.imageUrl && (
                <Image src={cat.imageUrl} data-ai-hint="cat" alt={cat.name} fill className="object-cover" />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <CardTitle className="text-xl font-bold mb-1">{cat.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{cat.breed}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{cat.gender}</Badge>
              <Badge variant="secondary">{cat.type}</Badge>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-muted/50 flex-col items-start gap-2">
             <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{cat.locationText}</span>
             </div>
             <p className="text-xs text-muted-foreground w-full">
                {cat.createdAt ? formatDistanceToNow(new Date(cat.createdAt), { addSuffix: true }) : 'A while ago'}
             </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
