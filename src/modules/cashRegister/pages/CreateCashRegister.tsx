import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { Label } from "@/components/elements/label";
import { Textarea } from "@/components/elements/textarea";
import { PageHeader } from "@/components/widgets/PageHeader";
import { SearchableSelect } from "@/components/widgets/SearchableSelect";
import { useCashRegisterApi } from "@/modules/cashRegister/api/cashRegisterApi";
import { useUserApi } from "@/modules/users/userApi";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateCashRegister = () => {
    const navigate = useNavigate();
    const { createCashRegister } = useCashRegisterApi();
    const { searchUsers } = useUserApi();

    const [userId, setUserId] = useState("");
    const [openingDate, setOpeningDate] = useState("");
    const [closingDate, setClosingDate] = useState("");
    const [initialCash, setInitialCash] = useState("");
    const [finalCash, setFinalCash] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearchUsers = useCallback(async (term: string) => {
        try {
            const results = await searchUsers(term);
            return results.map(u => ({ label: `${u.name} ${u.firstLastname}`, value: u.id }));
        } catch (error) {
            console.error("Failed to search users", error);
            return [];
        }
    }, [searchUsers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !openingDate || !closingDate || !initialCash || !finalCash) {
            toast.error("Please fill all required fields");
            return;
        }

        const initialCashNum = parseFloat(initialCash);
        const finalCashNum = parseFloat(finalCash);

        if (isNaN(initialCashNum) || isNaN(finalCashNum)) {
            toast.error("Invalid cash amounts");
            return;
        }

        if (new Date(openingDate) >= new Date(closingDate)) {
            toast.error("Opening date must be before closing date");
            return;
        }

        setIsSubmitting(true);
        try {
            await createCashRegister({
                userId,
                openingDate,
                closingDate,
                initialCash: initialCashNum,
                finalCash: finalCashNum,
                notes: notes || undefined,
            });
            toast.success("Cash register created successfully");
            navigate("/cash-register");
        } catch (error) {
            console.error("Failed to create cash register", error);
            toast.error("Failed to create cash register");
        } finally {
            setIsSubmitting(false);
        }
    };

    const expectedCash = parseFloat(initialCash || "0") + 0; // Will be calculated with sales
    const difference = parseFloat(finalCash || "0") - expectedCash;

    return (
        <div className="container mx-auto py-10 space-y-6">
            <PageHeader
                title="Create Cash Register"
                action={
                    <Button variant="outline" onClick={() => navigate("/cash-register")}>
                        Cancel
                    </Button>
                }
            />

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 border rounded-lg p-6">
                <div className="space-y-2">
                    <Label htmlFor="user">User (Cashier) *</Label>
                    <SearchableSelect
                        onSearch={handleSearchUsers}
                        value={userId}
                        onSelect={setUserId}
                        placeholder="Select User"
                        searchPlaceholder="Search user..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="openingDate">Opening Date *</Label>
                        <Input
                            id="openingDate"
                            type="datetime-local"
                            value={openingDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpeningDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="closingDate">Closing Date *</Label>
                        <Input
                            id="closingDate"
                            type="datetime-local"
                            value={closingDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClosingDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="initialCash">Initial Cash *</Label>
                        <Input
                            id="initialCash"
                            type="number"
                            step="0.01"
                            min="0"
                            value={initialCash}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInitialCash(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="finalCash">Final Cash *</Label>
                        <Input
                            id="finalCash"
                            type="number"
                            step="0.01"
                            min="0"
                            value={finalCash}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFinalCash(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {initialCash && finalCash && (
                    <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                        <h3 className="font-semibold">Preview</h3>
                        <div className="flex justify-between text-sm">
                            <span>Expected Cash:</span>
                            <span>${expectedCash.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Final Cash:</span>
                            <span>${parseFloat(finalCash).toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between font-semibold ${difference === 0 ? "text-green-600" : difference > 0 ? "text-blue-600" : "text-destructive"}`}>
                            <span>Difference:</span>
                            <span>${difference.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                        placeholder="Optional notes about this cash register..."
                        rows={3}
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{notes.length}/500 characters</p>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Cash Register"}
                </Button>
            </form>
        </div>
    );
};

export default CreateCashRegister;
