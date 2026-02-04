import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import type { UpdateCustomerRequest } from "@/modules/customers/models/Customer";
import { type CustomerFormValues, customerSchema } from "@/modules/customers/schemes/CustomerScheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface CustomerFormProps {
    initialData?: UpdateCustomerRequest;
    onSubmit: (data: CustomerFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const CustomerForm = ({ initialData, onSubmit, onCancel, isLoading }: CustomerFormProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CustomerFormValues>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            firstLastname: "",
            secondLastname: "",
            email: "",
            phone: "",
            birthDate: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                firstLastname: initialData.firstLastname,
                secondLastname: initialData.secondLastname || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : "",
            });
        } else {
            reset({
                name: "",
                firstLastname: "",
                secondLastname: "",
                email: "",
                phone: "",
                birthDate: "",
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                placeholder="Name"
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
                        First Lastname *
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                type="email"
                                placeholder="Email (Optional)"
                                className={errors.email ? "border-red-500" : ""}
                            />
                        )}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Birth Date
                    </label>
                    <Controller
                        control={control}
                        name="birthDate"
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="date"
                                className={errors.birthDate ? "border-red-500" : ""}
                            />
                        )}
                    />
                    {errors.birthDate && (
                        <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                    )}
                </div>
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
