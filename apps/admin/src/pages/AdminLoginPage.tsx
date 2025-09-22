import React, { useState } from 'react';

// useNavigate 훅은 <Router> 컴포넌트 내부에서만 사용할 수 있으므로,
// 단독 파일에서 오류가 발생하는 것을 해결하기 위해 이 부분을 제거하고 상태를 직접 관리하도록 수정했습니다.
// 로그인 성공 시 '대시보드'를 표시하여 페이지 전환을 시뮬레이션합니다.

const mockAdminUsers = [
    { id: '1', email: 'admin@recipick.com', password: 'admin123!', name: 'Admin User' },
];

// 로그인 성공 시 보여줄 간단한 대시보드 컴포넌트
const AdminDashboard = () => {
    const handleLogout = () => {
        localStorage.removeItem('admin_state');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md bg-white dark:bg-[#333] text-center">
                <h2 className="text-3xl font-extrabold text-[#4B4B4B] dark:text-[#E0E0E0]">
                    로그인 성공!
                </h2>
                <p className="mt-2 text-sm text-[#878787] dark:text-[#A0A0A0]">
                    관리자 대시보드에 오신 것을 환영합니다.
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#6789A5] hover:bg-[#5A7E9D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6789A5]"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
};

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const admin = mockAdminUsers.find(
                user => user.email === email && user.password === password
            );

            if (!admin) {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
                return;
            }

            const adminState = {
                isAuthenticated: true,
                role: 'admin',
                adminInfo: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name
                }
            };

            localStorage.setItem('admin_state', JSON.stringify(adminState));
            setIsLoggedIn(true);
        } catch (err) {
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 데모 계정 정보를 삭제해달라는 요청에 따라 이 부분을 제거했습니다.
    // const handleDemoLogin = () => {
    //   setEmail('admin@recipick.com');
    //   setPassword('admin123!');
    // };

    if (isLoggedIn) {
        return <AdminDashboard />;
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-[#6789A5]">
                        <span className="text-white font-bold text-xl">R</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#4B4B4B] dark:text-[#E0E0E0]">
                        관리자 로그인
                    </h2>
                    <p className="mt-2 text-center text-sm text-[#878787] dark:text-[#A0A0A0]">
                        Recipick 관리자 페이지에 오신 것을 환영합니다
                    </p>
                </div>

                <div className="bg-white dark:bg-[#333] rounded-lg shadow-md p-8 border border-[#D1D1D1] dark:border-[#404040]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                            로그인 실패
                                        </h3>
                                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                            {error}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0]">
                                이메일 주소
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#D1D1D1] dark:border-[#404040] placeholder-[#878787] dark:placeholder-[#A0A0A0] text-[#4B4B4B] dark:text-[#E0E0E0] dark:bg-[#333] focus:outline-none focus:ring-[#6789A5] focus:border-[#6789A5] focus:z-10 sm:text-sm"
                                    placeholder="admin@recipick.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0]">
                                비밀번호
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-[#D1D1D1] dark:border-[#404040] placeholder-[#878787] dark:placeholder-[#A0A0A0] text-[#4B4B4B] dark:text-[#E0E0E0] dark:bg-[#333] focus:outline-none focus:ring-[#6789A5] focus:border-[#6789A5] focus:z-10 sm:text-sm"
                                    placeholder="비밀번호를 입력하세요"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#6789A5] hover:bg-[#5A7E9D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6789A5] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        로그인 중...
                                    </div>
                                ) : (
                                    '로그인'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;