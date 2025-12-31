import api from '../lib/api';

export interface Role {
    strRoleGUID: string;
    strRoleName: string;
    bolIsActive: boolean;
    dtCreatedOn: string;
    dtUpdatedOn: string;
}

export interface CreateRoleRequest {
    strRoleName: string;
    bolIsActive?: boolean;
}

export interface RoleResponse {
    success: boolean;
    data: Role | Role[];
    message: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const roleService = {
    async getAllRoles(params?: any): Promise<RoleResponse> {
        const response = await api.get<RoleResponse>('/roles', { params });
        return response.data;
    },

    async getRoleById(id: string): Promise<RoleResponse> {
        const response = await api.get<RoleResponse>(`/roles/${id}`);
        return response.data;
    },

    async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
        const response = await api.post<RoleResponse>('/roles', data);
        return response.data;
    },

    async updateRole(id: string, data: Partial<CreateRoleRequest>): Promise<RoleResponse> {
        const response = await api.put<RoleResponse>(`/roles/${id}`, data);
        return response.data;
    },

    async deleteRole(id: string): Promise<RoleResponse> {
        const response = await api.delete<RoleResponse>(`/roles/${id}`);
        return response.data;
    },

    async restoreRole(id: string): Promise<RoleResponse> {
        const response = await api.patch<RoleResponse>(`/roles/${id}/restore`);
        return response.data;
    },
};
