import * as signalR from '@microsoft/signalr';
import { useEffect, useState, useCallback, useRef } from 'react';
import { authService } from '@/modules/Auth/services/AuthService';
import type { ChatMessage } from '../models/Chat';

export const useChatSignalR = (onMessageReceived?: (message: ChatMessage) => void) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [connected, setConnected] = useState(false);
    const onMessageReceivedRef = useRef(onMessageReceived);

    useEffect(() => {
        onMessageReceivedRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        const token = authService.getAccessToken();
        if (!token) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/hubs/chat`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        newConnection.on('ReceiveMessage', (message: ChatMessage) => {
            if (onMessageReceivedRef.current) {
                onMessageReceivedRef.current(message);
            }
        });

        newConnection.start()
            .then(() => {
                setConnected(true);
                console.log('SignalR Connected');
            })
            .catch(err => console.error('SignalR Connection Error: ', err));

        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, []);

    const joinConversation = useCallback(async (conversationId: string) => {
        if (connection && connected) {
            await connection.invoke('JoinConversation', conversationId);
        }
    }, [connection, connected]);

    const leaveConversation = useCallback(async (conversationId: string) => {
        if (connection && connected) {
            await connection.invoke('LeaveConversation', conversationId);
        }
    }, [connection, connected]);

    return {
        connection,
        connected,
        joinConversation,
        leaveConversation
    };
};
