import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminRouteGuard from './AdminRouteGuard';
import AdminLayout from '../layout/AdminLayout';

// 페이지 컴포넌트 불러오기
import AdminLoginPage from '../pages/AdminLoginPage';
import DashboardPage from '../pages/DashboardPage';
import UserManagementPage from '../pages/UserManagementPage';
import ContentManagementPage from '../pages/ContentManagementPage';
import NotFoundPage from '../pages/NotFoundPage';

const AdminRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 관리자 로그인 페이지는 가드 불필요 */}
                <Route path="/auth" element={<AdminLoginPage />} />

                {/* 관리자 전용 페이지 (AdminRouteGuard 필요) */}
                <Route element={<AdminRouteGuard />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/users" element={<UserManagementPage />} />
                        <Route path="/contents" element={<ContentManagementPage />} />
                    </Route>
                </Route>

                {/* 에러 페이지 */}
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AdminRoutes;