export interface Conversation {
    id: string;
    otherUserId: string;
    otherUserName: string;
    otherUserRole: string;
    lastMessage: string | null;
    lastMessageAt: string | null;
    unreadCount: number;
    createdAt: string;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    message: string;
    sentAt: string;
    isRead: boolean;
    readAt: string | null;
}

export interface SendMessageRequest {
    senderId: string;
    recipientId: string;
    message: string;
}

export interface PagedMessagesResponse {
    items: ChatMessage[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
}
