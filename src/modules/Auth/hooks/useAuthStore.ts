import { create } from 'zustand';
import { authService, type User } from '../services/AuthService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: true, // Keep true initially to show spinner while checking

    checkAuth: async () => {
        try {
            const success = await authService.tryAutoLogin();
            
            set({ 
                isAuthenticated: success, 
                user: authService.getCurrentUser(),
                isLoading: false 
            });
        } catch (error) {
            console.error('🔐 checkAuth error:', error);
            set({ 
                isAuthenticated: false, 
                user: null, 
                isLoading: false 
            });
        }
    },


    login: (user: User) => {
        set({ 
            isAuthenticated: true, 
            user: user 
        });
    },

    logout: () => {
        authService.logout();
        set({ 
            isAuthenticated: false, 
            user: null 
        });
    }
}));
