'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddCatForm } from "./add-cat-form";
import { useState } from "react";

type AddCatSheetProps = {
  children: React.ReactNode;
};

export function AddCatSheet({ children }: AddCatSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Report a Missing or Found Cat</SheetTitle>
          <SheetDescription>
            Fill in the details below to add a pin to the map. Let's help them find their way home.
          </SheetDescription>
        </SheetHeader>
        <AddCatForm onFormSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
