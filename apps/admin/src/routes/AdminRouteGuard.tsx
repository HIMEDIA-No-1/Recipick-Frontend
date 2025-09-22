import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface AdminState {
    isAuthenticated: boolean;
    role: string;
}

const AdminRouteGuard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            // 로컬 스토리지에서 관리자 상태 확인
            const storedState = localStorage.getItem('admin_state');
            const adminState: AdminState = storedState ? JSON.parse(storedState) : null;
            if (adminState?.isAuthenticated && adminState?.role === 'admin') {
                setIsAuthenticated(true);
            }
        } catch (e) {
            console.error('Failed to parse admin state from localStorage', e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        // 로딩 중 스피너 또는 스켈레톤 UI 표시
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div></div>;
    }

    // 인증되지 않았거나 관리자 권한이 없으면 관리자 로그인 페이지로 리다이렉션
    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    // 인증되었다면 자식 컴포넌트(페이지) 렌더링
    return <Outlet />;
};

export default AdminRouteGuard;