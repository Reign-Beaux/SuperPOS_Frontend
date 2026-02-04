import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/elements/sheet";
import type { ReactNode } from "react";

interface FormSheetProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const FormSheet = ({ title, isOpen, onClose, children }: FormSheetProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
};
