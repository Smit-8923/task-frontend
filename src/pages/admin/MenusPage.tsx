import React, { useEffect, useState } from 'react';
import { menuService, Menu } from '@/services/menu.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Menu as MenuIcon,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Layout,
    Link as LinkIcon,
    Hash
} from 'lucide-react';
import LayoutComponent from '@/components/Layout';

const MenusPage: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [formData, setFormData] = useState({
        strMenuName: '',
        strMenuType: 'Main',
        dblSeqNo: 0,
        strPath: '',
        strMapKey: ''
    });

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        setIsLoading(true);
        try {
            const response = await menuService.getAllMenus();
            if (response.success) {
                setMenus(Array.isArray(response.data) ? response.data : [response.data]);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch menus');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (menu?: Menu) => {
        if (menu) {
            setEditingMenu(menu);
            setFormData({
                strMenuName: menu.strMenuName,
                strMenuType: menu.strMenuType || 'Main',
                dblSeqNo: menu.dblSeqNo || 0,
                strPath: menu.strPath || '',
                strMapKey: menu.strMapKey || ''
            });
        } else {
            setEditingMenu(null);
            setFormData({
                strMenuName: '',
                strMenuType: 'Main',
                dblSeqNo: menus.length + 1,
                strPath: '',
                strMapKey: ''
            });
        }
        setIsFormOpen(true);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            let response;
            if (editingMenu) {
                response = await menuService.updateMenu(editingMenu.strMenuGUID, formData);
            } else {
                response = await menuService.createMenu(formData);
            }

            if (response.success) {
                setSuccess(editingMenu ? 'Menu updated successfully' : 'Menu created successfully');
                setIsFormOpen(false);
                fetchMenus();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save menu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this menu?')) return;
        try {
            const response = await menuService.deleteMenu(id);
            if (response.success) {
                setSuccess('Menu deleted successfully');
                fetchMenus();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete menu');
        }
    };

    const filteredMenus = menus.filter(menu =>
        menu.strMenuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.strPath?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (a.dblSeqNo || 0) - (b.dblSeqNo || 0));

    return (
        <LayoutComponent>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Menu Management</h2>
                        <p className="text-sm text-slate-500">Configure application navigation and menu structure.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} className="rounded-xl shadow-lg shadow-primary/20">
                        <Plus size={18} className="mr-2" />
                        Add New Menu
                    </Button>
                </div>

                {success && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-100 dark:border-green-900/30 animate-fade-in">
                        <CheckCircle2 size={18} />
                        <p className="text-sm font-medium">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 animate-fade-in">
                        <AlertCircle size={18} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Menus List */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="pb-0 pt-6 px-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search menus..."
                                        className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 mt-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-bold">Seq</th>
                                                <th className="px-6 py-4 font-bold">Menu Name</th>
                                                <th className="px-6 py-4 font-bold">Path</th>
                                                <th className="px-6 py-4 font-bold">Type</th>
                                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {isLoading ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center">
                                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                                        <p className="mt-2 text-sm text-slate-500">Loading menus...</p>
                                                    </td>
                                                </tr>
                                            ) : filteredMenus.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center">
                                                        <MenuIcon className="h-12 w-12 mx-auto text-slate-200 mb-2" />
                                                        <p className="text-slate-500">No menus found.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredMenus.map((menu) => (
                                                    <tr key={menu.strMenuGUID} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <span className="text-xs font-bold text-slate-400">#{menu.dblSeqNo}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                                    <Layout size={16} />
                                                                </div>
                                                                <span className="font-bold text-slate-900 dark:text-white">{menu.strMenuName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                                                <LinkIcon size={12} />
                                                                <span>{menu.strPath || '--'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                                {menu.strMenuType || 'Main'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                                    onClick={() => handleOpenForm(menu)}
                                                                >
                                                                    <Edit2 size={14} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                                                    onClick={() => handleDelete(menu.strMenuGUID)}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Sidebar */}
                    <div className="space-y-6">
                        {isFormOpen ? (
                            <Card className="border-none shadow-lg animate-fade-in sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        {editingMenu ? <Edit2 size={18} className="text-primary" /> : <Plus size={18} className="text-primary" />}
                                        {editingMenu ? 'Edit Menu' : 'Create New Menu'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="strMenuName">Menu Name</Label>
                                            <Input
                                                id="strMenuName"
                                                value={formData.strMenuName}
                                                onChange={(e) => setFormData({ ...formData, strMenuName: e.target.value })}
                                                placeholder="e.g. Dashboard, Users"
                                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="strMenuType">Type</Label>
                                                <Input
                                                    id="strMenuType"
                                                    value={formData.strMenuType}
                                                    onChange={(e) => setFormData({ ...formData, strMenuType: e.target.value })}
                                                    placeholder="Main"
                                                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dblSeqNo">Sequence</Label>
                                                <Input
                                                    id="dblSeqNo"
                                                    type="number"
                                                    value={formData.dblSeqNo}
                                                    onChange={(e) => setFormData({ ...formData, dblSeqNo: parseFloat(e.target.value) })}
                                                    className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="strPath">Path</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="strPath"
                                                    value={formData.strPath}
                                                    onChange={(e) => setFormData({ ...formData, strPath: e.target.value })}
                                                    placeholder="/dashboard"
                                                    className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="strMapKey">Map Key (Optional)</Label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="strMapKey"
                                                    value={formData.strMapKey}
                                                    onChange={(e) => setFormData({ ...formData, strMapKey: e.target.value })}
                                                    placeholder="DASHBOARD_KEY"
                                                    className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 rounded-xl h-11"
                                                onClick={() => setIsFormOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="flex-1 rounded-xl h-11 shadow-lg shadow-primary/20"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingMenu ? 'Update' : 'Create')}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                                <CardContent className="p-8 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                                        <MenuIcon size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Menu Management</h3>
                                    <p className="text-sm text-slate-500 mb-6">Manage your application's navigation structure and sequence.</p>
                                    <Button onClick={() => handleOpenForm()} variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold">
                                        Add Menu
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </LayoutComponent>
    );
};

export default MenusPage;
