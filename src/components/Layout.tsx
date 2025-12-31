import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    LogOut,
    LayoutDashboard,
    Settings,
    Bell,
    Menu as MenuIcon,
    X,
    Shield,
    Users,
    Key,
    Search,
    ChevronRight
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: User, label: 'Profile', path: '/dashboard' }, // Profile is currently part of dashboard
    ];

    const adminItems = [
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: Shield, label: 'Role Management', path: '/admin/roles' },
        { icon: Key, label: 'Permissions', path: '/admin/permissions' },
        { icon: MenuIcon, label: 'Menu Management', path: '/admin/menus' },
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
                        <Link to="/dashboard" className="flex items-center gap-3 font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <LayoutDashboard size={24} />
                            </div>
                            <span>TaskFlow</span>
                        </Link>
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
                        {navItems.map((item) => (
                            <NavItem
                                key={item.path}
                                icon={item.icon}
                                label={item.label}
                                active={location.pathname === item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsSidebarOpen(false);
                                }}
                            />
                        ))}

                        {user?.bolIsSuperAdmin && (
                            <>
                                <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-6 mb-2">Administration</p>
                                {adminItems.map((item) => (
                                    <NavItem
                                        key={item.path}
                                        icon={item.icon}
                                        label={item.label}
                                        active={location.pathname === item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsSidebarOpen(false);
                                        }}
                                    />
                                ))}
                            </>
                        )}
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
                            <MenuIcon size={24} />
                        </button>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <span className="font-medium text-slate-900 dark:text-white">
                                {location.pathname.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard'}
                            </span>
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

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
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

export default Layout;
