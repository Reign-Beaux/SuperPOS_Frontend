import { Button } from "@components/elements/button";
import { Input } from "@components/elements/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateProductRequest } from "@modules/products/models/Product";
import { type ProductFormValues, productSchema } from "@modules/products/schemes/ProductScheme";
import { Controller, useForm } from "react-hook-form";

interface ProductFormProps {
    initialData?: UpdateProductRequest;
    onSubmit: (data: ProductFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, onCancel, isLoading }: ProductFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            barcode: "",
            unitPrice: 0,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5">
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Name
                </label>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Product Name"
                            className={errors.name ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                </label>
                <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Description (Optional)"
                            className={errors.description ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Barcode
                </label>
                <Controller
                    control={control}
                    name="barcode"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Barcode"
                            className={errors.barcode ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.barcode && (
                    <p className="text-sm text-red-500">{errors.barcode.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Unit Price
                </label>
                <Controller
                    control={control}
                    name="unitPrice"
                    render={({ field: { onChange, ...field } }) => (
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                $
                            </span>
                            <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                onChange={(e) => onChange(e.target.valueAsNumber)}
                                className={`pl-7 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.unitPrice ? "border-red-500" : ""}`}
                            />
                        </div>
                    )}
                />
                {errors.unitPrice && (
                    <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button className="cursor-pointer" type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button className="cursor-pointer" type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
};
