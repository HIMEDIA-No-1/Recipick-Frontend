import React from 'react';

const LoginPage: React.FC = () => {
    const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
        // OAuth2 login process
        console.log(`Attempting to login with ${provider}`);
        // window.location.href = `/api/auth/oauth2/${provider}`;
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            {/* Background decorations for a more dynamic look */}
            <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#A89F94] rounded-full"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E0EBF7] rounded-full"></div>
            </div>

            {/* Main content container */}
            <div className="max-w-md w-full text-center">
                {/* Logo section */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-[#4B4B4B] mb-2">Recipick</h1>
                    <p className="text-[#878787] text-lg mb-1">냉장고 속 재료로 맛있는 레시피를</p>
                    <p className="text-[#6789A5] text-xl font-semibold">3초만에 시작해보세요</p>
                </div>

                {/* Login card */}
                <div className="bg-[#FAF7F2] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#F0EEEB]">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#4B4B4B] mb-2">시작하기</h2>
                        <p className="text-[#A8A8A8]">소셜 계정으로 간편하게 로그인하세요</p>
                    </div>

                    <div className="space-y-4">
                        {/* Google Login Button */}
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-[#F0EEEB] text-[#7A7E7B] font-semibold rounded-xl transition-colors shadow-md transform active:scale-95 border border-[#D1D1D1]"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span>Google로 계속하기</span>
                        </button>

                        {/* Kakao Login Button */}
                        <button
                            onClick={() => handleSocialLogin('kakao')}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-xl transition-colors shadow-md transform active:scale-95"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.41 2 10.58c0 2.66 1.74 4.99 4.37 6.33l-.84 3.07c-.09.34.34.6.65.39l3.64-2.43c.72.07 1.46.11 2.18.11 5.52 0 10-3.41 10-7.58S17.52 3 12 3z"/>
                            </svg>
                            <span>카카오로 계속하기</span>
                        </button>

                        {/* Naver Login Button */}
                        <button
                            onClick={() => handleSocialLogin('naver')}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-md transform active:scale-95"
                        >
                            <svg className="w-5 h-5 mr-3 fill-white" viewBox="0 0 24 24">
                                <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                            </svg>
                            <span>네이버로 계속하기</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-[#A8A8A8]">
                        <p>계속 진행하면 <span className="text-[#6789A5] hover:text-[#53738F] font-semibold transition-colors cursor-pointer">이용약관</span> 및 <span className="text-[#6789A5] hover:text-[#53738F] font-semibold transition-colors cursor-pointer">개인정보처리방침</span>에</p>
                        <p>동의하는 것으로 간주됩니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
