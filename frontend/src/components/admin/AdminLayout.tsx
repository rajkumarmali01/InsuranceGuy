import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/leads', label: 'Leads', icon: FileText },
        { path: '/admin/users', label: 'Users', icon: Users },
        // { path: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Desktop */}
            <aside className={`bg-slate-900 text-white w-64 flex-shrink-0 hidden md:flex flex-col transition-all duration-300`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-wider">ADMIN PANEL</span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-xl font-bold">ADMIN PANEL</span>
                    <button onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-6 w-6 text-slate-400" />
                    </button>
                </div>
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-white shadow-sm z-10">
                    <div className="h-16 flex items-center px-4">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="ml-4 text-lg font-semibold text-gray-900">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
