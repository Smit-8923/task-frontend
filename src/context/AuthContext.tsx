import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService, LoginRequest } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    // Optionally verify token with profile call
                    const profile = await authService.getProfile();
                    if (profile.success) {
                        setUser(profile.data);
                        localStorage.setItem('user', JSON.stringify(profile.data));
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const response = await authService.login(data);
            if (response.success) {
                const { token, refreshToken, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                return;
            }
        } catch (err: any) {
            const status = err?.response?.status;
            const hasActiveSession = err?.response?.data?.data?.hasActiveSession;
            if (status === 409 && hasActiveSession) {
                const confirmForce = window.confirm(
                    'Active session(s) exist for this account. Do you want to force login and sign out previous sessions?'
                );
                if (confirmForce) {
                    const forceResp = await authService.login({ ...data, bolIsForce: true });
                    if (forceResp.success) {
                        const { token, refreshToken, user } = forceResp.data;
                        localStorage.setItem('token', token);
                        localStorage.setItem('refreshToken', refreshToken);
                        localStorage.setItem('user', JSON.stringify(user));
                        setUser(user);
                        return;
                    }
                }
            }
            throw err;
        }
    };



    const logout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await authService.logout(refreshToken);
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
