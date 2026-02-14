import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5079/api';

export interface UserRole {
    id: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    firstLastname: string;
    secondLastname: string | null;
    email: string;
    phone: string | null;
    role: UserRole;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

export interface RefreshTokenResponse {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}

class AuthService {
    private static instance: AuthService;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;
    private isRefreshing: boolean = false; // Prevent concurrent refresh calls

    private constructor() {
        this.refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');
        if (userStr) {
            // Restore session if possible? 
            // Actually, we usually don't persist access token in local storage for security (as per requirements).
            // But we can persist user info for UI.
        }
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Iniciar sesión
     */
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
            email,
            password
        });

        const { accessToken, refreshToken, expiresIn, user } = response.data;

        this.setSession(accessToken, refreshToken, expiresIn, user);

        return response.data;
    }

    /**
     * Renovar access token
     */
    async refreshAccessToken(): Promise<RefreshTokenResponse> {
        // Prevent concurrent refresh attempts
        if (this.isRefreshing) {
            throw new Error('Token refresh already in progress');
        }

        const refreshToken = this.refreshToken || localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        this.isRefreshing = true;

        try {
            const response = await axios.post<RefreshTokenResponse>(`${API_URL}/auth/refresh`, {
                refreshToken
            });

            const { accessToken, expiresIn } = response.data;
            
            this.accessToken = accessToken;
            this.scheduleTokenRefresh(expiresIn);
            
            return response.data; // Return the full response data
        } catch (error) {
            console.error('❌ Token refresh failed:', error);
            this.clearSession(); // Don't call logout to avoid another API call
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    /**
     * Cerrar sesión
     */
    async logout(): Promise<void> {
        const refreshToken = this.refreshToken || localStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                await axios.post(`${API_URL}/auth/logout`, { refreshToken });
            } catch (error) {
                console.warn('Logout error:', error);
            }
        }

        this.clearSession();
    }

    private setSession(accessToken: string, refreshToken: string, expiresIn: number, user: User) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        this.scheduleTokenRefresh(expiresIn);
    }

    private clearSession() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }

    /**
     * Programar renovación automática del token
     */
    private scheduleTokenRefresh(expiresIn: number): void {
        
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }

        // Renovar 5 minutos antes de que expire (300 segundos)
        // Si el token expira en menos de 5 minutos, renovar a la mitad del tiempo
        const bufferTime = Math.min(300, expiresIn / 2);
        const refreshTime = Math.max(1000, (expiresIn - bufferTime) * 1000);

        this.tokenExpirationTimer = setTimeout(async () => {
            try {
                await this.refreshAccessToken();
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        }, refreshTime);
    }

    getAccessToken(): string | null {
        return this.accessToken;
    }
    
    // Sometimes we need to restore access from refresh token on page load
    // This is tricky without exposing access token to storage.
    // Usually we try to refresh immediately if we have a refresh token but no access token.
    async tryAutoLogin(): Promise<boolean> {
        
        if (this.accessToken) {
            return true;
        }
        
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            return false;
        }

        // Ensure this.refreshToken is set from localStorage
        this.refreshToken = refreshToken;

        try {
            await this.refreshAccessToken();
            return true;
        } catch (error) {
            console.error('❌ Auto-login failed:', error);
            return false;
        }
    }

    isAuthenticated(): boolean {
        return !!this.accessToken && !this.isTokenExpired(this.accessToken);
    }

     isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch {
            return true;
        }
    }

    getUserRole(): string | null {
        const user = this.getCurrentUser();
        return user?.role.name || null;
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    hasRole(roleName: string): boolean {
        const userRole = this.getUserRole();
        return userRole === roleName;
    }

    isManagerOrAbove(): boolean {
        const role = this.getUserRole();
        return role === 'Administrador' || role === 'Gerente';
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'Administrador';
    }
}

export const authService = AuthService.getInstance();
