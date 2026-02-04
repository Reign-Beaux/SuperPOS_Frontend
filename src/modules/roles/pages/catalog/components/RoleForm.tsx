import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import type { UpdateRoleRequest } from "@/modules/roles/models/Role";
import { type RoleFormValues, roleSchema } from "@/modules/roles/schemes/RoleScheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface RoleFormProps {
    initialData?: UpdateRoleRequest;
    onSubmit: (data: RoleFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const RoleForm = ({ initialData, onSubmit, onCancel, isLoading }: RoleFormProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                description: initialData.description || "",
            });
        } else {
            reset({
                name: "",
                description: "",
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5">
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Name *
                </label>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Role Name"
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
