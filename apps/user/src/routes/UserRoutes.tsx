import { Routes, Route, Navigate } from 'react-router-dom';
import UserRouteGuard from './UserRouteGuard';

// 페이지 컴포넌트 불러오기
import LandingPage from '../pages/LandingPage.tsx';
import LoginPage from '../pages/auth/LoginPage.tsx';
import SignupPage from '../pages/auth/SignupPage.tsx';
import RecipeListPage from '../pages/recipe/RecipeListPage.tsx';
import RecipeDetailPage from '../pages/recipe/RecipeDetailPage.tsx';
import NotificationPage from '../pages/notification/NotificationPage.tsx';
// import MyProfileEditPage from '../pages/mypage/MyProfileEditPage.tsx';
import MyRecipePage from '../pages/mypage/MyRecipePage.tsx';
import MyStatisticsPage from '../pages/mypage/MyStatisticsPage.tsx';
import FridgeListPage from '../pages/refrigerator/FridgeListPage.tsx';
import FridgeDetailPage from '../pages/refrigerator/FridgeDetailPage.tsx';
import CompartmentDetailPage from '../pages/refrigerator/CompartmentDetailPage.tsx';
import NotFoundPage from '../pages/error/NotFoundPage.tsx';
import FindPasswordPage from "../pages/auth/FindPasswordPage.tsx";

const UserRoutes = () => {
    return (

            <Routes>
                {/* 공개 페이지 (라우트 가드 불필요) */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/signup" element={<SignupPage />} />
                <Route path="/auth/find-password" element={<FindPasswordPage />} />

                {/* 사용자 전용 페이지 (UserRouteGuard 필요) */}
                <Route element={<UserRouteGuard />}>
                    <Route path="/fridges" element={<FridgeListPage />} />
                    <Route path="/fridges/:fridgeId" element={<FridgeDetailPage />} />
                    <Route path="/fridges/:fridgeId/:compartmentId" element={<CompartmentDetailPage />} />
                    <Route path="/recipes" element={<RecipeListPage />} />
                    <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
                    <Route path="/notifications" element={<NotificationPage />} />
                    {/*<Route path="/mypage/profile" element={<MyProfileEditPage />} />*/}
                    <Route path="/mypage/recipe" element={<MyRecipePage />} />
                    <Route path="/mypage/statistics" element={<MyStatisticsPage />} />
                </Route>

                {/* 에러 페이지 */}
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
            </Routes>
    );
};

export default UserRoutes;