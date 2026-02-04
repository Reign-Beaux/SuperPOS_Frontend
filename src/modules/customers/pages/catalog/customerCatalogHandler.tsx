import { useCustomerApi } from "@/modules/customers/api/customerApi";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "@/modules/customers/models/Customer";
import type { CustomerFormValues } from "@/modules/customers/schemes/CustomerScheme";
import { useEffect, useState } from "react";

export const useCustomerCatalogHandler = () => {
    const { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomerApi();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

    const loadCustomers = async () => {
        setIsLoading(true);
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            if (error instanceof Error && error.message === "Request cancelled") return;
            console.error("Failed to load customers", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedCustomer(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsSheetOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setCustomerToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!customerToDelete) return;

        try {
            await deleteCustomer(customerToDelete);
            await loadCustomers();
            setIsDeleteConfirmOpen(false);
            setCustomerToDelete(null);
        } catch (error) {
            console.error("Failed to delete customer", error);
        }
    };

    const handleSubmit = async (values: CustomerFormValues) => {
        setIsLoading(true);
        try {
            if (selectedCustomer) {
                const updateRequest: UpdateCustomerRequest = {
                    id: selectedCustomer.id,
                    name: values.name,
                    firstLastname: values.firstLastname,
                    secondLastname: values.secondLastname,
                    email: values.email,
                    phone: values.phone,
                    birthDate: values.birthDate ? new Date(values.birthDate).toISOString() : undefined
                };
                await updateCustomer(updateRequest);
            } else {
                const createRequest: CreateCustomerRequest = {
                    name: values.name,
                    firstLastname: values.firstLastname,
                    secondLastname: values.secondLastname,
                    email: values.email,
                    phone: values.phone,
                    birthDate: values.birthDate ? new Date(values.birthDate).toISOString() : undefined
                };
                await createCustomer(createRequest);
            }
            setIsSheetOpen(false);
            await loadCustomers();
        } catch (error) {
            console.error("Failed to save customer", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    return {
        customers,
        isLoading,
        isSheetOpen,
        selectedCustomer,
        isDeleteConfirmOpen,
        setIsSheetOpen,
        setIsDeleteConfirmOpen,
        handleCreate,
        handleEdit,
        handleDeleteClick,
        handleConfirmDelete,
        handleSubmit
    };
};
