import api from '../lib/api';

export interface User {
    strUserGUID: string;
    strName: string;
    strEmailId: string;
    strMobileNo?: string;
    strRoleGUID?: string;
    strPreferredLanguage?: string;
    strTimeZone?: string;
    bolIsSuperAdmin: boolean;
    bolIsActive: boolean;
}

export interface LoginRequest {
    strEmailId: string;
    strPassword: string;
    bolIsForce?: boolean;
}

export interface AuthResponse {
    success: boolean;
    data: {
        token: string;
        refreshToken: string;
        user: User;
    };
    message: string;
}

export interface UpdateProfileRequest {
    strName?: string;
    strMobileNo?: string;
    strPreferredLanguage?: string;
    strTimeZone?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async logout(refreshToken: string): Promise<void> {
        await api.post('/auth/logout', { refreshToken });
    },

    async getProfile(): Promise<{ success: boolean; data: User }> {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    async updateProfile(data: UpdateProfileRequest): Promise<{ success: boolean; data: User }> {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    async changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/auth/change-password', data);
        return response.data;
    },

    async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/auth/forgot-password', { strEmailId: email });
        return response.data;
    },

    async resetPassword(strToken: string, strNewPassword: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post('/auth/reset-password', { strToken, strNewPassword });
        return response.data;
    },
};
