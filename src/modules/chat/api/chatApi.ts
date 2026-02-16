import { useHttpClient } from "@/config/httpClient";
import { useCallback } from "react";
import type { 
    Conversation, 
    ChatMessage, 
    SendMessageRequest, 
    PagedMessagesResponse 
} from "../models/Chat";

const endpoints = {
    conversations: "Chat/conversations",
    conversationById: (id: string) => `Chat/conversations/${id}`,
    messages: (conversationId: string, pageIndex: number = 1, pageSize: number = 50) => 
        `Chat/conversations/${conversationId}/messages?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    sendMessage: "Chat/messages",
    markAsRead: (id: string) => `Chat/messages/${id}/read`,
};

export const useChatApi = () => {
    const { get, post, put } = useHttpClient();

    const getConversations = useCallback(async () => {
        return await get<Conversation[]>(endpoints.conversations);
    }, [get]);

    const getConversationById = useCallback(async (id: string) => {
        return await get<Conversation>(endpoints.conversationById(id));
    }, [get]);

    const getMessages = useCallback(async (conversationId: string, pageIndex?: number, pageSize?: number) => {
        return await get<PagedMessagesResponse>(endpoints.messages(conversationId, pageIndex, pageSize));
    }, [get]);

    const sendMessage = useCallback(async (request: SendMessageRequest) => {
        return await post<SendMessageRequest, ChatMessage>(endpoints.sendMessage, request);
    }, [post]);

    const markAsRead = useCallback(async (messageId: string) => {
        return await put<null, ChatMessage>(endpoints.markAsRead(messageId), null);
    }, [put]);

    return {
        getConversations,
        getConversationById,
        getMessages,
        sendMessage,
        markAsRead,
    };
};
