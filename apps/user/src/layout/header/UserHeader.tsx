import React, { useState, useEffect } from "react";
import {
    LogOut,
    User as UserIcon,
    Bell,
    Menu,
    Refrigerator,
    Heart,
    BarChart,
    ChefHat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import recipickLogo from "../../../assets/logo_full_m.png";
import { StorageUtil, type UserState, type NotificationsData } from "../../utils/localStorage";

const Header: React.FC = () => {
    const [user, setUser] = useState<UserState | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationsData>({ allNotifications: [] });
    const navigate = useNavigate();

    // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
    useEffect(() => {
        const userState = StorageUtil.getUserState();
        if (userState?.isAuthenticated) {
            setUser(userState);
        }

        const notificationData = StorageUtil.getNotificationsData();
        if (notificationData) {
            setNotifications(notificationData);
        }
    }, []);

    const handleLogout = () => {
        // 명세서에 따라 모든 데이터 삭제
        StorageUtil.clearAll();
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
                            <ChefHat className="w-5 h-5" />
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
                            {notifications.allNotifications.filter(n => !n.isRead).length > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                    {notifications.allNotifications.filter(n => !n.isRead).length}
                                </span>
                            )}
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
                                {notifications.allNotifications.length === 0 ? (
                                    <div className="p-2 text-center text-[#7A7E7B]">
                                        알림이 없습니다.
                                    </div>
                                ) : (
                                    <>
                                        {notifications.allNotifications.slice(0, 3).map((notification) => (
                                            <div key={notification.notificationId} className={`p-2 border-b border-[#F0EEEB] ${!notification.isRead ? 'bg-blue-50' : ''}`}>
                                                <p className="font-semibold">{notification.type === 'INVITE_FRIDGE' ? '냉장고 초대' : '메시지'}</p>
                                                <p className="text-xs text-[#7A7E7B]">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-[#878787] mt-1">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}

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
                                    </>
                                )}
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