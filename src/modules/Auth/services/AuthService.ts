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
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
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
    private accessTokenExpiresAt: string | null = null; // New
    private refreshTokenExpiresAt: string | null = null; // New
    private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;
    private isRefreshing: boolean = false; // Prevent concurrent refresh calls

    private constructor() {
        this.refreshToken = localStorage.getItem('refreshToken');
        this.accessTokenExpiresAt = localStorage.getItem('accessTokenExpiresAt'); // New
        this.refreshTokenExpiresAt = localStorage.getItem('refreshTokenExpiresAt'); // New
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

        const { accessToken, refreshToken, expiresIn, accessTokenExpiresAt, refreshTokenExpiresAt, user } = response.data;

        this.setSession(accessToken, refreshToken, expiresIn, accessTokenExpiresAt, refreshTokenExpiresAt, user);

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

            const { accessToken, expiresIn, refreshToken: newRefreshToken, refreshTokenExpiresAt: newRefreshTokenExpiresAt } = response.data;
            
            this.accessToken = accessToken;
            this.refreshToken = newRefreshToken; // Update instance variable
            this.accessTokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString(); // Update access token expiration from expiresIn
            this.refreshTokenExpiresAt = newRefreshTokenExpiresAt; // Update refresh token expiration
            localStorage.setItem('refreshToken', newRefreshToken); // Store new refresh token
            localStorage.setItem('accessTokenExpiresAt', this.accessTokenExpiresAt); // Store new access token expiration
            localStorage.setItem('refreshTokenExpiresAt', newRefreshTokenExpiresAt); // Store new refresh token expiration

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

    private setSession(accessToken: string, refreshToken: string, expiresIn: number, accessTokenExpiresAt: string, refreshTokenExpiresAt: string, user: User) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accessTokenExpiresAt = accessTokenExpiresAt;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt);
        localStorage.setItem('refreshTokenExpiresAt', refreshTokenExpiresAt);
        localStorage.setItem('user', JSON.stringify(user));

        this.scheduleTokenRefresh(expiresIn);
    }

    private clearSession() {
        this.accessToken = null;
        this.refreshToken = null;
        this.accessTokenExpiresAt = null;
        this.refreshTokenExpiresAt = null;
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessTokenExpiresAt');
        localStorage.removeItem('refreshTokenExpiresAt');
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
        // Also check if the access token has expired based on accessTokenExpiresAt
        if (this.accessToken && this.accessTokenExpiresAt) {
            const now = new Date();
            const expiration = new Date(this.accessTokenExpiresAt);
            if (now < expiration) {
                return this.accessToken;
            }
        }
        return null;
    }
    
    // Sometimes we need to restore access from refresh token on page load
    // This is tricky without exposing access token to storage.
    // Usually we try to refresh immediately if we have a refresh token but no access token.
    async tryAutoLogin(): Promise<boolean> {
        
        if (this.getAccessToken()) { // Use getAccessToken to check expiration
            return true;
        }
        
        const refreshToken = this.refreshToken || localStorage.getItem('refreshToken');
        const refreshTokenExpiresAt = this.refreshTokenExpiresAt || localStorage.getItem('refreshTokenExpiresAt');

        if (!refreshToken || !refreshTokenExpiresAt) {
            return false;
        }

        // Check if refresh token itself has expired
        const now = new Date();
        const refreshExpiration = new Date(refreshTokenExpiresAt);
        if (now >= refreshExpiration) {
            console.warn('Refresh token has expired. Logging out.');
            this.clearSession();
            return false;
        }

        // Ensure this.refreshToken is set from localStorage
        this.refreshToken = refreshToken;
        this.refreshTokenExpiresAt = refreshTokenExpiresAt;

        try {
            const refreshResponse = await this.refreshAccessToken();
            // Update the stored tokens and expiration times
            this.accessToken = refreshResponse.accessToken;
            this.refreshToken = refreshResponse.refreshToken;
            this.accessTokenExpiresAt = new Date(Date.now() + refreshResponse.expiresIn * 1000).toISOString();
            this.refreshTokenExpiresAt = refreshResponse.refreshTokenExpiresAt;
            localStorage.setItem('accessTokenExpiresAt', this.accessTokenExpiresAt);
            localStorage.setItem('refreshTokenExpiresAt', this.refreshTokenExpiresAt);
            localStorage.setItem('refreshToken', refreshResponse.refreshToken); // Ensure refresh token is updated in local storage
            return true;
        } catch (error) {
            console.error('❌ Auto-login failed:', error);
            return false;
        }
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken(); // Use getAccessToken for authentication check
    }

     isTokenExpired(token: string): boolean {
        try {
            const decoded = jwtDecode<{ exp: number }>(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch {
            return true;
        }
    }

    /**
     * Solicitar código de recuperación de contraseña
     */
    async forgotPassword(email: string): Promise<void> {
        await axios.post(`${API_URL}/auth/forgot-password`, { email });
    }

    /**
     * Verificar código de recuperación
     * @returns verificationToken
     */
    async verifyCode(email: string, code: string): Promise<string> {
        const response = await axios.post(`${API_URL}/auth/verify-code`, { email, code });
        return response.data.data.verificationToken;
    }

    /**
     * Cambiar contraseña usando el token de verificación
     */
    async resetPassword(verificationToken: string, newPassword: string): Promise<void> {
        await axios.post(`${API_URL}/auth/reset-password`, {
            verificationToken,
            newPassword
        });
        
        // Al cambiar la contraseña, el backend revoca todas las sesiones.
        // Nos aseguramos de limpiar la sesión local por si acaso.
        this.clearSession();
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
