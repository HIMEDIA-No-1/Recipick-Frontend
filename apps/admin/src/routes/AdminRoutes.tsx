import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRouteGuard from './AdminRouteGuard';

// 페이지 컴포넌트 불러오기
import AdminLoginPage from '../pages/AdminLoginPage.tsx';
import DashboardPage from '../pages/DashboardPage.tsx';
import UserManagementPage from '../pages/UserManagementPage.tsx';
import ContentManagementPage from '../pages/ContentManagementPage.tsx';
import NotFoundPage from '../pages/NotFoundPage.tsx';

const AdminRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 관리자 로그인 페이지는 가드 불필요 */}
                <Route path="/auth" element={<AdminLoginPage />} />

                {/* 관리자 전용 페이지 (AdminRouteGuard 필요) */}
                <Route element={<AdminRouteGuard />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/users" element={<UserManagementPage />} />
                    <Route path="/contents" element={<ContentManagementPage />} />
                </Route>

                {/* 에러 페이지 */}
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AdminRoutes;