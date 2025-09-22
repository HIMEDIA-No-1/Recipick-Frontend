import React, { useState } from 'react';
import { Settings, LogOut, User, Bell, Menu, X } from 'lucide-react';

interface AdminUser {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface AdminHeaderProps {
    currentPage?: string;
    onNavigate?: (page: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ currentPage, onNavigate }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const adminUser: AdminUser = {
        id: 1,
        email: 'admin@recipick.com',
        name: '관리자',
        role: '최고 관리자'
    };

    const navigationItems = [
        { key: 'dashboard', label: '대시보드', path: '/admin/dashboard' },
        { key: 'users', label: '사용자 관리', path: '/admin/users' },
        { key: 'content', label: '콘텐츠 관리', path: '/admin/content' }
    ];

    const handleNavigation = (page: string) => {
        console.log('Navigate to:', page);
        onNavigate?.(page);
        setShowMobileMenu(false);
    };

    const handleLogout = () => {
        console.log('Admin logout');
        if (confirm('로그아웃 하시겠습니까?')) {
            // 로그아웃 처리
            console.log('Logout confirmed');
        }
    };

    const handleSettings = () => {
        console.log('Navigate to admin settings');
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* 로고 및 모바일 메뉴 버튼 */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-800"
                        >
                            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <div className="flex items-center ml-2 md:ml-0">
                            <h1 className="text-2xl font-bold text-emerald-600">Recipick</h1>
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                ADMIN
              </span>
                        </div>
                    </div>

                    {/* 데스크톱 네비게이션 */}
                    <nav className="hidden md:flex space-x-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handleNavigation(item.key)}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${
                                    currentPage === item.key
                                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* 우측 메뉴 */}
                    <div className="flex items-center space-x-4">
                        {/* 알림 */}
                        <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {/* 사용자 메뉴 */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-emerald-600" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium">{adminUser.name}</span>
                            </button>

                            {/* 사용자 드롭다운 */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-3 border-b">
                                        <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                                        <p className="text-xs text-gray-500">{adminUser.email}</p>
                                        <p className="text-xs text-emerald-600 font-medium">{adminUser.role}</p>
                                    </div>

                                    <button
                                        onClick={handleSettings}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <Settings className="w-4 h-4 mr-2" />
                                            설정
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <div className="flex items-center">
                                            <LogOut className="w-4 h-4 mr-2" />
                                            로그아웃
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 모바일 메뉴 */}
                {showMobileMenu && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => handleNavigation(item.key)}
                                    className={`block w-full text-left px-3 py-2 text-base font-medium transition-colors ${
                                        currentPage === item.key
                                            ? 'text-emerald-600 bg-emerald-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 배경 오버레이 (사용자 메뉴가 열렸을 때) */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}
        </header>
    );
};

export default AdminHeader;