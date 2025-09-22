import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRouteGuard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 로컬 스토리지에서 사용자 상태 확인
        const userState = JSON.parse(localStorage.getItem('user_state') as string);
        if (userState?.isAuthenticated) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        // 로딩 중 스피너 또는 스켈레톤 UI 표시
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>;
    }

    // 인증되지 않았다면 로그인 페이지로 리다이렉션
    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    // 인증되었다면 자식 컴포넌트(페이지) 렌더링
    return <Outlet />;
};

export default UserRouteGuard;