import React, { useState, useEffect } from "react";
import {
    LogOut,
    User as UserIcon,
    Bell,
    Menu,
    Sun,
    Moon,
    Utensils,
    Refrigerator
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface User {
    name: string;
}

const Header: React.FC = () => {
    const [user, setUser] = useState<User | null>({ name: "사용자 이름" });
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logging out...");
        setUser(null);
        setIsMenuOpen(false);
        navigate("/auth/login"); // 로그아웃 후 로그인 페이지로 이동
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle("dark", !isDarkMode);
    };

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
            <div className="flex items-center justify-between h-20 w-full px-4 sm:px-10">
                {/* 로고 + 메뉴 */}
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate("/")} className="flex items-center">
                        <h1 className="text-3xl font-bold text-[#6789A5]">Recipick</h1>
                    </button>
                    <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
                        <button
                            onClick={() => navigate("/fridges")}
                            className="text-[#7A7E7B] hover:text-[#6789A5] font-semibold transition-colors flex items-center gap-1"
                        >
                            <Refrigerator className="w-5 h-5" />
                            냉장고
                        </button>
                        <button
                            onClick={() => navigate("/recipes")}
                            className="text-[#7A7E7B] hover:text-[#6789A5] font-semibold transition-colors flex items-center gap-1"
                        >
                            <Utensils className="w-5 h-5" />
                            레시피
                        </button>
                    </nav>
                </div>

                {/* 오른쪽 아이콘들 */}
                <div className="flex items-center space-x-4">
                    {/* 다크모드 버튼 */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none"
                        title={isDarkMode ? "라이트 모드" : "다크 모드"}
                    >
                        {isDarkMode ? (
                            <Sun className="text-[#878787]" />
                        ) : (
                            <Moon className="text-[#878787]" />
                        )}
                    </button>

                    {/* 알림 버튼 */}
                    <button
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none relative"
                        title="알림"
                        onClick={() => navigate("/notifications")}
                    >
                        <Bell className="text-[#878787]" />
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                            3
                        </span>
                    </button>

                    {/* 메뉴 드롭다운 */}
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

                        <div
                            className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-[#D1D1D1] transition-all duration-300 ease-in-out ${
                                isMenuOpen
                                    ? "opacity-100 visible scale-100"
                                    : "opacity-0 invisible scale-95"
                            }`}
                        >
                            <div className="p-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm text-[#6789A5] border-b border-[#F0EEEB] font-semibold">
                                            {user.name}
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate("/mypage/profile");
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#7A7E7B] hover:bg-[#F0EEEB] rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <UserIcon className="w-4 h-4" />
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
                                        onClick={() => navigate("/auth/login")}
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
};

export default Header;
