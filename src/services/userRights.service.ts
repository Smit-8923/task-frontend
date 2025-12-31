import api from '../lib/api';

export interface UserRight {
    strUserRightsGUID?: string;
    strRoleGUID: string;
    strMenuGUID: string;
    bolCanView: boolean;
    bolCanEdit: boolean;
    bolCanSave: boolean;
    bolCanDelete: boolean;
    bolCanPrint: boolean;
    bolCanExport: boolean;
    bolCanImport: boolean;
    menu?: {
        strMenuName: string;
        strPath: string;
    };
}

export interface UserRightsResponse {
    success: boolean;
    data: UserRight | UserRight[];
    message: string;
}

export const userRightsService = {
    async getRightsByRole(roleId: string): Promise<UserRightsResponse> {
        const response = await api.get<UserRightsResponse>(`/user-rights/role/${roleId}`);
        return response.data;
    },

    async upsertUserRight(data: UserRight): Promise<UserRightsResponse> {
        const response = await api.post<UserRightsResponse>('/user-rights', data);
        return response.data;
    },

    async bulkUpdateRights(strRoleGUID: string, rights: Partial<UserRight>[]): Promise<UserRightsResponse> {
        const response = await api.post<UserRightsResponse>('/user-rights/bulk', { strRoleGUID, rights });
        return response.data;
    },

    async checkPermission(data: { strRoleGUID: string; strMenuGUID: string; permissionType: string }): Promise<{ success: boolean; data: boolean }> {
        const response = await api.post('/user-rights/check', data);
        return response.data;
    },
};
