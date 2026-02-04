import { Button } from "@components/elements/button";
import { Input } from "@components/elements/input";
import type { UpdateUserRequest } from "@modules/users/models/User";
import { type UserFormValues, userSchema } from "@modules/users/schemes/UserScheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface UserFormProps {
    initialData?: UpdateUserRequest;
    onSubmit: (data: UserFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const UserForm = ({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            firstLastname: "",
            secondLastname: "",
            email: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                name: "",
                firstLastname: "",
                secondLastname: "",
                email: "",
                phone: "",
            });
        }
    }, [initialData, reset]);

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
                            placeholder="User Name"
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
                    First Lastname
                </label>
                <Controller
                    control={control}
                    name="firstLastname"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="First Lastname"
                            className={errors.firstLastname ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.firstLastname && (
                    <p className="text-sm text-red-500">{errors.firstLastname.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Second Lastname
                </label>
                <Controller
                    control={control}
                    name="secondLastname"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Second Lastname (Optional)"
                            className={errors.secondLastname ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.secondLastname && (
                    <p className="text-sm text-red-500">{errors.secondLastname.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                </label>
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Email"
                            className={errors.email ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Phone
                </label>
                <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Phone (Optional)"
                            className={errors.phone ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password {initialData ? "(Leave empty to keep current)" : "*"}
                </label>
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            className={errors.password ? "border-red-500" : ""}
                        />
                    )}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
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
