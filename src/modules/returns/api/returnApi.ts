import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { Return, CreateReturnRequest, ReturnStatus } from "../models/Return";

const endpoints = {
    getAll: "Return",
    getById: (id: string) => `Return/${id}`,
    getByStatus: (status: ReturnStatus) => `Return/status/${status}`,
    create: "Return",
    approve: (id: string) => `Return/${id}/approve`,
    reject: (id: string) => `Return/${id}/reject`,
};

export const useReturnApi = () => {
    const { get, post } = useHttpClient();

    const getAllReturns = useCallback(async () => {
        return await get<Return[]>(endpoints.getAll);
    }, [get]);

    const getReturnById = useCallback(async (id: string) => {
        return await get<Return>(endpoints.getById(id));
    }, [get]);

    const getReturnsByStatus = useCallback(async (status: ReturnStatus) => {
        return await get<Return[]>(endpoints.getByStatus(status));
    }, [get]);

    const createReturn = useCallback(async (data: CreateReturnRequest) => {
        return await post<CreateReturnRequest, Return>(endpoints.create, data);
    }, [post]);

    const approveReturn = useCallback(async (id: string, userId: string) => {
        return await post<{ approvedByUserId: string }, Return>(
            endpoints.approve(id),
            { approvedByUserId: userId }
        );
    }, [post]);

    const rejectReturn = useCallback(async (id: string, userId: string, reason: string) => {
        return await post<{ rejectedByUserId: string; rejectionReason: string }, Return>(
            endpoints.reject(id),
            { rejectedByUserId: userId, rejectionReason: reason }
        );
    }, [post]);

    return {
        getAllReturns,
        getReturnById,
        getReturnsByStatus,
        createReturn,
        approveReturn,
        rejectReturn,
    };
};
