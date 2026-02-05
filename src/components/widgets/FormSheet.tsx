import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/elements/sheet";
import type { ReactNode } from "react";

interface FormSheetProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const FormSheet = ({ title, description, isOpen, onClose, children }: FormSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description || "Make changes to your item here. Click save when you're done."}</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
};
