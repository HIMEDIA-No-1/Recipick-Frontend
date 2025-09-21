import React, { useState, useEffect } from "react";
import { LogOut, User, Bell, Menu, Sun, Moon, Utensils, Refrigerator } from 'lucide-react';

interface User {
    name: string;
}

const Header: React.FC = () => {
    // Mock user state with type definition
    const [user, setUser] = useState<User | null>({ name: "사용자 이름" });
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Replaces router's navigate, simulating page changes
    const navigate = (path: string) => {
        console.log(`Navigating to ${path}`);
        // In a real app, you would use: window.location.href = path;
    };

    const handleLogout = () => {
        // In a real app, this would clear the user's auth token.
        console.log("Logging out...");
        setUser(null);
        setIsMenuOpen(false);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // Toggle body class to apply dark mode styles
        document.body.classList.toggle('dark', !isDarkMode);
    };

    // Close the menu if a click occurs outside of it
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest(".menu-container")) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, [isMenuOpen]);

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-[#FAF7F2] shadow-sm h-20">
            <script src="https://cdn.tailwindcss.com"></script>
            {isDarkMode && (
                <style>{`
                    .dark {
                        background-color: #121212;
                        color: #E0E0E0;
                    }
                    .dark .text-[#4B4B4B] { color: #E0E0E0; }
                    .dark .text-[#878787] { color: #A0A0A0; }
                    .dark .bg-[#FAF7F2] { background-color: #242424; }
                    .dark .border-[#F0EEEB] { border-color: #404040; }
                    .dark .hover:bg-[#F0EEEB]:hover { background-color: #333; }
                `}</style>
            )}
            <div className="flex items-center justify-between h-20 w-full px-4 sm:px-10">
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate('/')} className="flex items-center">
                        <h1 className="text-3xl font-bold text-[#6789A5]">Recipick</h1>
                    </button>
                    <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
                        <button
                            onClick={() => navigate('/fridge')}
                            className="text-[#7A7E7B] hover:text-[#6789A5] font-semibold transition-colors flex items-center gap-1"
                        >
                            <Refrigerator className="w-5 h-5" />
                            냉장고
                        </button>

                        <button
                            onClick={() => navigate('/recipes')}
                            className="text-[#7A7E7B] hover:text-[#6789A5] font-semibold transition-colors flex items-center gap-1"
                        >
                            <Utensils className="w-5 h-5" />
                            레시피
                        </button>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none"
                        title={isDarkMode ? "라이트 모드" : "다크 모드"}
                    >
                        {isDarkMode ? <Sun className="text-[#878787]" /> : <Moon className="text-[#878787]" />}
                    </button>

                    <button
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none relative"
                        title="알림"
                        onClick={() => console.log("알림 버튼 클릭")}
                    >
                        <Bell className="text-[#878787]" />
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">3</span>
                    </button>

                    <div className="relative menu-container">
                        <button
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            <Menu className="text-[#878787]" />
                        </button>

                        <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-[#D1D1D1] transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible transform scale-100' : 'opacity-0 invisible transform scale-95'}`}>
                            <div className="p-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm text-[#6789A5] border-b border-[#F0EEEB] font-semibold">
                                            {user.name}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate('/my-info');
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#7A7E7B] hover:bg-[#F0EEEB] rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <User className="w-4 h-4" />
                                            내 정보 수정
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            로그아웃
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full text-left px-4 py-2 text-sm text-[#6789A5] font-semibold hover:bg-[#E0EBF7] rounded-lg transition-colors"
                                    >
                                        로그인
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
