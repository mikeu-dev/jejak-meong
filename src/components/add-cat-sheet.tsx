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
import { useLanguage } from "@/context/language-context";

type AddCatSheetProps = {
  children: React.ReactNode;
};

export function AddCatSheet({ children }: AddCatSheetProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('sheetTitle')}</SheetTitle>
          <SheetDescription>
            {t('sheetDescription')}
          </SheetDescription>
        </SheetHeader>
        <AddCatForm onFormSuccess={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
