import React, { useState, useEffect } from "react";
import {
    LogOut,
    User as UserIcon,
    Bell,
    Menu,
    Utensils,
    Refrigerator,
    Heart,
    BarChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import recipickLogo from "../../../assets/logo_full_m.png";

// 로컬 스토리지에서 초기 사용자 상태를 가져오는 함수
const getInitialUserState = () => {
    try {
        const storedState = localStorage.getItem("user_state");
        if (storedState) {
            const userState = JSON.parse(storedState);
            if (userState.isAuthenticated) {
                // 저장된 닉네임과 사용자 ID를 반환
                return {
                    nickname: userState.nickname,
                    userId: userState.userId,
                };
            }
        }
    } catch (e) {
        console.error("Failed to parse user state from localStorage", e);
    }
    return null;
};

const Header: React.FC = () => {
    // 초기 상태를 로컬 스토리지에서 가져오도록 설정
    const [user, setUser] = useState<{ nickname: string; userId: string } | null>(getInitialUserState);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // 로컬 스토리지에서 사용자 정보 삭제
        localStorage.removeItem("user_state");
        setUser(null);
        setIsMenuOpen(false);
        navigate("/auth/login");
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                isMenuOpen &&
                !target.closest(".menu-container") &&
                !target.closest(".menu-button")
            ) {
                setIsMenuOpen(false);
            }
            if (
                isNotificationOpen &&
                !target.closest(".notification-container") &&
                !target.closest(".notification-button")
            ) {
                setIsNotificationOpen(false);
            }
        };
        window.addEventListener("click", handleOutsideClick);
        return () => window.removeEventListener("click", handleOutsideClick);
    }, [isMenuOpen, isNotificationOpen]);

    return (
        <header className="fixed top-0 left-0 w-full z-40 bg-[#FAF7F2] shadow-md h-20">
            <div className="flex items-center justify-between h-20 w-full px-4 sm:px-10">
                {/* 로고 + 메뉴 */}
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate("/")} className="flex items-center">
                        <img
                            // 로컬 이미지 대신 임시 플레이스홀더 URL을 사용합니다.
                            src={recipickLogo}
                            alt="Recipick Logo"
                            className="h-10 sm:h-12"
                        />
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

                {/* 오른쪽 아이콘 */}
                <div className="flex items-center space-x-2">
                    {/* 알림 버튼 */}
                    <div className="relative notification-container">
                        <button
                            className="notification-button flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none relative"
                            title="알림"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsNotificationOpen(!isNotificationOpen);
                            }}
                        >
                            <Bell className="text-[#878787]" />
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                3
                            </span>
                        </button>

                        {/* 알림 드롭다운 */}
                        <div
                            className={`absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 border border-[#D1D1D1] transition-all duration-300 ease-in-out ${
                                isNotificationOpen
                                    ? "opacity-100 visible scale-100"
                                    : "opacity-0 invisible scale-95"
                            }`}
                        >
                            <div className="p-3 space-y-3 text-sm text-[#4B4B4B]">
                                {/* 공유 신청/승낙 알림 */}
                                <div className="p-2 border-b border-[#F0EEEB]">
                                    <p className="font-semibold">냉장고 공유 요청</p>
                                    <div className="flex gap-2 mt-1">
                                        <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                                            승인
                                        </button>
                                        <button className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600">
                                            거부
                                        </button>
                                    </div>
                                </div>

                                {/* 소비기한 알림 */}
                                <div className="p-2 border-b border-[#F0EEEB]">
                                    <p className="font-semibold">소비기한 임박</p>
                                    <p className="text-xs text-[#7A7E7B]">
                                        우유가 곧 만료됩니다.
                                    </p>
                                </div>

                                {/* 모든 알림 보기 */}
                                <button
                                    onClick={() => {
                                        setIsNotificationOpen(false);
                                        navigate("/notifications");
                                    }}
                                    className="w-full text-center text-[#6789A5] font-semibold hover:underline mt-2"
                                >
                                    모든 알림 보기
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 마이페이지 메뉴 */}
                    <div className="relative menu-container">
                        <button
                            className="menu-button flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#E0EBF7] transition-colors focus:outline-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                        >
                            <Menu className="text-[#878787]" />
                        </button>

                        <div
                            className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50 border border-[#D1D1D1] transition-all duration-300 ease-in-out ${
                                isMenuOpen
                                    ? "opacity-100 visible scale-100"
                                    : "opacity-0 invisible scale-95"
                            }`}
                        >
                            <div className="p-2">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm text-[#6789A5] border-b border-[#F0EEEB] font-semibold">
                                            {user.nickname}
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
                                            onClick={() => {
                                                navigate("/mypage/recipe");
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#7A7E7B] hover:bg-[#F0EEEB] rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <Heart className="w-4 h-4" /> 내가 찜한 레시피
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/mypage/statistics");
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#7A7E7B] hover:bg-[#F0EEEB] rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <BarChart className="w-4 h-4" /> 내 분석·통계
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