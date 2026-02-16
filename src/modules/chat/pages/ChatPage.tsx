import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/widgets/PageHeader";
import { MessageSquare, Send, User } from "lucide-react";
import { Card, CardContent } from "@/components/elements/card";
import { Input } from "@/components/elements/input";
import { Button } from "@/components/elements/button";
import { useChatApi } from "../api/chatApi";
import { useChatSignalR } from "../hooks/useChatSignalR";
import { useAuthStore } from "@/modules/Auth/hooks/useAuthStore";
import type { Conversation, ChatMessage } from "../models/Chat";
import { cn } from "@/config/material/utils";

export const ChatPage = () => {
    const { user: currentUser } = useAuthStore();
    const { getConversations, getMessages, sendMessage, markAsRead } = useChatApi();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { joinConversation, leaveConversation } = useChatSignalR((message) => {
        if (selectedConversation && message.conversationId === selectedConversation.id) {
            setMessages(prev => [...prev, message]);
            markAsRead(message.id);
        }
        
        // Update last message in conversations list
        setConversations(prev => prev.map(conv => 
            conv.id === message.conversationId 
                ? { ...conv, lastMessage: message.message, lastMessageAt: message.sentAt }
                : conv
        ));
    });

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
            joinConversation(selectedConversation.id);
            return () => {
                leaveConversation(selectedConversation.id);
            };
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Error loading conversations", error);
        }
    };

    const loadMessages = async (id: string) => {
        try {
            const data = await getMessages(id);
            setMessages(data.items.reverse());
        } catch (error) {
            console.error("Error loading messages", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !currentUser) return;

        try {
            await sendMessage({
                senderId: currentUser.id,
                recipientId: selectedConversation.otherUserId,
                message: newMessage.trim()
            });
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            <div className="p-4 border-b">
                <PageHeader 
                    title="Mensajería" 
                    subtitle="Comunícate en tiempo real con otros miembros del equipo."
                    icon={MessageSquare}
                />
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Conversations List */}
                <div className="w-80 border-r bg-muted/10 overflow-y-auto">
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={cn(
                                "p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                                selectedConversation?.id === conv.id && "bg-muted"
                            )}
                            onClick={() => setSelectedConversation(conv)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold truncate">{conv.otherUserName}</h4>
                                        {conv.unreadCount > 0 && (
                                            <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                                                {conv.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "Sin mensajes"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-card">
                    {selectedConversation ? (
                        <>
                            <div className="p-4 border-b flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{selectedConversation.otherUserName}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedConversation.otherUserRole}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[70%] rounded-lg p-3",
                                            msg.senderId === currentUser?.id
                                                ? "bg-primary text-primary-foreground ml-auto rounded-br-none"
                                                : "bg-muted text-muted-foreground mr-auto rounded-bl-none"
                                        )}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                        <span className="text-[10px] mt-1 opacity-70 text-right">
                                            {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                            <p>Selecciona una conversación para comenzar a chatear.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
