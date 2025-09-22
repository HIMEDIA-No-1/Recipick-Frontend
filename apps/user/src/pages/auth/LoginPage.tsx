import { useState } from 'react';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

const LoginPage = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
        else if (!validateEmail(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다.';
        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
        else if (formData.password.length < 6) newErrors.password = '비밀번호는 6자리 이상이어야 합니다.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const userData = {
                isAuthenticated: true,
                userId: 'user-001',
                nickname: '홍길동',
                profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
                isInitialSetupCompleted: true,
                credentialType: 'EMAIL'
            };
            localStorage.setItem('user_state', JSON.stringify(userData));
            window.location.href = '/fridges';
        } catch (error) {
            setErrors({ general: '로그인에 실패했습니다. 다시 시도해주세요.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#242424] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#333] p-8 rounded-2xl border border-[#D1D1D1] dark:border-[#404040] shadow-sm">
                {/* 로고 및 제목 */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#6789A5] dark:text-[#E0E0E0] mb-2">Recipick</h1>
                    <h2 className="text-2xl font-semibold text-[#4B4B4B] dark:text-[#E0E0E0]">로그인</h2>
                    <p className="mt-2 text-sm text-[#878787] dark:text-[#A0A0A0]">계정에 로그인하여 냉장고를 관리해보세요</p>
                </div>

                {/* 로그인 폼 */}
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {errors.general && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* 이메일 입력 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">이메일</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#878787] dark:text-[#A0A0A0]"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`appearance-none relative block w-full pl-10 px-3 py-3 border ${errors.email ? 'border-red-300' : 'border-[#D1D1D1] dark:border-[#404040]'} placeholder-[#878787] dark:placeholder-[#A0A0A0] text-[#4B4B4B] dark:text-[#E0E0E0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-[#6789A5] dark:bg-[#242424] transition-colors`}
                                    placeholder="이메일을 입력하세요"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#4B4B4B] dark:text-[#E0E0E0] mb-1">비밀번호</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#878787] dark:text-[#A0A0A0]"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`appearance-none relative block w-full pl-10 pr-10 px-3 py-3 border ${errors.password ? 'border-red-300' : 'border-[#D1D1D1] dark:border-[#404040]'} placeholder-[#878787] dark:placeholder-[#A0A0A0] text-[#4B4B4B] dark:text-[#E0E0E0] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6789A5] focus:border-[#6789A5] dark:bg-[#242424] transition-colors`}
                                    placeholder="비밀번호를 입력하세요"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#878787] dark:text-[#A0A0A0] hover:text-[#4B4B4B] dark:hover:text-[#E0E0E0]"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.76 9.76 0 0 0 5.11-1.46" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#878787] dark:text-[#A0A0A0] hover:text-[#4B4B4B] dark:hover:text-[#E0E0E0]"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                        </div>
                    </div>

                    {/* 로그인 버튼 */}
                    <div>
                        <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-[#6789A5] hover:bg-[#5A7E9D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6789A5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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

                    {/* 구분선 */}
                    <div className="flex items-center my-6">
                        <hr className="flex-grow border-t border-[#D1D1D1] dark:border-[#404040]" />
                        <span className="mx-4 text-xs text-[#878787] dark:text-[#A0A0A0]">또는</span>
                        <hr className="flex-grow border-t border-[#D1D1D1] dark:border-[#404040]" />
                    </div>

                    {/* 소셜 로그인 버튼 */}
                    <div className="space-y-4">
                        <a href="/404" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-[#242424] hover:bg-[#F0EEEB] dark:hover:bg-[#2F2F2F] text-[#7A7E7B] dark:text-[#E0E0E0] font-semibold rounded-xl transition-colors shadow-md border border-[#D1D1D1] dark:border-[#404040]">
                            {/* Google 아이콘 */}
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Google로 계속하기</span>
                        </a>

                        <a href="/404" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-gray-900 font-semibold rounded-xl transition-colors shadow-md">
                            {/* Kakao 아이콘 */}
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.41 2 10.58c0 2.66 1.74 4.99 4.37 6.33l-.84 3.07c-.09.34.34.6.65.39l3.64-2.43c.72.07 1.46.11 2.18.11 5.52 0 10-3.41 10-7.58S17.52 3 12 3z"/>
                            </svg>
                            <span>카카오로 계속하기</span>
                        </a>

                        <a href="/404" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-md">
                            {/* Naver 아이콘 */}
                            <svg className="w-5 h-5 mr-3 fill-white" viewBox="0 0 24 24">
                                <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                            </svg>
                            <span>네이버로 계속하기</span>
                        </a>
                    </div>

                    {/* 링크 */}
                    <div className="flex items-center justify-between text-sm">
                        <a href="/auth/find-password" className="text-[#6789A5] hover:text-[#5A7E9D] transition-colors">비밀번호 찾기</a>
                        <a href="/auth/signup" className="text-[#6789A5] hover:text-[#5A7E9D] transition-colors">회원가입</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
