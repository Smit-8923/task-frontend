import React, { useEffect, useState } from 'react';
import { roleService, Role } from '@/services/role.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Shield,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import Layout from '@/components/Layout';

const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        strRoleName: '',
        bolIsActive: true
    });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const response = await roleService.getAllRoles();
            if (response.success) {
                setRoles(Array.isArray(response.data) ? response.data : [response.data]);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch roles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenForm = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                strRoleName: role.strRoleName,
                bolIsActive: role.bolIsActive
            });
        } else {
            setEditingRole(null);
            setFormData({
                strRoleName: '',
                bolIsActive: true
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
            if (editingRole) {
                response = await roleService.updateRole(editingRole.strRoleGUID, formData);
            } else {
                response = await roleService.createRole(formData);
            }

            if (response.success) {
                setSuccess(editingRole ? 'Role updated successfully' : 'Role created successfully');
                setIsFormOpen(false);
                fetchRoles();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save role');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this role?')) return;
        try {
            const response = await roleService.deleteRole(id);
            if (response.success) {
                setSuccess('Role deleted successfully');
                fetchRoles();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete role');
        }
    };

    const filteredRoles = roles.filter(role =>
        role.strRoleName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Role Management</h2>
                        <p className="text-sm text-slate-500">Create and manage user roles and their status.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} className="rounded-xl shadow-lg shadow-primary/20">
                        <Plus size={18} className="mr-2" />
                        Add New Role
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
                    {/* Roles List */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="pb-0 pt-6 px-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search roles..."
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
                                                <th className="px-6 py-4 font-bold">Role Name</th>
                                                <th className="px-6 py-4 font-bold">Status</th>
                                                <th className="px-6 py-4 font-bold">Created On</th>
                                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {isLoading ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center">
                                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                                        <p className="mt-2 text-sm text-slate-500">Loading roles...</p>
                                                    </td>
                                                </tr>
                                            ) : filteredRoles.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center">
                                                        <Shield className="h-12 w-12 mx-auto text-slate-200 mb-2" />
                                                        <p className="text-slate-500">No roles found.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredRoles.map((role) => (
                                                    <tr key={role.strRoleGUID} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                                    <Shield size={16} />
                                                                </div>
                                                                <span className="font-bold text-slate-900 dark:text-white">{role.strRoleName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${role.bolIsActive
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                                }`}>
                                                                {role.bolIsActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {new Date(role.dtCreatedOn).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                                                    onClick={() => handleOpenForm(role)}
                                                                >
                                                                    <Edit2 size={14} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                                                    onClick={() => handleDelete(role.strRoleGUID)}
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
                                        {editingRole ? <Edit2 size={18} className="text-primary" /> : <Plus size={18} className="text-primary" />}
                                        {editingRole ? 'Edit Role' : 'Create New Role'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="strRoleName">Role Name</Label>
                                            <Input
                                                id="strRoleName"
                                                value={formData.strRoleName}
                                                onChange={(e) => setFormData({ ...formData, strRoleName: e.target.value })}
                                                placeholder="e.g. Manager, Editor"
                                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-bold">Active Status</Label>
                                                <p className="text-xs text-slate-500">Enable or disable this role</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.bolIsActive}
                                                onChange={(e) => setFormData({ ...formData, bolIsActive: e.target.checked })}
                                                className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
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
                                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingRole ? 'Update' : 'Create')}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                                <CardContent className="p-8 text-center">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                                        <Shield size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Role Management</h3>
                                    <p className="text-sm text-slate-500 mb-6">Select a role to edit or create a new one to define access levels for your users.</p>
                                    <Button onClick={() => handleOpenForm()} variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-bold">
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RolesPage;
