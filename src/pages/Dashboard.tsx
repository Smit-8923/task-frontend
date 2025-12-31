import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    User,
    LogOut,
    LayoutDashboard,
    Settings,
    Bell,
    Menu,
    X,
    Mail,
    Phone,
    Globe,
    Shield,
    Loader2,
    CheckCircle2,
    Users,
    Key,
    Lock,
    Search,
    Plus,
    MoreVertical,
    TrendingUp,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { authService } from '@/services/auth.service';

const Dashboard: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        strName: user?.strName || '',
        strMobileNo: user?.strMobileNo || '',
        strPreferredLanguage: user?.strPreferredLanguage || 'English',
        strTimeZone: user?.strTimeZone || 'UTC',
    });

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleLogout = async () => {
        await logout();
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateSuccess(false);
        try {
            const response = await authService.updateProfile(formData);
            if (response.success) {
                updateUser(response.data);
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        setIsChangingPassword(true);
        setPasswordError(null);
        setPasswordSuccess(false);
        try {
            const response = await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                setPasswordSuccess(true);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setPasswordSuccess(false), 3000);
            } else {
                setPasswordError(response.message || 'Failed to change password');
            }
        } catch (error: any) {
            setPasswordError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const stats = [
        { label: 'Total Tasks', value: '24', icon: LayoutDashboard, color: 'bg-blue-500' },
        { label: 'Completed', value: '18', icon: CheckCircle2, color: 'bg-green-500' },
        { label: 'In Progress', value: '6', icon: TrendingUp, color: 'bg-amber-500' },
    ];

    const recentActivity = [
        { id: 1, action: 'Updated profile', time: '2 hours ago', icon: User, color: 'text-blue-500' },
        { id: 2, action: 'Changed password', time: 'Yesterday', icon: Lock, color: 'text-amber-500' },
        { id: 3, action: 'Logged in from new device', time: '3 days ago', icon: Shield, color: 'text-green-500' },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between px-6 py-8">
                        <div className="flex items-center gap-3 font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <LayoutDashboard size={24} />
                            </div>
                            <span>TaskFlow</span>
                        </div>
                        <button className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-4 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto custom-scrollbar">
                        <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>

                        <NavItem
                            icon={User}
                            label="Profile"
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />

                        {user?.bolIsSuperAdmin && (
                            <>
                                <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-6 mb-2">Administration</p>
                                <NavItem
                                    icon={Users}
                                    label="User Management"
                                    active={activeTab === 'users'}
                                    onClick={() => setActiveTab('users')}
                                />
                                <NavItem
                                    icon={Shield}
                                    label="Role Management"
                                    active={activeTab === 'roles'}
                                    onClick={() => setActiveTab('roles')}
                                />
                                <NavItem
                                    icon={Key}
                                    label="Permissions"
                                    active={activeTab === 'permissions'}
                                    onClick={() => setActiveTab('permissions')}
                                />
                            </>
                        )}

                        <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-6 mb-2">Support</p>
                        <NavItem
                            icon={Settings}
                            label="Settings"
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                        />
                        <NavItem
                            icon={Bell}
                            label="Notifications"
                            active={activeTab === 'notifications'}
                            onClick={() => setActiveTab('notifications')}
                        />
                    </nav>

                    <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 mb-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user?.strName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.strName}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.strEmailId}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
                        >
                            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                {activeTab === 'profile' ? 'My Profile' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </h1>
                            <p className="text-xs text-slate-500 hidden sm:block">Welcome back, {user?.strName.split(' ')[0]}!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-white dark:border-[#0f172a]"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold">{user?.strName}</span>
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                    {user?.bolIsSuperAdmin ? 'Super Admin' : 'Member'}
                                </span>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/10 cursor-pointer hover:scale-105 transition-transform">
                                {user?.strName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${stat.color} group-hover:scale-110 transition-transform`}></div>
                                    <CardContent className="p-6 flex items-center gap-5">
                                        <div className={`h-14 w-14 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                                            <stat.icon size={28} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-2 space-y-8">
                                <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-[#0f172a]">
                                    <div className="h-32 bg-gradient-to-r from-primary to-primary/40 relative">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                    </div>
                                    <CardContent className="relative pt-0 px-8 pb-8">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-8">
                                            <div className="h-32 w-32 rounded-3xl border-[6px] border-white dark:border-[#0f172a] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-5xl font-bold text-primary shadow-2xl relative group">
                                                {user?.strName.charAt(0).toUpperCase()}
                                                <button className="absolute bottom-2 right-2 p-2 rounded-xl bg-white dark:bg-slate-900 shadow-lg text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <div className="text-center sm:text-left flex-1 pb-2">
                                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{user?.strName}</h2>
                                                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-slate-500">
                                                    <Mail size={14} />
                                                    <span className="text-sm">{user?.strEmailId}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 pb-2">
                                                <Button size="sm" className="rounded-xl shadow-lg shadow-primary/20">
                                                    Edit Profile
                                                </Button>
                                                <Button size="sm" variant="outline" className="rounded-xl">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        </div>

                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="strName" className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="strName"
                                                            value={formData.strName}
                                                            onChange={(e) => setFormData({ ...formData, strName: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="strMobileNo" className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Number</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="strMobileNo"
                                                            value={formData.strMobileNo}
                                                            onChange={(e) => setFormData({ ...formData, strMobileNo: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                            placeholder="+1 (555) 000-0000"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="strPreferredLanguage" className="text-xs font-bold uppercase tracking-wider text-slate-400">Language</Label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="strPreferredLanguage"
                                                            value={formData.strPreferredLanguage}
                                                            onChange={(e) => setFormData({ ...formData, strPreferredLanguage: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="strTimeZone" className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Zone</Label>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="strTimeZone"
                                                            value={formData.strTimeZone}
                                                            onChange={(e) => setFormData({ ...formData, strTimeZone: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    {updateSuccess && (
                                                        <div className="flex items-center gap-2 text-green-600 animate-fade-in bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                                                            <CheckCircle2 size={16} />
                                                            <span className="text-xs font-bold">Profile updated successfully!</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button type="submit" disabled={isUpdating} className="rounded-xl px-8 h-11 shadow-lg shadow-primary/20">
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </Button>
                                            </div>
                                        </form>

                                        <form onSubmit={handleChangePassword} className="space-y-6 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <Lock size={18} className="text-primary" />
                                                Change Password
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">Current Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="currentPassword"
                                                            type="password"
                                                            value={passwordData.currentPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                            placeholder="Current Password"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword">New Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="newPassword"
                                                            type="password"
                                                            value={passwordData.newPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                            placeholder="New Password"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                        <Input
                                                            id="confirmPassword"
                                                            type="password"
                                                            value={passwordData.confirmPassword}
                                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                            className="pl-10 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-primary/20"
                                                            placeholder="Confirm New Password"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {passwordError && (
                                                <p className="text-xs text-destructive font-medium">{passwordError}</p>
                                            )}
                                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-2">
                                                    {passwordSuccess && (
                                                        <div className="flex items-center gap-2 text-green-600 animate-fade-in bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
                                                            <CheckCircle2 size={16} />
                                                            <span className="text-xs font-bold">Password changed successfully!</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button type="submit" disabled={isChangingPassword} variant="outline" className="rounded-xl px-8 h-11">
                                                    {isChangingPassword ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        'Update Password'
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar Widgets */}
                            <div className="space-y-8">
                                {/* Activity Widget */}
                                <Card className="border-none shadow-sm bg-white dark:bg-[#0f172a]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6">
                                        <div className="space-y-6">
                                            {recentActivity.map((item) => (
                                                <div key={item.id} className="flex gap-4 relative group">
                                                    {item.id !== recentActivity.length && (
                                                        <div className="absolute left-[18px] top-10 bottom-[-24px] w-[2px] bg-slate-100 dark:bg-slate-800"></div>
                                                    )}
                                                    <div className={`h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                                        <item.icon size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.action}</p>
                                                        <p className="text-xs text-slate-500">{item.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" className="w-full mt-8 rounded-xl text-primary font-bold text-xs group">
                                            View All Activity
                                            <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Security Banner */}
                                <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <CardContent className="p-6 relative z-10">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                                            <Shield className="text-primary" size={24} />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">Security Score</h4>
                                        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                            <div className="bg-primary h-2 rounded-full w-[85%] shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">Your account security is strong, but you can still enable 2FA for maximum protection.</p>
                                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-xs h-10">
                                            Enhance Security
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

interface NavItemProps {
    icon: any;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group
                ${active
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }
            `}
        >
            <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-primary'} transition-colors`} />
            <span className="font-bold text-sm">{label}</span>
            {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white"></div>}
        </button>
    );
};

export default Dashboard;
