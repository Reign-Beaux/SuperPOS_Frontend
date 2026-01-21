import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import type { UpdateArticleRequest } from "@/modules/articles/models/Article";
import { type ArticleFormValues, articleSchema } from "@/modules/articles/schemes/ArticleScheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ArticleFormProps {
    initialData?: UpdateArticleRequest;
    onSubmit: (data: ArticleFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ArticleForm = ({ initialData, onSubmit, onCancel, isLoading }: ArticleFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            name: "",
            description: "",
            barcode: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                description: initialData.description,
                barcode: initialData.barcode,
            });
        } else {
            reset({
                name: "",
                description: "",
                barcode: "",
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 py-2">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Name
                </label>
                <Input
                    {...register("name")}
                    placeholder="Article Name"
                    className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.name && (
                    <span className="text-sm font-medium text-destructive">{errors.name.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Description
                </label>
                <Input
                    {...register("description")}
                    placeholder="Description"
                />
                {errors.description && (
                    <span className="text-sm font-medium text-destructive">{errors.description.message}</span>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Barcode
                </label>
                <Input
                    {...register("barcode")}
                    placeholder="Barcode"
                    className={errors.barcode ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.barcode && (
                    <span className="text-sm font-medium text-destructive">{errors.barcode.message}</span>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
};
