'use client'; // Required because we use hooks and state

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
    LogOut,
    LayoutDashboard,
    CheckSquare,
    BarChart2,
    Book,
    Menu,
    X,
    Users,
    QrCode
} from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { user, logout } = useAuth();
    const router = useRouter();     // Replaces useNavigate
    const pathname = usePathname(); // Replaces useLocation().pathname
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const isActive = (path) => {
        return pathname === path
            ? 'bg-purple-700 text-white shadow-md'
            : 'text-purple-100 hover:bg-purple-800 hover:text-white';
    };

    // Refactored NavItem for Next.js
    const NavItem = ({ href, icon: Icon, label }) => (
        <Link
            href={href} // Replaces 'to'
            onClick={() => setIsMobileMenuOpen(false)}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(href)}`}
        >
            <Icon className={`mr-3 h-5 w-5 ${isActive(href) ? 'text-white' : 'text-purple-300 group-hover:text-white'}`} />
            {label}
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar for Desktop */}
            <div className="hidden md:flex md:w-64 md:flex-col fixed h-full z-10">
                <div className="flex flex-col grow pt-5 bg-indigo-900 overflow-y-auto">
                    <div className="flex items-center gap-3 px-4 mb-8">
                        <div className="h-12 w-12 bg-linear-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                            <QrCode className="text-white" size={28} />
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">SmartAttend</span>
                    </div>

                    <nav className="flex-grow flex flex-col px-4 space-y-2">
                        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                        {user?.role === 'teacher' && (
                            <>
                                <NavItem href="/attendance/bulk" icon={Users} label="Class Attendance" />
                                <NavItem href="/attendance/mark" icon={CheckSquare} label="Single Entry" />
                                <NavItem href="/subjects" icon={Book} label="Manage Subjects" />
                                <NavItem href="/attendance/reports" icon={BarChart2} label="Analytics" />
                            </>
                        )}
                    </nav>

                    <div className="p-4 border-t border-indigo-800">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="ml-3 cursor-pointer" onClick={() => router.push('/profile')}>
                                <p className="text-sm font-medium text-white hover:text-purple-200 transition">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-purple-300 capitalize">{user?.role}</p>
                            </div>
                            <button onClick={handleLogout} className="ml-auto text-purple-300 hover:text-white">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between bg-indigo-900 p-4 shadow-md">
                    <span className="text-white font-bold text-lg">AK Nexus</span>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-indigo-900 absolute top-16 left-0 w-full z-20 p-4 space-y-2 shadow-xl">
                        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        {user?.role === 'teacher' && (
                            <>
                                <NavItem href="/attendance/mark" icon={CheckSquare} label="Mark Attendance" />
                                <NavItem href="/subjects" icon={Book} label="Manage Subjects" />
                                <NavItem href="/attendance/reports" icon={BarChart2} label="Analytics" />
                            </>
                        )}
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-900 rounded-xl">
                            <LogOut className="mr-3 h-5 w-5" /> Logout
                        </button>
                    </div>
                )}

                <main className="flex-1 p-8 overflow-y-auto">
                    {children}

                    <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} AK Nexus. Built for Campus Excellence.</p>
                        <p className="mt-1 text-xs text-gray-400">Version 2.4.0 (Enterprise Edition)</p>
                    </footer>
                </main>
            </div>
        </div>
    );
}