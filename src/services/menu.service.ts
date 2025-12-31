import api from '../lib/api';

export interface Menu {
    strMenuGUID: string;
    strMenuName: string;
    strMenuType?: string;
    dblSeqNo?: number;
    strPath?: string;
    strMapKey?: string;
    dtCreatedOn: string;
    dtUpdatedOn: string;
}

export interface CreateMenuRequest {
    strMenuName: string;
    strMenuType?: string;
    dblSeqNo?: number;
    strPath?: string;
    strMapKey?: string;
}

export interface MenuResponse {
    success: boolean;
    data: Menu | Menu[];
    message: string;
}

export const menuService = {
    async getAllMenus(params?: any): Promise<MenuResponse> {
        const response = await api.get<MenuResponse>('/menus', { params });
        return response.data;
    },

    async getMenusByType(type: string): Promise<MenuResponse> {
        const response = await api.get<MenuResponse>(`/menus/type/${type}`);
        return response.data;
    },

    async getMenuById(id: string): Promise<MenuResponse> {
        const response = await api.get<MenuResponse>(`/menus/${id}`);
        return response.data;
    },

    async createMenu(data: CreateMenuRequest): Promise<MenuResponse> {
        const response = await api.post<MenuResponse>('/menus', data);
        return response.data;
    },

    async updateMenu(id: string, data: Partial<CreateMenuRequest>): Promise<MenuResponse> {
        const response = await api.put<MenuResponse>(`/menus/${id}`, data);
        return response.data;
    },

    async deleteMenu(id: string): Promise<MenuResponse> {
        const response = await api.delete<MenuResponse>(`/menus/${id}`);
        return response.data;
    },

    async reorderMenus(menuOrders: { strMenuGUID: string; dblSeqNo: number }[]): Promise<MenuResponse> {
        const response = await api.post<MenuResponse>('/menus/reorder', { menuOrders });
        return response.data;
    },
};
