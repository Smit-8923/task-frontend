import React, { useEffect, useState } from 'react';
import { roleService, Role } from '@/services/role.service';
import { menuService, Menu } from '@/services/menu.service';
import { userRightsService, UserRight } from '@/services/userRights.service';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Key,
    Shield,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Save,
    ChevronDown,
    Eye,
    Edit,
    Trash,
    Printer,
    Download,
    Upload
} from 'lucide-react';
import Layout from '@/components/Layout';

const UserRightsPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [rights, setRights] = useState<UserRight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            fetchRights(selectedRole);
        } else {
            setRights([]);
        }
    }, [selectedRole]);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [rolesRes, menusRes] = await Promise.all([
                roleService.getAllRoles({ bolIsActive: 'true' }),
                menuService.getAllMenus()
            ]);

            if (rolesRes.success) {
                const rolesData = Array.isArray(rolesRes.data) ? rolesRes.data : [rolesRes.data];
                setRoles(rolesData);
                if (rolesData.length > 0) {
                    setSelectedRole(rolesData[0].strRoleGUID);
                }
            }

            if (menusRes.success) {
                setMenus(Array.isArray(menusRes.data) ? menusRes.data : [menusRes.data]);
            }
        } catch (err: any) {
            setError('Failed to load initial data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRights = async (roleId: string) => {
        setIsLoading(true);
        try {
            const response = await userRightsService.getRightsByRole(roleId);
            if (response.success) {
                const existingRights = Array.isArray(response.data) ? response.data : [response.data];

                // Merge with all menus to ensure every menu is represented
                const mergedRights = menus.map(menu => {
                    const existing = existingRights.find(r => r.strMenuGUID === menu.strMenuGUID);
                    return existing || {
                        strRoleGUID: roleId,
                        strMenuGUID: menu.strMenuGUID,
                        bolCanView: false,
                        bolCanEdit: false,
                        bolCanSave: false,
                        bolCanDelete: false,
                        bolCanPrint: false,
                        bolCanExport: false,
                        bolCanImport: false,
                        menu: {
                            strMenuName: menu.strMenuName,
                            strPath: menu.strPath || ''
                        }
                    };
                });

                setRights(mergedRights);
            }
        } catch (err: any) {
            setError('Failed to fetch rights for selected role');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = (menuId: string, field: keyof UserRight) => {
        setRights(prev => prev.map(right => {
            if (right.strMenuGUID === menuId) {
                return { ...right, [field]: !right[field] };
            }
            return right;
        }));
    };

    const handleSave = async () => {
        if (!selectedRole) return;
        setIsSaving(true);
        setError(null);
        try {
            const response = await userRightsService.bulkUpdateRights(selectedRole, rights);
            if (response.success) {
                setSuccess('Permissions updated successfully');
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save permissions');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Rights & Permissions</h2>
                        <p className="text-sm text-slate-500">Define what each role can see and do across the application.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !selectedRole}
                        className="rounded-xl shadow-lg shadow-primary/20 min-w-[140px]"
                    >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={18} className="mr-2" />}
                        Save Changes
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

                <Card className="border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Select Role</Label>
                                <div className="relative max-w-xs">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                                    >
                                        <option value="">Select a role...</option>
                                        {roles.map(role => (
                                            <option key={role.strRoleGUID} value={role.strRoleGUID}>{role.strRoleName}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Permissions are role-based</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span>Auto-saves on bulk update</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 text-[10px] uppercase tracking-widest">
                                        <th className="px-6 py-4 font-bold min-w-[200px]">Module / Menu</th>
                                        <th className="px-4 py-4 font-bold text-center">View</th>
                                        <th className="px-4 py-4 font-bold text-center">Edit</th>
                                        <th className="px-4 py-4 font-bold text-center">Save</th>
                                        <th className="px-4 py-4 font-bold text-center">Delete</th>
                                        <th className="px-4 py-4 font-bold text-center">Print</th>
                                        <th className="px-4 py-4 font-bold text-center">Export</th>
                                        <th className="px-4 py-4 font-bold text-center">Import</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-20 text-center">
                                                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                                                <p className="mt-4 text-sm text-slate-500">Loading permissions matrix...</p>
                                            </td>
                                        </tr>
                                    ) : !selectedRole ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-20 text-center">
                                                <Key className="h-16 w-16 mx-auto text-slate-200 mb-4" />
                                                <h3 className="text-lg font-bold text-slate-400">No Role Selected</h3>
                                                <p className="text-sm text-slate-400">Please select a role from the dropdown above to manage its rights.</p>
                                            </td>
                                        </tr>
                                    ) : rights.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-20 text-center">
                                                <AlertCircle className="h-12 w-12 mx-auto text-slate-200 mb-2" />
                                                <p className="text-slate-500">No menus configured. Please add menus first.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        rights.map((right) => (
                                            <tr key={right.strMenuGUID} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 dark:text-white">{right.menu?.strMenuName}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono">{right.menu?.strPath}</span>
                                                    </div>
                                                </td>
                                                <PermissionCell
                                                    active={right.bolCanView}
                                                    icon={Eye}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanView')}
                                                />
                                                <PermissionCell
                                                    active={right.bolCanEdit}
                                                    icon={Edit}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanEdit')}
                                                />
                                                <PermissionCell
                                                    active={right.bolCanSave}
                                                    icon={Save}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanSave')}
                                                />
                                                <PermissionCell
                                                    active={right.bolCanDelete}
                                                    icon={Trash}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanDelete')}
                                                />
                                                <PermissionCell
                                                    active={right.bolCanPrint}
                                                    icon={Printer}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanPrint')}
                                                />
                                                <PermissionCell
                                                    active={right.bolCanExport}
                                                    icon={Download}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanExport')}
                                                />
                                                <PermissionCell
                                                    active={right.bolCanImport}
                                                    icon={Upload}
                                                    onClick={() => handleToggle(right.strMenuGUID, 'bolCanImport')}
                                                />
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

interface PermissionCellProps {
    active: boolean;
    icon: any;
    onClick: () => void;
}

const PermissionCell: React.FC<PermissionCellProps> = ({ active, icon: Icon, onClick }) => {
    return (
        <td className="px-4 py-4 text-center">
            <button
                onClick={onClick}
                className={`
                    h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 mx-auto
                    ${active
                        ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }
                `}
            >
                <Icon size={16} />
            </button>
        </td>
    );
};

export default UserRightsPage;
