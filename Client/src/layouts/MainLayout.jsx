import React, { useState, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import { 
    FiMenu, 
    FiX, 
    FiHome, 
    FiSettings, 
    FiUser, 
    FiLogOut,
} from 'react-icons/fi';

// Import your page components here
import Home from '../pages/Home';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: FiHome, label: 'Home' },
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navigation Bar */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-400 hover:text-white focus:outline-none"
                            >
                                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                            <div className="ml-4 text-xl font-bold text-white">
                                Buto AI
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar & Content */}
            <div className="flex">
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0
                `}>
                    <nav className="mt-16 px-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-300 
                                                 hover:bg-gray-700 rounded-lg transition-colors"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;
