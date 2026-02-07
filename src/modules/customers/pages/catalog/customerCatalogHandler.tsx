import { useCustomerApi } from "@/modules/customers/api/customerApi";
import type { CreateCustomerRequest, Customer, UpdateCustomerRequest } from "@/modules/customers/models/Customer";
import type { CustomerFormValues } from "@/modules/customers/schemes/CustomerScheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const CUSTOMERS_QUERY_KEY = ['customers'];

export const useCustomerCatalogHandler = () => {
    const queryClient = useQueryClient();
    const { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } = useCustomerApi();

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

    // Query for fetching all customers
    const {
        data: customers = [],
        isLoading
    } = useQuery({
        queryKey: CUSTOMERS_QUERY_KEY,
        queryFn: getAllCustomers,
    });

    // Mutation for creating customers
    const createMutation = useMutation({
        mutationFn: createCustomer,
        onSuccess: (newCustomer) => {
            queryClient.setQueryData<Customer[]>(CUSTOMERS_QUERY_KEY, (old = []) => [...old, newCustomer]);
        },
    });

    // Mutation for updating customers
    const updateMutation = useMutation({
        mutationFn: updateCustomer,
        onSuccess: (_, variables) => {
            queryClient.setQueryData<Customer[]>(CUSTOMERS_QUERY_KEY, (old = []) =>
                old.map(c => c.id === variables.id ? { ...c, ...variables } : c)
            );
        },
    });

    // Mutation for deleting customers
    const deleteMutation = useMutation({
        mutationFn: deleteCustomer,
        onMutate: async (customerId) => {
            await queryClient.cancelQueries({ queryKey: CUSTOMERS_QUERY_KEY });
            const previousCustomers = queryClient.getQueryData<Customer[]>(CUSTOMERS_QUERY_KEY);
            queryClient.setQueryData<Customer[]>(CUSTOMERS_QUERY_KEY, (old = []) =>
                old.filter(c => c.id !== customerId)
            );
            return { previousCustomers };
        },
        onError: (_err, _customerId, context) => {
            if (context?.previousCustomers) {
                queryClient.setQueryData(CUSTOMERS_QUERY_KEY, context.previousCustomers);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
        },
    });

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

        setIsDeleteConfirmOpen(false);
        const deletedId = customerToDelete;
        setCustomerToDelete(null);

        try {
            await deleteMutation.mutateAsync(deletedId);
        } catch (error) {
            console.error("Failed to delete customer", error);
        }
    };

    const handleSubmit = async (values: CustomerFormValues) => {
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
                await updateMutation.mutateAsync(updateRequest);
            } else {
                const createRequest: CreateCustomerRequest = {
                    name: values.name,
                    firstLastname: values.firstLastname,
                    secondLastname: values.secondLastname,
                    email: values.email,
                    phone: values.phone,
                    birthDate: values.birthDate ? new Date(values.birthDate).toISOString() : undefined
                };
                await createMutation.mutateAsync(createRequest);
            }
            setIsSheetOpen(false);
        } catch (error) {
            console.error("Failed to save customer", error);
        }
    };

    return {
        customers,
        isLoading: isLoading || createMutation.isPending || updateMutation.isPending,
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
